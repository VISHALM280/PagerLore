# PagerLore — Technical Architecture & Hindsight Integration Evidence

## 1. System Architecture Overview

PagerLore is a memory-powered incident response and reliability intelligence platform designed for SRE and platform engineering teams. Its central premise is that **production failures repeat, but engineering memory usually resets across shift rotations, team transitions, and documentation fragmentation.**

PagerLore solves this by embedding **Hindsight** (Vectorize) persistent memory directly into the incident diagnostic lifecycle:

```
[Production Signals & Telemetry] 
             │
             ▼
[Incident Ingestion (INC-2024-142)] 
             │
             ├──────────────────────────────────────────┐
             ▼                                          ▼
   [Path A: Without Memory]                    [Path B: With Hindsight]
   - Raw symptoms analysis only                - POST /v1/banks/{bank_id}/recall
   - Speculative hypotheses (46% conf)         - Multi-path RRF retrieval
   - Generic reboot/scale heuristics           - Matches INC-2024-089 (96% conf)
   - MTTR: ~84 minutes                         - Pins HikariCP vs pgBouncer timeout
                                               - Surgical patch & SRE approval
                                               - MTTR: ~14 minutes
                                                        │
                                                        ▼
                                             [Post-Mortem Submission]
                                                        │
                                                        ▼
                                             [Hindsight RETAIN Operation]
                                             - POST /v1/banks/{bank_id}/retain
                                             - Extracts world/experience facts
                                             - Permanent memory in bank
```

---

## 2. Hindsight Memory Engine Integration

PagerLore implements all three core primitives of the official Hindsight API specification:

