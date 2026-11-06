# Preventing Recurring HikariCP Pool Saturation Using Hindsight Memory

At 3:42 AM on a Tuesday, an alarm paged our primary on-call rotation. The checkout service was throwing thousands of HTTP 500 errors, p95 latency on `/v1/checkout/charge` had surged from 140ms to 2,840ms, and our primary PostgreSQL connection pool had hit 100% saturation. 

If this were an isolated, novel failure, an on-call engineer would spend the next hour digging through Grafana dashboards, profiling thread dumps, and reading database locks. But the most frustrating aspect of production engineering is that this was not a novel failure. Exactly five months earlier, our team had endured almost the identical outage. Back then, we spent 85 minutes discovering that HikariCP’s `maxLifetime` had been set to 30 minutes, exceeding upstream pgBouncer’s `server_idle_timeout` of 10 minutes. When pgBouncer dropped idle connections at the proxy layer, HikariCP continued dispatching checkout queries over dead TCP sockets, starving all 50 worker threads.

We had written a thorough post-mortem. We had documented the exact root cause in Confluence. Yet five months later, a different engineer was on call, a new release bumped connection parameters, and our engineering organization started from a blank page.

This is the problem of **production amnesia**. Every production outage is an expensive masterclass in how distributed systems fail. Yet because post-mortems live as passive text documents rather than active runtime memory, engineering organizations pay the price of the same outages over and over again.

