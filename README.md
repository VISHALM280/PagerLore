# PagerLore

> **"The next incident shouldn't start from zero."**  
> *Memory-Powered Incident Response & Intelligence Platform.*

PagerLore remembers how your systems failed, recalls what actually fixed them, and helps engineering teams resolve the next production outage with the accumulated knowledge of every incident before it. Built natively on **Hindsight** by Vectorize.

---

## ⚡ The Core Problem

When an outage strikes at 3 AM, why does your engineering team always start from zero?

Post-mortems are filed away in wikis, while on-call engineers search disconnected Slack channels hoping someone remembers what worked. When team members change shifts or move teams, institutional knowledge resets.

**PagerLore eliminates production amnesia** by embedding persistent memory into the SRE diagnostic workflow.

---

## 🧠 Powered by Hindsight

PagerLore implements all three core primitives of the [Hindsight Memory Architecture](https://hindsight.vectorize.io/):

1. **RECALL (`client.recall`):** When an anomaly occurs, PagerLore executes multi-path retrieval (Semantic, BM25, Graph Traversal, and Temporal Proximity) to find historical failure patterns with similar symptoms.
2. **REFLECT (`client.reflect`):** Runs autonomous agentic reasoning loops over the memory bank to synthesize cross-service timeout vulnerabilities and recommend architectural CI/CD guardrails.
3. **RETAIN (`client.retain`):** When an incident is resolved, PagerLore extracts structured facts from the post-mortem into an isolated memory bank, ensuring the lesson is permanently available to future investigations.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration (Optional)
PagerLore includes a transparent **DEMO MODE** that operates with rich, high-fidelity seeded incidents out of the box.

To connect to a live Vectorize Hindsight Cloud or local deployment, create a `.env.local` file:
```bash
HINDSIGHT_API_URL="https://api.hindsight.vectorize.io"
HINDSIGHT_API_KEY="your-vectorize-api-key"
HINDSIGHT_BANK_ID="pagerlore-production-bank"
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 Key Application Routes

- `/` — Cinematic Landing Page with interactive telemetry particle canvas.
- `/command` — Central Incident Command Center with live MTTR metrics and health feed.
- `/theatre` — **Signature Feature:** Side-by-side comparative benchmark showing the same incident diagnosed **WITHOUT MEMORY vs. WITH HINDSIGHT**.
- `/investigate?incident=INC-2024-142` — AI SRE Investigation Workspace with a real 7-step progress pipeline.
- `/vault` — Interactive Knowledge Graph visualizing relationships between memories, services, and resolutions.
- `/topology` — Interactive Service Topology Graph illustrating fault propagation across microservices.
- `/postmortems` — Post-Mortem recording workflow that triggers Hindsight retention.
- `/runbooks` — Dynamic executable playbooks automatically generated from retained memories.
- `/analytics` — MTTR reduction curves, root-cause distribution, and memory growth.
- `/settings` — Hindsight health check, ping latency test, and demo reset tool.

---

## 📚 Submission Documentation

Complete submission materials are ready in [`docs/submission/`](./docs/submission/):
- [`technical-evidence.md`](./docs/submission/technical-evidence.md) — Technical architecture, endpoints, and verification.
- [`article-title-ideas.md`](./docs/submission/article-title-ideas.md) — 20 technical article titles.
- [`article-draft.md`](./docs/submission/article-draft.md) — 1,300+ word engineering deep dive.
- [`linkedin-post-draft.md`](./docs/submission/linkedin-post-draft.md) — LinkedIn post under 800 characters.
- [`video-demo-script.md`](./docs/submission/video-demo-script.md) — 3-minute timed walkthrough script.
- [`submission-checklist.md`](./docs/submission/submission-checklist.md) — Comprehensive submission checklist.

---

## 🛡️ License

MIT License. Designed with precision for reliable production engineering.

