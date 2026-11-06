# PagerLore Submission Checklist & Compliance Verification

Use this checklist before finalizing the submission to ensure full compliance with the official guidelines.

---

## 1. Technical Implementation Verification
- [x] **Next.js Production Build Tested:** Code compiles with zero TypeScript errors or broken imports (`npm run build`).
- [x] **Hindsight Core Endpoints Implemented:**
  - [x] `retain` (`POST /v1/banks/{bank_id}/retain`) implemented in [`src/lib/hindsight/client.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/lib/hindsight/client.ts#L104)
  - [x] `recall` (`POST /v1/banks/{bank_id}/recall`) implemented in [`src/lib/hindsight/client.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/lib/hindsight/client.ts#L199)
  - [x] `reflect` (`POST /v1/banks/{bank_id}/reflect`) implemented in [`src/lib/hindsight/client.ts`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/src/lib/hindsight/client.ts#L285)
- [x] **Server-Side API Key Protection:** Remote API credentials stay server-side in environment variables (`HINDSIGHT_API_KEY`, `HINDSIGHT_API_URL`, `HINDSIGHT_BANK_ID`).
- [x] **Transparent DEMO MODE:** If API credentials are not provided or offline, system clearly labels `DEMO MODE (Local In-Memory Bank)` and never pretends mock memory came from Vectorize Cloud.
- [x] **Signature Feature (Memory ON vs OFF):** Dedicated Demo Theatre (`/theatre`) demonstrates comparative evaluation on incident INC-2024-142.
- [x] **Full Incident Lifecycle:** Ingestion ➔ Telemetry ➔ Diagnosis ➔ Human Approval ➔ Post-Mortem ➔ Hindsight Retain ➔ Immediate Recall.

---

## 2. Submission Content Artifacts
- [x] **Technical Evidence Document:** Prepared in [`docs/submission/technical-evidence.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/technical-evidence.md).
- [x] **20 Technical Article Titles:** Exactly 20 titles generated in [`docs/submission/article-title-ideas.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/article-title-ideas.md), each mentioning Hindsight, under 10 words, with no mention of the hackathon.
- [x] **Technical Article Draft:** Complete 1,300+ word engineering article prepared in [`docs/submission/article-draft.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/article-draft.md) with code snippets, technical story, and all 3 required Vectorize/Hindsight links.
- [x] **LinkedIn Post Draft:** Concise post under 800 characters in [`docs/submission/linkedin-post-draft.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/linkedin-post-draft.md) with first comment and Hindsight repo link.
- [x] **3-Minute Video Demo Script:** Exact timed walkthrough script in [`docs/submission/video-demo-script.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/video-demo-script.md).

---

## 3. Team Member Publication Steps
*(Remember: Each team member publishes an individual article and LinkedIn post, but the team produces one single shared video demonstration.)*

1. **Individual Technical Articles:**
   - [ ] Each team member reviews and personalizes [`article-draft.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/article-draft.md).
   - [ ] Select one unique title from [`article-title-ideas.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/article-title-ideas.md).
   - [ ] Publish on Medium, Dev.to, Hashnode, or personal engineering blog.
   - [ ] Tag Code.in as requested by the guide.
   - [ ] Record the published article URL.

2. **Individual LinkedIn Posts:**
   - [ ] Each team member personalizes and posts the draft from [`linkedin-post-draft.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/linkedin-post-draft.md).
   - [ ] Add the published article URL in the first comment.
   - [ ] Add the Hindsight GitHub link (`https://github.com/vectorize-io/hindsight`) in the second comment.
   - [ ] Tag Code.in on LinkedIn.
   - [ ] Save the public post URL.

3. **Team Video Demonstration:**
   - [ ] Record the 3-minute screen walkthrough following [`video-demo-script.md`](file:///c:/Users/Aditya%20Kumar%20Gupta/OneDrive/Desktop/Devnovate/docs/submission/video-demo-script.md).
   - [ ] Upload as a public YouTube video.
   - [ ] Prepare an attractive video thumbnail.
   - [ ] Add the video link to the final submission form.

4. **Public GitHub Repository:**
   - [ ] Push clean repository commit with comprehensive README.
   - [ ] Verify environment variable documentation.
