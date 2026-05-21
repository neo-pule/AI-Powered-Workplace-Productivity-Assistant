import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Compass,
  MessageCircle,
  ArrowRight,
  Activity,
  Sparkles,
  Clock,
  RotateCcw,
} from "lucide-react";
import { useUsage, formatRelative, resetUsage, type UsageKind } from "@/lib/usage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurora AI Workspace" },
      {
        name: "description",
        content: "Your AI workspace home with live usage stats for every tool.",
      },
    ],
  }),
  component: Dashboard,
});

const tiles: ReadonlyArray<{
  kind: UsageKind;
  title: string;
  desc: string;
  href: string;
  icon: typeof Mail;
  accent: string;
  unit: string;
}> = [
  {
    kind: "email",
    title: "AI Email Generator",
    desc: "Draft polished emails in seconds.",
    href: "/email",
    icon: Mail,
    accent: "from-blue-500/20 to-blue-500/0",
    unit: "emails drafted",
  },
  {
    kind: "meetings",
    title: "Meeting Summarizer",
    desc: "Turn transcripts into action items.",
    href: "/meetings",
    icon: FileText,
    accent: "from-emerald-500/20 to-emerald-500/0",
    unit: "meetings summarized",
  },
  {
    kind: "tasks",
    title: "AI Task Planner",
    desc: "Break goals into a clear plan.",
    href: "/tasks",
    icon: ListChecks,
    accent: "from-amber-500/20 to-amber-500/0",
    unit: "plans generated",
  },
  {
    kind: "research",
    title: "Research Assistant",
    desc: "Structured briefings on any topic.",
    href: "/research",
    icon: Compass,
    accent: "from-violet-500/20 to-violet-500/0",
    unit: "briefings created",
  },
  {
    kind: "chat",
    title: "AI Chatbot",
    desc: "Ask anything, get streaming answers.",
    href: "/chat",
    icon: MessageCircle,
    accent: "from-rose-500/20 to-rose-500/0",
    unit: "messages sent",
  },
];

function Dashboard() {
  const usage = useUsage();
  const totalRuns = tiles.reduce((sum, t) => sum + usage[t.kind].runs, 0);
  const totalChars = tiles.reduce((sum, t) => sum + usage[t.kind].chars, 0);
  const lastTs = Math.max(0, ...tiles.map((t) => usage[t.kind].lastRun ?? 0));
  const activeTools = tiles.filter((t) => usage[t.kind].runs > 0).length;

  const handleReset = () => {
    resetUsage();
    toast.success("Usage stats reset");
  };

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
          Five AI tools, one calm workspace. Your activity is tracked locally so you can see what
          you're using most.
        </p>
      </section>

      {/* Summary stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={<Activity className="h-4 w-4" />} label="Total runs" value={totalRuns} />
        <StatCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Tools used"
          value={`${activeTools} / ${tiles.length}`}
        />
        <StatCard
          icon={<FileText className="h-4 w-4" />}
          label="Output generated"
          value={formatChars(totalChars)}
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Last activity"
          value={lastTs ? formatRelative(lastTs) : "—"}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => {
          const stat = usage[t.kind];
          return (
            <Link
              key={t.href}
              to={t.href}
              className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${t.accent} opacity-60`}
              />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      stat.runs > 0
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stat.runs} {stat.runs === 1 ? "run" : "runs"}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">{t.unit}</dt>
                    <dd className="mt-0.5 font-semibold text-foreground">{stat.runs}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Last used</dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {formatRelative(stat.lastRun)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 inline-flex items-center gap-1 text-sm text-primary opacity-80 transition group-hover:opacity-100">
                  Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {totalRuns > 0 && (
        <section className="flex items-center justify-between rounded-2xl border bg-card p-4 text-sm shadow-[var(--shadow-soft)]">
          <p className="text-muted-foreground">
            Stats are stored locally in your browser. Reset anytime.
          </p>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-3.5 w-3.5" /> Reset stats
          </Button>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function formatChars(n: number): string {
  if (n < 1000) return `${n} chars`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k chars`;
  return `${(n / 1_000_000).toFixed(1)}M chars`;
}
