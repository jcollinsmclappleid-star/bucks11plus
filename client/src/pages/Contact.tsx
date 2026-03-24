import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageSquare, Clock, Heart } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  return (
    <div className="min-h-[100vh] bg-gradient-to-b from-blue-50 via-white to-slate-50">
      <Seo
        title="Contact | Bucks 11 Plus Preparation Help | Bucks 11 Plus Tests"
        description="Get in touch with the Bucks 11 Plus Tests team for help with your Bucks 11 Plus preparation. We're here to answer your questions about the Secondary Transfer Test."
        canonicalPath="/contact"
      />

      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-16 text-center">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground flex items-center justify-center shadow-md">
              <span className="text-lg font-bold">✓</span>
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Bucks 11 Plus Tests</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-4" data-testid="text-contact-title">
            We're Here to Help
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Questions about your child's progress, the platform, or the Buckinghamshire 11+? Our team is ready to support you on your preparation journey.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg border border-emerald-100 p-4">
              <Clock className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Fast Response</p>
              <p className="text-xs text-slate-500">Within 1 working day</p>
            </div>
            <div className="bg-white rounded-lg border border-amber-100 p-4">
              <MessageSquare className="h-5 w-5 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Always Listen</p>
              <p className="text-xs text-slate-500">Your feedback matters</p>
            </div>
            <div className="bg-white rounded-lg border border-violet-100 p-4">
              <Heart className="h-5 w-5 text-violet-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Genuine Care</p>
              <p className="text-xs text-slate-500">We're on your side</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Operated by <span className="font-semibold text-slate-700">Ianson Systems Limited</span>
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl border border-primary/10 bg-white shadow-lg p-8 md:p-10" data-testid="card-contact-form">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <h2 className="text-lg font-bold text-primary font-serif">Send us a Message</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">Fill out the form below and we'll be in touch shortly.</p>
            <ContactForm />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6" data-testid="card-contact-tip-1">
              <div className="h-8 w-8 rounded bg-emerald-200 text-emerald-700 flex items-center justify-center text-sm font-bold mb-3">?</div>
              <h3 className="font-bold text-emerald-900 mb-2">Technical Help</h3>
              <p className="text-sm text-emerald-800">Let us know your browser and device — we can troubleshoot faster that way.</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6" data-testid="card-contact-tip-2">
              <div className="h-8 w-8 rounded bg-amber-200 text-amber-700 flex items-center justify-center text-sm font-bold mb-3">📋</div>
              <h3 className="font-bold text-amber-900 mb-2">Refund or Billing</h3>
              <p className="text-sm text-amber-800">Have your account email and order reference handy. Check our <Link href="/refund-policy" className="text-amber-700 underline underline-offset-2 hover:text-amber-800 font-semibold">Refund Policy</Link> for details.</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6" data-testid="card-contact-tip-3">
              <div className="h-8 w-8 rounded bg-violet-200 text-violet-700 flex items-center justify-center text-sm font-bold mb-3">📚</div>
              <h3 className="font-bold text-violet-900 mb-2">11+ Questions</h3>
              <p className="text-sm text-violet-800">Check our <Link href="/buckinghamshire-11-plus-guide" className="text-violet-700 underline underline-offset-2 hover:text-violet-800 font-semibold">Bucks 11+ Guide</Link> for timelines, registration, and qualifying scores.</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6" data-testid="card-contact-tip-4">
              <div className="h-8 w-8 rounded bg-blue-200 text-blue-700 flex items-center justify-center text-sm font-bold mb-3">💬</div>
              <h3 className="font-bold text-blue-900 mb-2">Chat Widget</h3>
              <p className="text-sm text-blue-800">See the message button in the bottom right? Click it anytime for quick support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState<string>("general");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch("/api/contact/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          enquiryType,
          message: message.trim()
        })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send message");
      }
      
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6 space-y-3" data-testid="contact-form-success">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Send className="h-5 w-5 text-green-600" />
        </div>
        <p className="font-semibold text-primary">Message received</p>
        <p className="text-sm text-muted-foreground">We'll reply to your email within 1 working day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-primary mb-1.5">Your Name (optional)</label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          data-testid="input-contact-name"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-primary mb-1.5">Email Address <span className="text-red-500">*</span></label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          data-testid="input-contact-email"
        />
      </div>
      <div>
        <label htmlFor="contact-type" className="block text-sm font-medium text-primary mb-1.5">Enquiry Type <span className="text-red-500">*</span></label>
        <select
          id="contact-type"
          value={enquiryType}
          onChange={e => setEnquiryType(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          data-testid="select-contact-type"
        >
          <option value="general">General Enquiry</option>
          <option value="technical">Technical Issue</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-primary mb-1.5">Message <span className="text-red-500">*</span></label>
        <textarea
          id="contact-message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
          data-testid="input-contact-message"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" data-testid="contact-form-error">{error}</p>
      )}
      <Button 
        type="submit" 
        disabled={submitting || !email.trim() || !message.trim()}
        className="w-full h-11 bg-primary text-primary-foreground font-semibold" 
        data-testid="button-contact-submit"
      >
        {submitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="mr-2 h-4 w-4" /> Send Message</>
        )}
      </Button>
    </form>
  );
}
