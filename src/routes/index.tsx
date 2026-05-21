import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Compass, MessageCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurora AI Workspace" },
      {
        name: "description",
        content: "Your AI workspace home. Jump into email, meetings, tasks, research, and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const tiles = [
  {
    title: "AI Email Generator",
    desc: "Draft polished emails in seconds.",
    href: "/email",
    icon: Mail,
    accent: "from-blue-500/20 to-blue-500/0",
  },
  {
    title: "Meeting Summarizer",
    desc: "Turn transcripts into action items.",
    href: "/meetings",
    icon: FileText,
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    title: "AI Task Planner",
    desc: "Break goals into a clear plan.",
    href: "/tasks",
    icon: ListChecks,
    accent: "from-amber-500/20 to-amber-500/0",
  },
  {
    title: "Research Assistant",
    desc: "Structured briefings on any topic.",
    href: "/research",
    icon: Compass,
    accent: "from-violet-500/20 to-violet-500/0",
  },
  {
    title: "AI Chatbot",
    desc: "Ask anything, get streaming answers.",
    href: "/chat",
    icon: MessageCircle,
    accent: "from-rose-500/20 to-rose-500/0",
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6 md:p-10">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-[var(--shadow-soft)]">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Aurora is ready
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
          Good to see you.
          <br />
          <span className="italic text-primary">What will we make today?</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Five AI tools, one calm workspace. Pick a tile to get started — every feature is
          powered by Lovable AI and ready to use.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            to={t.href}
            className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${t.accent} opacity-60`}
            />
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-sm text-primary opacity-80 transition group-hover:opacity-100">
                Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border bg-gradient-to-br from-accent/40 to-card p-6 md:p-8 shadow-[var(--shadow-soft)]">
        <h2 className="font-display text-2xl">Tips for great results</h2>
        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <li>
            <span className="font-medium text-foreground">Be specific.</span> Include context,
            audience, and the outcome you want.
          </li>
          <li>
            <span className="font-medium text-foreground">Iterate.</span> Refine the input and
            re-run — it's fast and cheap.
          </li>
          <li>
            <span className="font-medium text-foreground">Copy & paste.</span> Use the Copy button
            to move output into your tools.
          </li>
        </ul>
      </section>
    </div>
  );
}
