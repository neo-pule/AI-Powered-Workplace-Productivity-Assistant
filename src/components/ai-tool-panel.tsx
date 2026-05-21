import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAi } from "@/lib/ai.functions";
import { recordUsage } from "@/lib/usage";
import { toast } from "sonner";

type Kind = "email" | "meetings" | "tasks" | "research";

interface AiToolPanelProps {
  kind: Kind;
  title: string;
  description: string;
  icon: ReactNode;
  placeholder: string;
  examples: string[];
  cta: string;
}

export function AiToolPanel({
  kind,
  title,
  description,
  icon,
  placeholder,
  examples,
  cta,
}: AiToolPanelProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const runAiFn = useServerFn(runAi);

  const run = async (prompt?: string) => {
    const value = (prompt ?? input).trim();
    if (!value) {
      toast.error("Please enter some input first.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await runAiFn({ data: { kind, prompt: value } });
      if (res.error) {
        toast.error(res.error);
      } else {
        setOutput(res.text);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-10">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-[var(--shadow-soft)]">
          <span className="text-primary">{icon}</span>
          <span>AI feature</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </header>

      <section className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
        <label className="text-sm font-medium">Your input</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          rows={8}
          className="mt-2 resize-y bg-background"
        />

        {examples.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {ex.length > 60 ? ex.slice(0, 60) + "…" : ex}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{input.length} characters</p>
          <Button onClick={() => run()} disabled={loading} size="lg" className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating…" : cta}
          </Button>
        </div>
      </section>

      <section className="min-h-[200px] rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Result</h2>
          {output && (
            <Button onClick={copy} variant="ghost" size="sm" className="gap-2">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        ) : output ? (
          <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:tracking-tight prose-pre:bg-muted">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your AI-generated output will appear here.
          </p>
        )}
      </section>
    </div>
  );
}
