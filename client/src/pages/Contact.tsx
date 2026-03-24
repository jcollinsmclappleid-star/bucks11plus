import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 min-h-[60vh]">
      <Seo
        title="Contact | Bucks 11 Plus Preparation Help | Bucks 11 Plus Tests"
        description="Get in touch with the Bucks 11 Plus Tests team for help with your Bucks 11 Plus preparation. We're here to answer your questions about the Secondary Transfer Test."
        canonicalPath="/contact"
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight mb-4" data-testid="text-contact-title">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question about our platform, your account or the Buckinghamshire 11+? We're here to help.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10" data-testid="card-contact-form">
          <h2 className="text-xl font-bold text-primary font-serif mb-1">Send a Message</h2>
          <p className="text-sm text-muted-foreground mb-6">We'll get back to you within 1 working day.</p>
          <ContactForm />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8" data-testid="card-contact-info">
          <h3 className="font-bold text-primary font-serif mb-3">Before you get in touch</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>For refund requests, please include your account email and order reference. See our <Link href="/refund-policy" className="text-primary underline underline-offset-2 hover:text-primary/80">Refund Policy</Link> for eligibility details.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>For technical issues, let us know which browser and device you're using so we can help faster.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>For questions about the Buckinghamshire 11+ process, check our <Link href="/buckinghamshire-11-plus-guide" className="text-primary underline underline-offset-2 hover:text-primary/80">Bucks 11+ Guide</Link> which covers registration, timelines and qualifying scores.</span>
            </li>
          </ul>
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
