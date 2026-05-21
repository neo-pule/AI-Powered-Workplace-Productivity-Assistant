import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { MessageCircle, Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { recordUsage } from "@/lib/usage";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Aurora" },
      { name: "description", content: "Conversational AI assistant powered by Lovable AI." },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "aurora.chat.messages.v1";

function loadInitial(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function ChatPage() {
  const [initial] = useState<UIMessage[]>(() => loadInitial());
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: "aurora-chat",
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => toast.error(err.message || "Chat request failed"),
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore quota */
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    recordUsage("chat", text.length);
    await sendMessage({ text });
  };

  const clear = () => {
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    toast.success("Conversation cleared");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-[var(--shadow-soft)]">
            <MessageCircle className="h-3.5 w-3.5 text-primary" />
            AI Chatbot
          </div>
          <h1 className="font-display text-2xl">Chat with Aurora</h1>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="gap-2">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-8">
        {messages.length === 0 && (
          <div className="mx-auto mt-20 max-w-md text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-xl">Start a conversation</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask anything — brainstorming, code questions, explanations, writing help.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "Explain vector embeddings simply",
                "Brainstorm names for a coffee brand",
                "Write a SQL query to find top users",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="rounded-full border bg-secondary px-3 py-1 text-xs hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {isUser ? (
                <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground shadow-[var(--shadow-soft)]">
                  <p className="whitespace-pre-wrap text-sm">{text}</p>
                </div>
              ) : (
                <div className="max-w-[85%]">
                  <div className="mb-1 text-xs font-medium text-muted-foreground">Aurora</div>
                  <div className="prose prose-sm max-w-none prose-headings:font-display prose-p:my-2 prose-pre:bg-muted">
                    {text ? (
                      <ReactMarkdown>{text}</ReactMarkdown>
                    ) : (
                      <span className="text-muted-foreground">…</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Aurora is thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t bg-background/80 p-4 backdrop-blur md:p-6"
      >
        <div className="relative mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border bg-card p-2 shadow-[var(--shadow-soft)] focus-within:ring-2 focus-within:ring-ring/40">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Message Aurora… (Shift+Enter for newline)"
            rows={1}
            className="max-h-40 min-h-10 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            disabled={busy}
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()} className="shrink-0">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
          AI-generated content may require human review.
        </p>
      </form>
    </div>
  );
}
