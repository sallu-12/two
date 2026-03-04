import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, ClipboardList, Search, FolderOpen, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const steps = [
  {
    icon: CreditCard,
    title: "Choose a Plan",
    desc: "Pick from 4 plans — Ideas, Starter, Growth, or Scale — based on how many scripts you need. No hidden fees, no subscription lock-in.",
  },
  {
    icon: ClipboardList,
    title: "Fill Out Your Details First",
    desc: "Share your channel link, niche, target audience, content preferences, and personal details through a simple form.",
  },
  {
    icon: Search,
    title: "Complete Payment via UPI",
    desc: "Pay securely using UPI and submit your transaction reference (UTR). We verify your payment details and then send confirmation to your email and Instagram DM.",
  },
  {
    icon: FolderOpen,
    title: "Receive Scripts via Google Drive",
    desc: "Based on your selected plan, we craft the exact number of script ideas — thoroughly researched for your niche, audience, and channel style. All scripts are delivered to a shared Google Drive folder within the promised timeframe.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />

      <section className="pt-28 pb-24">
        <div className="container">
          <SectionHeading
            badge="Process"
            title="How It Works"
            subtitle="No logins, no dashboards. Fill out your details, pay once — and our AI-powered research + expert writers deliver ready-to-record scripts straight to your Google Drive."
          />

          <div className="mx-auto max-w-2xl space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex gap-6 rounded-xl border border-border bg-card p-6 card-hover"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-bold text-primary">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow btn-glow px-8">
                View Plans & Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
