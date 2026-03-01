import { Seo } from "../components/shared/Seo";

export default function Legal({ type }: { type: 'terms' | 'privacy' | 'safeguarding' }) {
  const content = {
    terms: {
      title: "Terms of Service",
      date: "Last Updated: October 2023",
      text: "By accessing 11+ Standard, you agree to be bound by these terms of service. Our platform provides educational assessment tools for informational purposes. We do not guarantee a passing score on the official 11+ examination."
    },
    privacy: {
      title: "Privacy Policy",
      date: "Last Updated: October 2023",
      text: "We take your privacy seriously. 11+ Standard collects minimal personal data required to provide our assessment services. We do not sell user data to third parties. Assessment results are kept confidential."
    },
    safeguarding: {
      title: "Safeguarding Policy",
      date: "Last Updated: October 2023",
      text: "11+ Standard is committed to the safety and wellbeing of all children using our platform. Our platform is designed for parent-led administration, and we do not facilitate direct communication between children and other users on the platform."
    }
  };

  const current = content[type];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 prose prose-slate prose-lg min-h-[60vh]">
      <Seo 
        title={`${current.title} | 11+ Standard`} 
        description={`Read our ${current.title.toLowerCase()} to understand our policies and commitments.`} 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-primary font-serif tracking-tight">{current.title}</h1>
      <p className="text-sm text-muted-foreground">{current.date}</p>
      <hr className="my-8" />
      <p>{current.text}</p>
      <p className="text-muted-foreground text-sm mt-12">
        Note: This is a prototype representation of the {current.title.toLowerCase()}. A full legal document would be provided here in production.
      </p>
    </div>
  );
}