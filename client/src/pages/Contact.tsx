import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 min-h-[60vh]">
      <Seo
        title="Contact 11+ Standard | Bucks 11+ Preparation Support"
        description="Get in touch with the 11+ Standard team for help with your account, the platform, or any questions about Bucks 11+ preparation and the Secondary Transfer Test."
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
        <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 text-center space-y-6" data-testid="card-contact-email">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary font-serif mb-2">Email Support</h2>
            <p className="text-muted-foreground text-sm mb-4">
              For account queries, technical support, refund requests or general questions about 11+ Standard.
            </p>
            <a
              href="mailto:support@bucks11plustest.co.uk"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
              data-testid="link-support-email"
            >
              support@bucks11plustest.co.uk
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            We aim to respond to all enquiries within 1 working day.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 md:p-10" data-testid="card-contact-form">
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
  const [submitted, setSubmitted] = useState(false);

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
    <form
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      className="space-y-4"
      data-testid="contact-form"
    >
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-primary mb-1.5">Your Name</label>
        <input
          id="contact-name"
          type="text"
          required
          placeholder="Full name"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          data-testid="input-contact-name"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-primary mb-1.5">Email Address</label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          data-testid="input-contact-email"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-primary mb-1.5">Message</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
          data-testid="input-contact-message"
        />
      </div>
      <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-semibold" data-testid="button-contact-submit">
        <Send className="mr-2 h-4 w-4" /> Send Message
      </Button>
    </form>
  );
}
