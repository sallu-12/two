import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const faqs = [
  {
    q: "How does this work exactly?",
    a: "It's simple: you pick a plan, fill a form with your channel details, pay securely via UPI, and we deliver scripts to your Google Drive according to your plan schedule. No dashboards, no logins — just scripts in your Google Drive.",
  },
  {
    q: "Who writes the scripts?",
    a: "Our writing team does. Every script is researched and written by real humans with AI assistance after studying your niche, competitors, and audience.",
  },
  {
    q: "What if I'm a complete beginner with 0 subscribers?",
    a: "That's exactly who we built this for. Our Starter plan is designed for creators who are just starting out. We'll help you find your voice and create content that actually gets views.",
  },
  {
    q: "How do I receive my scripts?",
    a: "We create a shared Google Drive folder using the email you provide in the form. All your scripts, content ideas, and strategy docs are uploaded there. You'll get an email when they're ready.",
  },
  {
    q: "What languages do you support?",
    a: "We currently write scripts in Hindi, English, and Hinglish. Let us know your preference in the form and we'll match it.",
  },
  {
    q: "Do you help with video editing or thumbnails?",
    a: "Not right now. We focus exclusively on scripts, content ideas, titles, hooks, and channel strategy. We do one thing, and we do it really well.",
  },
  {
    q: "What's the turnaround time?",
    a: "After payment confirmation, you'll receive scripts every 24 hours according to your chosen plan. First delivery starts within 24-48 hours of confirmation.",
  },
  {
    q: "Can I request scripts on specific topics?",
    a: "Yes! In the form, you can mention reference channels and topic preferences. We'll use that alongside our own research to craft the best scripts for your audience.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. You can cancel and request a full refund within 7 days if you're not satisfied. After 7 days, your money will not be refunded. Once scripts are delivered, we offer revisions based on your feedback.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />

      <section className="pt-28 pb-24">
        <div className="container">
          <SectionHeading
            badge="FAQ"
            title="Questions? We've Got Answers"
            subtitle="Everything you need to know before getting started."
          />

          <div className="mx-auto max-w-2xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-card transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                  Contact Us
                </Button>
              </Link>
              <Link to="/pricing">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow">
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