### 2.1 RETAIN (`client.retain`)
- **API Endpoint:** `POST /api/hindsight/retain` (Server-side proxy to `${HINDSIGHT_API_URL}/v1/banks/${HINDSIGHT_BANK_ID}/retain`)
- **Source Code Implementation:** [`src/lib/hindsight/client.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/lib/hindsight/client.ts#L104-L197)
- **Payload Structure:**
  ```typescript
  {
    content: string; // Structured post-mortem text
    retain_mission: "Extract post-mortem root causes, diagnostic paths, and preventive engineering guardrails",
    retain_extraction_mode: "verbose",
    document_id?: string,
    metadata: {
      incidentId: string;
      service: string;
      resolution: string;
      rootCause: string;
      tags: string[];
    }
  }
  ```
- **Provenance & Behavior:** Only verified SRE-submitted post-mortems trigger retention. When submitted, Hindsight extracts structured facts (`type: "experience"`, `type: "observation"`, `type: "world"`), assigns a unique memory ID, and updates the in-memory/persistent store for subsequent recall operations.

### 2.2 RECALL (`client.recall`)
- **API Endpoint:** `POST /api/hindsight/recall` (Server-side proxy to `${HINDSIGHT_API_URL}/v1/banks/${HINDSIGHT_BANK_ID}/recall`)
- **Source Code Implementation:** [`src/lib/hindsight/client.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/lib/hindsight/client.ts#L199-L283)
- **Payload Structure:**
  ```typescript
  {
    query: string; // Synthesized symptom query from active logs & service names
    top_k: 4,
    budget: "mid",
    types: ["experience", "observation", "world"]
  }
  ```
- **Retrieval Mechanism:** Implements multi-strategy retrieval running Semantic Similarity, BM25 Keyword Matching, Graph Traversal, and Temporal Proximity, ranked via Reciprocal Rank Fusion (RRF). Returns `RecallResult[]` with relevance scores and linked historical incident identifiers.

### 2.3 REFLECT (`client.reflect`)
- **API Endpoint:** `POST /api/hindsight/reflect` (Server-side proxy to `${HINDSIGHT_API_URL}/v1/banks/${HINDSIGHT_BANK_ID}/reflect`)
- **Source Code Implementation:** [`src/lib/hindsight/client.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/lib/hindsight/client.ts#L285-L352)
- **Functionality:** Unlike individual fact retrieval, `reflect` executes an autonomous agentic synthesis loop across the entire bank. It identifies recurring timeout asymmetries across disparate microservices and derives system-wide preventative CI/CD guardrails.

---

## 3. Verified Application Routes & Endpoints

| Route | Type | Description | File Path |
|---|---|---|---|
| `/` | Page | Cinematic Landing Page with interactive telemetry canvas | [`src/app/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/page.tsx) |
| `/command` | Page | Central Command Center with live telemetry, metrics, and feed | [`src/app/command/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/command/page.tsx) |
| `/theatre` | Page | Signature Demo Theatre: Side-by-side Memory ON vs OFF comparison | [`src/app/theatre/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/theatre/page.tsx) |
| `/investigate` | Page | Contextual Investigation Workspace with 7-step progress pipeline | [`src/app/investigate/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/investigate/page.tsx) |
| `/vault` | Page | Hindsight Memory Vault with interactive knowledge graph & inspector | [`src/app/vault/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/vault/page.tsx) |
| `/topology` | Page | Service Topology & Fault Propagation interactive network graph | [`src/app/topology/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/topology/page.tsx) |
| `/postmortems` | Page | Post-mortem submission workflow triggering Hindsight retain | [`src/app/postmortems/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/postmortems/page.tsx) |
| `/incidents` | Page | Incident catalog with CRUD, search, and severity filters | [`src/app/incidents/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/incidents/page.tsx) |
| `/incidents/[id]` | Page | Dedicated incident detail with logs, metrics, diffs, and notes | [`src/app/incidents/[id]/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/incidents/[id]/page.tsx) |
| `/runbooks` | Page | Executable playbooks auto-updated from Hindsight post-mortems | [`src/app/runbooks/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/runbooks/page.tsx) |
| `/analytics` | Page | MTTR trajectory, root cause distribution, and memory growth | [`src/app/analytics/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/analytics/page.tsx) |
| `/settings` | Page | Hindsight connectivity verification, ping test, and demo reset | [`src/app/settings/page.tsx`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/settings/page.tsx) |
| `/api/incidents` | API | GET all incidents, POST create new incident | [`src/app/api/incidents/route.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/api/incidents/route.ts) |
| `/api/investigate` | API | POST trigger investigation (with or without memory) | [`src/app/api/investigate/route.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/api/investigate/route.ts) |
| `/api/hindsight/retain` | API | Retain post-mortem knowledge into Hindsight bank | [`src/app/api/hindsight/retain/route.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/api/hindsight/retain/route.ts) |
| `/api/hindsight/recall` | API | Query memory bank with multi-path RRF scoring | [`src/app/api/hindsight/recall/route.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/api/hindsight/recall/route.ts) |
| `/api/hindsight/reflect` | API | Agentic reflection over incident bank | [`src/app/api/hindsight/reflect/route.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/api/hindsight/reflect/route.ts) |
| `/api/hindsight/status` | API | Connectivity check, latency test, and bank status | [`src/app/api/hindsight/status/route.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/api/hindsight/status/route.ts) |
| `/api/demo/reset` | API | Reset demo state to clean initial seeded scenario | [`src/app/api/demo/reset/route.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/app/api/demo/reset/route.ts) |

---

## 4. Environment Configuration

To connect PagerLore to a live Vectorize Hindsight cloud instance or local server, configure these environment variables in `.env.local`:

```bash
# Hindsight API Service Endpoint (Default: Vectorize Cloud)
HINDSIGHT_API_URL="https://api.hindsight.vectorize.io"

# Hindsight API Authentication Key
HINDSIGHT_API_KEY="your-vectorize-api-key-here"

# Isolated Memory Bank for Production SRE Incident Knowledge
HINDSIGHT_BANK_ID="pagerlore-production-bank"
```

### Transparent DEMO MODE Support
If `HINDSIGHT_API_KEY` is not provided or the remote host is temporarily unreachable, PagerLore operates in **transparent DEMO MODE**:
- Clearly labelled in the header, settings, and memory vault as `LOCAL DEMO MODE (In-Memory Bank)`.
- Implements the exact same multi-path RRF scoring algorithm and request/response shapes as the remote Hindsight engine.
- Never pretends mock memory originated from Vectorize servers without real credentials.

---

## 5. Technical Verification & Known Limitations

- **Production Build:** Next.js App Router 14 with full TypeScript type safety and Tailwind CSS compiling with zero errors.
- **State Management:** Runtime singleton data store (`DataStore`) persists changes during the application session, allowing live retaining of post-mortems and immediate recall in subsequent investigations.
- **Human Approval Safeguard:** PagerLore enforces a hard approval gate for production changes. AI recommendations cannot execute infrastructure changes automatically without an explicit engineer click.
- **Known Limitation:** Real Kubernetes `kubectl` commands are simulated safely in the web interface rather than opening arbitrary production root shells.