To solve this, we architected **PagerLore**, an incident response intelligence platform built around [Hindsight](https://github.com/vectorize-io/hindsight), a persistent memory engine by Vectorize. Rather than relying on generic vector embeddings or naive RAG chunks, PagerLore grounds AI investigation in structured, long-term engineering memory.

---

## Why Basic RAG Fails in SRE Investigations

When engineers try to build AI incident assistants using conventional RAG, they quickly hit the limitations of vector similarity. RAG systems chunk documents, embed them into high-dimensional vector spaces, and run cosine similarity against the user query.

In infrastructure debugging, naive vector search fails for three concrete reasons:

1. **Semantic Drift without Temporal Awareness:** An error message like `PSQLException: Connection is not available, request timed out after 30005ms` matches hundreds of database queries across years of history. What matters is not merely that the text looks similar, but how the failure correlated with recent deployment diffs, configuration changes, and proxy layers.
2. **Lack of Entity Structure:** Infrastructure failures involve strict relational dependencies—such as the relationship between an application client pool (HikariCP), a connection proxy (pgBouncer), and the underlying PostgreSQL database. Unstructured chunks lose this relational topology.
3. **Absence of Evolving Beliefs:** A post-mortem should not just be a static document; it should extract persistent "world rules" and "experience facts" that actively influence subsequent investigations.

To understand how true long-term memory transforms agent reasoning, it is helpful to explore [what is agent memory](https://vectorize.io/what-is-agent-memory). In Hindsight, agent memory is separated into three distinct operational verbs: **Retain**, **Recall**, and **Reflect**.

---

## The System Architecture

PagerLore sits alongside your telemetry pipeline and deployment webhooks. When an incident is declared, it executes a deterministic 6-stage investigation workflow:

```
Telemetry Ingestion ──▶ Signal Extraction ──▶ Hindsight Recall (RRF)
                                                        │
                                                        ▼
Human Approval ◀── Surgical Remediation ◀── Ranked Hypotheses
      │
      ▼
Post-Mortem Submission ──▶ Hindsight Retain (Knowledge Extraction)
```

### 1. Multi-Strategy Recall

When an incident exhibits degraded metrics, PagerLore constructs a symptom query and dispatches it to Hindsight via the [official Hindsight API](https://hindsight.vectorize.io/). Rather than running a single vector lookup, Hindsight runs four parallel retrieval strategies (Semantic Similarity, BM25 Keyword Matching, Graph Traversal, and Temporal Proximity) and fuses them using Reciprocal Rank Fusion (RRF).

Here is the actual TypeScript implementation from our client service in `src/lib/hindsight/client.ts`:

```typescript
export async function recallHistoricalExperience(
  bankId: string,
  query: string,
  serviceFilter?: string
): Promise<HindsightRecallResponse> {
  const res = await fetch(`${HINDSIGHT_API_URL}/v1/banks/${bankId}/recall`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HINDSIGHT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      top_k: 4,
      budget: "mid",
      types: ["experience", "observation", "world"],
    }),
  });

  return await res.json();
}
```

The response returns structured `RecallResult` objects containing explicit fact classifications (`type: "experience"` or `type: "world"`), entity tags, and direct linkages back to the source incident ID.

---

## The Deep Technical Story: Memory OFF vs. Memory ON

To evaluate the tangible impact of persistent memory, we constructed a reproducible benchmark on an active incident: **INC-2024-142** ("Payments Service 500 Errors and Latency Surge following deployment v2.8.1").

We evaluated two parallel investigations of the exact same incident context:

### Mode A: Investigation Without Memory

The baseline agent analyzed the raw metrics and logs:
- Observed: HTTP 500 error rate at 28.4%, p95 latency at 2,840ms.
- Observed: HikariPool connection acquisition timeout exceeding 30,000ms.
- Git Diff: Deployment v2.8.1 commit `a4f91e8` touched checkout session timeouts.

Without historical memory, the agent produced speculative hypotheses with low confidence:
- **Hypothesis 1 (46% Confidence):** "Database connection pool exhaustion caused by high incoming checkout traffic or slow query execution."
- **Proposed Action:** "Scale payments-service pod replicas from 3 to 6 or restart pods."

Scaling up pods would have doubled the active connection pool against the database, worsening proxy connection exhaustion. Restarting pods would have provided only transient relief before the connection pool locked up again within 90 seconds.

### Mode B: Investigation With Hindsight Memory

When Hindsight memory was active, the agent queried the `pagerlore-production-bank` memory bank. The multi-strategy retrieval surfaced memory `mem-hindsight-8901-hikari` from resolved incident **INC-2024-089** with a 0.96 relevance score:

> *"HikariCP maxLifetime was misconfigured to 1800000ms (30m) which exceeded pgBouncer server_idle_timeout of 600s (10m). When pgBouncer dropped idle connections at 10m, HikariCP continued dispatching queries over dead TCP sockets... The proven resolution is setting HikariCP maxLifetime strictly lower than pgBouncer (540000ms / 9m)."*

Correlating this historical rule against the incoming git diff in commit `a4f91e8`:
```diff
- hikari.max-lifetime: 540000
+ hikari.max-lifetime: 1800000
+ hikari.connection-timeout: 30000
```

The agent immediately pinpointed the exact root cause with **96% confidence**:
- **Diagnosis:** The commit author inadvertently re-introduced the known timeout asymmetry documented in INC-2024-089.
- **Surgical Remediation:** Hot-patch `HIKARI_MAX_LIFETIME=540000` (9 minutes) and execute a rolling restart.
- **Risk Level:** LOW.
- **Expected Outcome:** Connection pool saturation drops from 98.6% to < 20% in under 60 seconds without code changes.

---

## Closing the Learning Loop: Retaining Knowledge

Persistent memory is only as valuable as the mechanism used to capture it. When an engineer resolves an incident in PagerLore, they submit a structured post-mortem. On submission, PagerLore invokes Hindsight’s `retain` endpoint:

```typescript
export async function retainPostMortemKnowledge(
  incident: Incident,
  postmortem: PostMortem
): Promise<HindsightRetainResponse> {
  const content = `Post-Mortem for ${incident.id} (${incident.affected_service}): ` +
    `Root cause: ${postmortem.root_cause}. ` +
    `Final resolution: ${postmortem.final_resolution}. ` +
    `Preventive measures: ${postmortem.preventive_measures.join("; ")}`;

  const res = await fetch(`${HINDSIGHT_API_URL}/v1/banks/${BANK_ID}/retain`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HINDSIGHT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      retain_mission: "Extract root-cause, failure symptoms, and proven remediation steps for SRE incident response",
      retain_extraction_mode: "verbose",
      document_id: `postmortem-${incident.id}`,
      metadata: {
        incidentId: incident.id,
        service: incident.affected_service,
        resolution: postmortem.final_resolution,
      },
    }),
  });

  return await res.json();
}
```

Hindsight parses the post-mortem, extracts structured factual assertions, and indexes them into the knowledge graph. The next time an engineer encounters connection pool starvation or proxy disconnects, the newly learned lesson is instantly available.

---

## Architectural Lessons and Trade-offs

1. **Human-in-the-Loop is Mandatory:** SRE platforms should never execute autonomous infrastructure changes without human authorization. PagerLore requires explicit engineer sign-off before applying any Kubernetes patch.
2. **Reflection Over Aggregation:** Hindsight's `reflect` capability is critical for finding meta-patterns across incidents. Reflection revealed that timeout mismatches were our organization's single largest source of recurring downtime.
3. **Current Limitations:** Real-world incident logs often contain sensitive credentials and customer PII. Production deployments must run an anonymization filter before sending raw log traces to LLM and memory endpoints.

Production incidents will always happen. But with persistent memory, your engineering team never has to start diagnosing from zero again.

