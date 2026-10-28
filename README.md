# APM Integrations: OAuth Readiness Engine

## Understanding the Problem
Developers do not get blocked creating a `client_id` and `client_secret` in a sandbox—that takes 5 minutes. The real integration bottleneck is the opaque chasm between localhost testing and external production approval. 

Treating an OAuth integration as having a single flat "difficulty" or "wait time" is a fatal product flaw. Google OAuth takes 10 minutes for non-sensitive scopes (`openid`), but triggers a 4–8 week, $15k+ third-party CASA Tier 2 security assessment if a developer requests restricted scopes (`gmail.readonly`). 

This engine solves the developer's problem by transforming static documentation into a **Scope-Aware, Evidence-Graded Readiness Guide**. 

## Key Product Decisions
1. **Two-Track Timelines (Sandbox vs. Production):** Every guide separates *Time to First Token (Dev)* from *Time to Public Launch (Prod)*, exposing the true timeline before a developer commits to an architecture.
2. **Strict Epistemic Honesty (Evidence Grading):** An AI agent scraping public docs cannot see inside gated developer consoles (e.g., Meta, Google Cloud). Rather than hallucinating UI button names, this system strictly tags every claim:
   - `[Tested Live]` — Verified via live console walk-through.
   - `[Official Docs]` — Directly supported by cited provider documentation.
   - `[Unverified / Behind Auth Wall]` — Explicitly flagged when public docs omit review SLAs or internal console labels.
3. **Agent as "Pre-Flight Co-Pilot":** Instead of attempting fragile browser automation to click through 2FA gates, the agent automates the actual time-sinks: mapping requested scopes to sensitivity tiers, and identifying hidden prerequisites (e.g., DNS verification, Privacy Policy AI-clauses).

## Verification & Self-Audit Log
I tested the pre-built library against real manual setup attempts in the developer consoles to calibrate the agent's output:

| Provider | What I Tested / Verified | What Failed or Needed Correction | What Remains Uncertain (Behind Auth Wall) |
| :--- | :--- | :--- | :--- |
| **Google** | Walked through GCP Console OAuth Consent Screen; verified restricted scope flags. | Initial assumption was that all `drive` scopes trigger audits. Corrected to reflect that `drive.file` bypasses CASA Tier 2. | Exact back-and-forth turnaround time with Google's lab assessors during peak queue periods. |
| **Slack** | Created an app via YAML App Manifest URL and enabled Multi-Workspace Distribution. | Docs heavily push Marketplace review. Found and verified that toggling "Manage Distribution" allows instant public use with an "Unreviewed" warning. | Exact rejection rate for AI agents requesting broad `channels:history` scopes in the official Marketplace. |
| **Notion** | Created public integration in Notion Developer Portal; verified Basic Auth requirements. | Expected granular OAuth scopes (like `pages:read`). Notion actually uses capability checkboxes + user page selection. | Internal SLA for listing in the public Notion Integrations Gallery. |

## Setup Instructions
1. Clone the repository and run `npm install`.
2. Copy `.env.local.example` to `.env.local` and add your `GEMINI_API_KEY`.
3. Run the development server: `npm run dev`
4. Navigate to `http://localhost:3000`.

## Known Limitations
- **Gated Documentation:** Some enterprise providers (e.g., legacy EHR systems) lock their API docs behind partner portals. The live agent will flag these as `[Unverified / Behind Partner Wall]` rather than hallucinating.
- **Dynamic Reviewer Discretion:** Published review SLAs often differ from real-world human reviewer pushback, particularly regarding AI agent data retention policies.