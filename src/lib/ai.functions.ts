import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const SYSTEMS = {
  email:
    "You are an expert email writer. Write polished, on-brand emails based on the user's intent. Use clear subject lines, concise paragraphs, and a strong call to action. Output markdown with a Subject: line first, then the body.",
  meetings:
    "You are a meeting notes summarizer. Given raw transcript or rough notes, produce: 1) a one-paragraph TL;DR, 2) Key Decisions, 3) Action Items (with owner if mentioned), 4) Open Questions. Use markdown headings.",
  tasks:
    "You are an AI task planner. Given a goal, output a prioritized, step-by-step plan with realistic time estimates and dependencies. Use a markdown checklist grouped by phase.",
  research:
    "You are an AI research assistant. Provide a structured briefing: Overview, Key Facts (bulleted), Important Considerations, and Suggested Next Steps. Be precise; flag when something needs human verification.",
} as const;

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        kind: z.enum(["email", "meetings", "tasks", "research"]),
        prompt: z.string().min(1).max(20000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { text: "", error: "LOVABLE_API_KEY is not configured." };

    try {
      const gateway = createLovableAiGatewayProvider(key);
      const model = gateway("google/gemini-3-flash-preview");
      const { text } = await generateText({
        model,
        system: SYSTEMS[data.kind],
        prompt: data.prompt,
      });
      return { text, error: null as string | null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed";
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 429) return { text: "", error: "Rate limit exceeded. Please try again shortly." };
      if (status === 402) return { text: "", error: "AI credits exhausted. Add credits in Workspace settings." };
      return { text: "", error: message };
    }
  });
