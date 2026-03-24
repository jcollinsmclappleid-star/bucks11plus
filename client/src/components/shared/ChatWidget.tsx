import { useState } from "react";
import { MessageCircle, X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send");
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    setOpen(false);
    if (sent) {
      setTimeout(() => {
        setSent(false);
        setName("");
        setEmail("");
        setMessage("");
        setError(null);
      }, 300);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[340px] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-primary px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-primary-foreground text-sm">Contact Support</p>
              <p className="text-primary-foreground/60 text-xs mt-0.5">We're here to help</p>
            </div>
            <button
              onClick={handleClose}
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label="Close chat"
              data-testid="button-chat-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {sent ? (
            <div className="px-5 py-10 flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <p className="font-bold text-primary text-base">Message sent!</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We've received your message and will reply as soon as possible.
              </p>
              <Button size="sm" variant="outline" onClick={handleClose} data-testid="button-chat-done">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Your name (optional)</label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="h-9 text-sm"
                  data-testid="input-chat-name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Email address <span className="text-red-500">*</span></label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-9 text-sm"
                  data-testid="input-chat-email"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Message <span className="text-red-500">*</span></label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  required
                  rows={4}
                  className="text-sm resize-none"
                  data-testid="input-chat-message"
                />
              </div>
              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full h-9 text-sm font-semibold"
                disabled={sending || !email.trim() || !message.trim()}
                data-testid="button-chat-send"
              >
                {sending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Send Message</>
                )}
              </Button>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                We aim to reply within one working day.
              </p>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center group"
        aria-label={open ? "Close support chat" : "Open support chat"}
        data-testid="button-chat-toggle"
      >
        {open ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </button>
    </div>
  );
}
