import { z } from "zod";

export const OAuthGuideSchema = z.object({
    provider_name: z.string(),
    overall_friction_score: z.enum(["Low", "Medium", "High", "Extreme"]),
    timelines: z.object({
        sandbox_dev_time: z.string().describe("Time to first token for local testing (e.g., '10 mins (Self-serve)')"),
        production_approval_wait: z.string().describe("Time to public launch/marketplace (e.g., '4-8 weeks')"),
    }),
    prerequisites_and_gotchas: z.array(z.string()).describe("Blockers like Paid tier required, DNS verification, Privacy Policy URL"),
    scope_tiers: z.array(z.object({
        tier: z.string().describe("e.g. Non-Sensitive, Sensitive, Restricted"),
        scopes: z.array(z.string()),
        review_impact: z.string().describe("How requesting these scopes impacts the manual approval timeline"),
    })),
    handoff_matrix: z.object({
        agent_can_automate: z.array(z.string()).describe("Tasks an AI agent can do (e.g., write justifications, generate manifest)"),
        human_must_do: z.array(z.string()).describe("Tasks requiring a human (e.g., 2FA login, record demo video)"),
    }),
    evidence_audit: z.object({
        tested_live: z.array(z.string()).describe("Verified via live console or HTTP endpoint probing"),
        doc_supported: z.array(z.string()).describe("Supported by official provider documentation"),
        uncertain_unverified: z.array(z.string()).describe("Behind an auth wall or unspecified in docs. Crucial for honesty."),
    })
});

export type OAuthGuide = z.infer<typeof OAuthGuideSchema>;