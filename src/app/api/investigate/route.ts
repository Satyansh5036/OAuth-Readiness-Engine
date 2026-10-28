import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { OAuthGuideSchema } from "@/lib/schema";

// Prevent serverless timeouts during live research (Vercel/Next.js specific)
export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { appNameOrUrl, intendedUseCase } = await req.json();

        if (!appNameOrUrl) {
            return NextResponse.json({ error: "appNameOrUrl is required" }, { status: 400 });
        }

        // Initialize SDK - relies on GEMINI_API_KEY in your .env.local
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const systemPrompt = `
      You are a Principal Security Engineer and OAuth Compliance Auditor.
      Your task is to investigate the OAuth 2.0 developer setup and production approval process for: "${appNameOrUrl}"
      Intended Use Case: ${intendedUseCase || "Standard AI Agent Integration"}

      CRITICAL EVIDENCE RULES (FAILING THESE IS CATASTROPHIC):
      1. DO NOT HALLUCINATE UI BUTTONS OR LABELS. If a step requires logging into a developer console, you cannot see it. Put it in 'uncertain_unverified'.
      2. Split timelines strictly between Sandbox/Testing (usually fast) and Production/Marketplace (often requires manual review).
      3. Identify specific scope sensitivity tiers if they exist (e.g., restricted vs non-sensitive).
      
      Return ONLY a raw JSON object (no markdown formatting blocks) that strictly matches this exact structure:
      {
        "provider_name": "string",
        "overall_friction_score": "Low" | "Medium" | "High" | "Extreme",
        "timelines": {
          "sandbox_dev_time": "string",
          "production_approval_wait": "string"
        },
        "prerequisites_and_gotchas": ["string"],
        "scope_tiers": [
          { "tier": "string", "scopes": ["string"], "review_impact": "string" }
        ],
        "handoff_matrix": {
          "agent_can_automate": ["string"],
          "human_must_do": ["string"]
        },
        "evidence_audit": {
          "tested_live": ["string"],
          "doc_supported": ["string"],
          "uncertain_unverified": ["string"]
        }
      }
    `;

        // Call Gemini 2.5 Pro with Search Grounding enabled
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: systemPrompt,
            config: {
                responseMimeType: "application/json",
                tools: [{ googleSearch: {} }],
                temperature: 0.1,
            }
        });

        let rawJson = response.text;

        if (!rawJson) {
            throw new Error("Empty response from AI");
        }

        // Strip markdown code blocks if the LLM hallucinated them
        rawJson = rawJson.replace(/```json/gi, "").replace(/```/gi, "").trim();

        // Safely parse and catch Zod validation errors explicitly
        try {
            const parsedData = JSON.parse(rawJson);
            const validatedData = OAuthGuideSchema.parse(parsedData);
            return NextResponse.json(validatedData);
        } catch (parseError: any) {
            console.error("Data Validation Failed. Raw Output was:", rawJson);
            console.error("Validation Error:", parseError.issues || parseError.message);
            return NextResponse.json(
                { error: "AI returned malformed data. Check terminal logs." },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Investigation Error:", error);
        return NextResponse.json(
            { error: "Failed to investigate app. Check terminal logs." },
            { status: 500 }
        );
    }
}