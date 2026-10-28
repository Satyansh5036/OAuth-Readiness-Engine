import { OAuthGuide } from "@/lib/schema";

export const seedGuides: Record<string, OAuthGuide> = {
    "slack": {
        provider_name: "Slack",
        overall_friction_score: "Medium",
        timelines: {
            sandbox_dev_time: "5 mins (via App Manifest)",
            production_approval_wait: "Instant for Direct Install; 4-6 weeks for App Directory"
        },
        prerequisites_and_gotchas: [
            "AI agents acting as users need 'user_scope', agents acting as bots need 'scope'",
            "You can bypass manual review entirely by toggling 'Manage Distribution' and sharing an install link, but users will see an 'Unreviewed App' warning."
        ],
        scope_tiers: [
            {
                tier: "Standard",
                scopes: ["chat:write", "channels:read"],
                review_impact: "Standard review process if submitting to App Directory."
            },
            {
                tier: "Sensitive",
                scopes: ["channels:history", "groups:history"],
                review_impact: "High scrutiny for AI apps. Reviewers will demand strict data retention justifications."
            }
        ],
        handoff_matrix: {
            agent_can_automate: [
                "Generate complete Slack App Manifest YAML with exact required scopes",
                "Draft the data privacy justification for the App Directory submission"
            ],
            human_must_do: [
                "Paste manifest into the Slack API console",
                "Click the 4 confirmation boxes under 'Manage Distribution'"
            ]
        },
        evidence_audit: {
            tested_live: ["App Manifest creation bypasses 90% of UI clicks", "Distribution toggle requirements"],
            doc_supported: ["Differences between bot tokens (xoxb) and user tokens (xoxp)"],
            uncertain_unverified: ["Exact rejection rate for AI agents requesting broad 'channels:history' scopes"]
        }
    },
    "google-workspace": {
        provider_name: "Google Workspace (Drive/Gmail)",
        overall_friction_score: "Extreme",
        timelines: {
            sandbox_dev_time: "15 mins (Max 100 test users)",
            production_approval_wait: "4-12+ weeks (CASA Tier 2 Audit required for restricted scopes)"
        },
        prerequisites_and_gotchas: [
            "Must verify root domain in Google Search Console first.",
            "Requires an unlisted YouTube video showing the full OAuth flow.",
            "Privacy Policy MUST explicitly state that Google data is not used to train generalized AI models."
        ],
        scope_tiers: [
            {
                tier: "Sensitive",
                scopes: ["calendar.events"],
                review_impact: "Manual Google Trust & Safety review. Takes 1-2 weeks."
            },
            {
                tier: "Restricted",
                scopes: ["gmail.readonly", "drive"],
                review_impact: "Triggers mandatory $15k-$75k third-party security assessment (CASA Tier 2)."
            }
        ],
        handoff_matrix: {
            agent_can_automate: [
                "Audit requested scopes to recommend least-privilege alternatives (e.g. drive.file instead of drive)",
                "Generate the mandatory Google Limited Use compliance clause for Privacy Policy"
            ],
            human_must_do: [
                "Verify DNS via Google Search Console",
                "Record and narrate the required YouTube demo video",
                "Complete the CASA portal questionnaire"
            ]
        },
        evidence_audit: {
            tested_live: ["Domain verification wall", "OAuth Consent Screen configuration requirements"],
            doc_supported: ["CASA Tier 2 triggers", "Google API Services User Data Policy"],
            uncertain_unverified: ["Exact turnaround time with third-party lab assessors during peak queue periods"]
        }
    },
    "notion": {
        provider_name: "Notion",
        overall_friction_score: "Low",
        timelines: {
            sandbox_dev_time: "5 mins (Internal Integration)",
            production_approval_wait: "Instant for Public Integrations"
        },
        prerequisites_and_gotchas: [
            "Requires a Privacy Policy URL, Terms of Use URL, and Support Email to toggle to Public.",
            "Notion uses HTTP Basic Auth (Base64 encoding) on the token exchange endpoint.",
            "Tokens do not expire unless explicitly rotated."
        ],
        scope_tiers: [
            {
                tier: "Standard",
                scopes: ["Read content", "Update content"],
                review_impact: "No manual review. Permissions are capability-based and selected by the end-user per page."
            }
        ],
        handoff_matrix: {
            agent_can_automate: [
                "Generate the correct Basic Auth curl snippet for token exchange",
                "Verify Privacy Policy URL returns HTTP 200 before submission"
            ],
            human_must_do: [
                "Upload the required 1:1 square app icon",
                "Toggle 'Public' in the Notion developer dashboard"
            ]
        },
        evidence_audit: {
            tested_live: ["Public integration toggle requirements", "Token exchange format"],
            doc_supported: ["Token expiration policies"],
            uncertain_unverified: ["SLA for listing in the official Notion Integrations Gallery"]
        }
    }
};