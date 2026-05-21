import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AiToolPanel } from "@/components/ai-tool-panel";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "AI Email Generator — Aurora" },
      { name: "description", content: "Draft polished, on-brand emails in seconds with AI." },
    ],
  }),
  component: () => (
    <AiToolPanel
      kind="email"
      title="AI Email Generator"
      description="Describe who you're writing to and what you want to say. Aurora drafts a complete email with subject line, body, and CTA."
      icon={<Mail className="h-3.5 w-3.5" />}
      placeholder="e.g. Follow-up to a customer who attended yesterday's demo. Thank them, share pricing tiers, and propose a 30-minute call next week."
      examples={[
        "Cold outreach to a head of marketing introducing our analytics product.",
        "Polite reminder about an overdue invoice (#1042) to a long-term client.",
        "Thank-you email to a podcast host after recording.",
      ]}
      cta="Generate email"
    />
  ),
});
