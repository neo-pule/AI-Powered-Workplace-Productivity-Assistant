import { createFileRoute } from "@tanstack/react-router";
import { Compass, Lightbulb, BookOpen } from "lucide-react";
import { AiToolPanel } from "@/components/ai-tool-panel";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Aurora" },
      { name: "description", content: "Structured briefings on any topic with key facts and next steps." },
    ],
  }),
  component: () => (
    <AiToolPanel
      kind="research"
      title="AI Research Assistant"
      description="Ask a research question. Aurora returns an overview, key facts, considerations, and next steps you can act on."
      icon={<Compass className="h-3.5 w-3.5" />}
      placeholder="e.g. Compare the main approaches to vector search for a mid-size product team."
      examples={[
        "What should I know before building a Chrome extension in 2026?",
        "Pros and cons of monorepos vs polyrepos for a 10-person team.",
        "Brief me on the current state of climate-tech investing.",
      ]}
      cta="Research it"
      sections={[
        {
          id: "insights",
          title: "Insights",
          icon: <Lightbulb className="h-3.5 w-3.5" />,
          description:
            "Non-obvious takeaways, trade-offs, and considerations that shape a smart decision.",
        },
        {
          id: "summaries",
          title: "Summaries",
          icon: <BookOpen className="h-3.5 w-3.5" />,
          description:
            "A concise overview of the topic with the key facts you need at a glance.",
        },
      ]}
    />
  ),
});
