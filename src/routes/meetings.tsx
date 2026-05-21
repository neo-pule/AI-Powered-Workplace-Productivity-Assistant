import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AiToolPanel } from "@/components/ai-tool-panel";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aurora" },
      { name: "description", content: "Turn raw transcripts or notes into a clean summary with action items." },
    ],
  }),
  component: () => (
    <AiToolPanel
      kind="meetings"
      title="Meeting Notes Summarizer"
      description="Paste a transcript, Zoom captions, or rough notes. Aurora returns a TL;DR, decisions, action items, and open questions."
      icon={<FileText className="h-3.5 w-3.5" />}
      placeholder="Paste the meeting transcript or your raw notes here…"
      examples={[
        "Q3 planning meeting — discussed roadmap, hiring, and the launch timeline.",
        "Customer interview with Acme Corp — they want SSO, audit logs, and a 30-day trial.",
      ]}
      cta="Summarize meeting"
    />
  ),
});
