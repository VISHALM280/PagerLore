# PagerLore 3-Minute Video Walkthrough Script

**Target Duration:** Exactly 3:00  
**Host / Presenter:** Engineering Lead / SRE  
**App URLs Shown:**  
- `http://localhost:3000/` (Cinematic Landing)
- `http://localhost:3000/command` (Command Center)
- `http://localhost:3000/theatre` (Signature Demo Theatre)
- `http://localhost:3000/investigate?incident=INC-2024-142` (Investigation Workspace)
- `http://localhost:3000/vault` (Memory Vault & Knowledge Graph)
- `http://localhost:3000/postmortems` (Post-Mortem & Retain Lifecycle)

---

## Part 1: Product Introduction & The Problem (0:00 – 0:30)

**[Screen: `/` — Landing Page with animated telemetry streams and network nodes]**

> **Voiceover (0:00–0:15):**  
> *"When a production outage strikes at 3 AM, why does your engineering team always have to start from zero? Every outage leaves a critical lesson, but when engineers switch on-call rotations or post-mortems get filed away in Google Docs, institutional knowledge resets. This is PagerLore—a memory-powered incident response platform built on Hindsight."*

**[Screen: Click 'Enter Command Center' ➔ Navigate to `/command`]**

> **Voiceover (0:15–0:30):**  
> *"Here in the Command Center, we see an active SEV-1 outage: INC-2024-142 on our payments-service. Checkout errors have spiked to 28%, and our database connection pool is 98% saturated immediately following deployment v2.8.1. Let's look at what happens when an AI agent diagnoses this without memory versus with Hindsight."*

---

## Part 2: Operating Without Memory (0:30 – 1:00)

**[Screen: Navigate to `/theatre` — Signature Demo Theatre]**

> **Voiceover (0:30–0:45):**  
> *"In our Demo Theatre, we run two parallel investigations of the exact same incident context. On the left: Mode A, an agent operating WITHOUT memory. It looks at the logs and latency spikes in isolation. Let's click 'Run Side-by-Side Benchmark'."*

**[Screen: Click 'Run Side-by-Side Benchmark'. Mode A renders results.]**

> **Voiceover (0:45–1:00):**  
> *"Without memory, the agent produces speculative guesses with only 46% confidence. It recommends restarting the service pods or scaling from 3 to 6 instances. In reality, scaling pods would have doubled our database connections and exacerbated the proxy exhaustion. Without historical context, the agent is guessing."*

---

## Part 3: Grounded Investigation & Hindsight Recall (1:00 – 2:30)

**[Screen: Mode B on `/theatre` lights up with cyan glow]**

> **Voiceover (1:00–1:20):**  
> *"Now look at Mode B on the right: PagerLore with Hindsight active. PagerLore invokes Hindsight's `recall` endpoint, running parallel semantic, keyword, graph, and temporal search. In less than 200 milliseconds, it recalls incident INC-2024-089 with a 96% relevance score."*

**[Screen: Highlight Memory `mem-hindsight-8901-hikari` and git commit diff]**

> **Voiceover (1:20–1:45):**  
> *"Hindsight instantly reminds the system: HikariCP's maxLifetime must NEVER exceed pgBouncer's 10-minute idle timeout. Looking at the commit diff in v2.8.1, the engineer accidentally bumped `max-lifetime` to 30 minutes! PagerLore doesn't suggest scaling pods—it provides the exact surgical fix: hot-patch `HIKARI_MAX_LIFETIME` back to 540 seconds."*

**[Screen: Navigate to `/investigate?incident=INC-2024-142` ➔ Click 'Approve & Apply Remediation']**

> **Voiceover (1:45–2:05):**  
> *"In our Investigation Workspace, PagerLore enforces a hard human-in-the-loop approval gate. Production state changes require explicit SRE sign-off. As lead SRE, I inspect the command, verify the low risk, and click 'Approve & Apply Remediation'. The pool saturation drops from 98% to 18% in seconds."*

**[Screen: Navigate to `/postmortems?incident=INC-2024-142` ➔ Click 'Submit & Retain in Memory Vault']**

> **Voiceover (2:05–2:30):**  
> *"Now we close the loop. We submit the resolved post-mortem. Watch this: clicking 'Submit' calls Hindsight's `retain` endpoint. Hindsight extracts structured facts, resolves entities, and stores the newly verified resolution permanently in our knowledge graph in the Memory Vault. The next time anyone touches connection pooling, this lesson is already alive."*

---

## Part 4: Key Takeaway (2:30 – 3:00)

**[Screen: `/vault` — Knowledge Graph with newly retained node pulsating]**

> **Voiceover (2:30–3:00):**  
> *"Every outage your team experiences is expensive. But with PagerLore and Hindsight, that experience becomes a permanent asset. Your AI agents don't hallucinate generic advice, and your on-call engineers never have to start diagnosing from zero again. PagerLore: Every outage leaves a lesson. PagerLore remembers it."*

**[Fade to PagerLore wordmark logo and GitHub link]**
