import { Seo } from "../components/shared/Seo";

export default function Legal({ type }: { type: 'terms' | 'privacy' | 'safeguarding' | 'refund' }) {
  const content = {
    terms: {
      title: "Terms of Service",
      date: "Last Updated: October 2023",
      sections: [
        {
          heading: "",
          body: "By accessing 11+ Standard, you agree to be bound by these terms of service. Our platform provides educational assessment tools for informational purposes. We do not guarantee a passing score on the official 11+ examination."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      date: "Last Updated: October 2023",
      sections: [
        {
          heading: "",
          body: "We take your privacy seriously. 11+ Standard collects minimal personal data required to provide our assessment services. We do not sell user data to third parties. Assessment results are kept confidential."
        }
      ]
    },
    safeguarding: {
      title: "Safeguarding Policy",
      date: "Last Updated: October 2023",
      sections: [
        {
          heading: "",
          body: "11+ Standard is committed to the safety and wellbeing of all children using our platform. Our platform is designed for parent-led administration, and we do not facilitate direct communication between children and other users on the platform."
        }
      ]
    },
    refund: {
      title: "Refund Policy",
      date: "Last Updated: March 2026",
      sections: [
        {
          heading: "Overview",
          body: "11+ Standard is a digital educational platform. All purchases provide immediate access to digital content including diagnostic assessments, practice questions, analytics dashboards and progress tracking tools. Because our products are delivered digitally, our refund policy reflects the nature of digital goods under UK consumer law."
        },
        {
          heading: "Your Right to Cancel (14-Day Cooling-Off Period)",
          body: "Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have 14 days from the date of purchase to cancel your order and receive a full refund — provided you have not accessed, started or used any of the digital content included in your plan. This includes starting a diagnostic, accessing practice questions, viewing dashboard analytics or downloading any reports."
        },
        {
          heading: "When a Refund Cannot Be Issued",
          body: "Once you begin accessing the digital content — for example by starting a diagnostic assessment, completing practice drills, or viewing personalised analytics — your right to cancel is waived. By using the platform after purchase, you acknowledge and consent to the immediate supply of digital content and confirm that you understand this means you lose your 14-day cancellation right. This is in accordance with the Consumer Contracts Regulations 2013, Regulation 37."
        },
        {
          heading: "How to Request a Refund",
          body: "If you are within the 14-day window and have not accessed any digital content, please email us at support@bucks11plustest.co.uk with your account email address and order reference. We aim to process all eligible refund requests within 5 working days. Refunds will be returned to the original payment method."
        },
        {
          heading: "Exceptional Circumstances",
          body: "If you experience a technical issue that prevents you from using the platform as intended, please contact us at support@bucks11plustest.co.uk. We will review each case individually and may offer a partial refund, credit, or extension at our discretion."
        },
        {
          heading: "Plan Changes & Upgrades",
          body: "If you upgrade from one plan to another (e.g. from Practice Platform to Young Scholar Programme), the cost of your original plan is deducted from the upgrade price. Downgrades are not available once content from a higher-tier plan has been accessed."
        },
        {
          heading: "Contact",
          body: "For any questions about this refund policy or to request a refund, please email support@bucks11plustest.co.uk."
        }
      ]
    }
  };

  const current = content[type];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg min-h-[60vh]">
      <Seo 
        title={`${current.title} | 11+ Standard`} 
        description={`Read our ${current.title.toLowerCase()} to understand our policies and commitments.`} 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight" data-testid="text-legal-title">{current.title}</h1>
      <p className="text-sm text-muted-foreground">{current.date}</p>
      <hr className="my-8" />
      {current.sections.map((section, i) => (
        <div key={i} className={i > 0 ? "mt-8" : ""}>
          {section.heading && (
            <h2 className="text-xl font-bold text-primary font-serif mb-3" data-testid={`text-legal-heading-${i}`}>{section.heading}</h2>
          )}
          <p data-testid={`text-legal-body-${i}`}>{section.body}</p>
        </div>
      ))}
    </div>
  );
}
