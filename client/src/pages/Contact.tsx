import { Link } from "wouter";
import { Seo } from "../components/shared/Seo";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 min-h-[60vh]">
      <Seo
        title="Contact Us | 11+ Standard"
        description="Get in touch with the 11+ Standard team. We're here to help with any questions about our Buckinghamshire 11+ preparation platform."
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
