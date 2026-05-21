import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { AiToolPanel } from "@/components/ai-tool-panel";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Aurora" },
      { name: "description", content: "Turn a goal into a prioritized, step-by-step plan with time estimates." },
    ],
  }),
  component: () => (
    <AiToolPanel
      kind="tasks"
      title="AI Task Planner"
      description="Describe your goal. Aurora generates a phased plan with prioritized tasks, dependencies, and rough time estimates."
      icon={<ListChecks className="h-3.5 w-3.5" />}
      placeholder="e.g. Launch a new landing page for our beta in 2 weeks."
      examples={[
        "Plan a 2-week launch for a beta SaaS product.",
        "Plan a personal weekend trip to Lisbon for 3 days.",
        "Onboarding plan for a new engineering hire (first 30 days).",
      ]}
      cta="Plan it"
    />
  ),
});
