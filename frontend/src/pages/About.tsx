import { motion } from "framer-motion";
import { Heart, Target, Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AnimatedBorderCard from "@/components/AnimatedBorderCard";

const values = [
  {
    icon: Target,
    title: "YouTube-Only Focus",
    desc: "We don't spread ourselves thin. Every script, strategy, and idea is crafted specifically for YouTube's algorithm and audience.",
  },
  {
    icon: Heart,
    title: "Creator-First Mindset",
    desc: "We understand the struggles of small creators. Our pricing, process, and support are built around your reality.",
  },
  {
    icon: Youtube,
    title: "AI & Human Enhanced",
    desc: "AI-powered research meets expert human writing — every script is refined for authenticity, engagement, and your unique voice.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />

      <section className="pt-28 pb-24">
        <div className="container">
          <SectionHeading
            badge="About Us"
            title="Helping New Creators Grow Faster"
            subtitle="We believe every creator deserves great content — even if you're just starting out."
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl"
          >
            <AnimatedBorderCard speed={12} glowBlur={16}>
              <div className="p-8 md:p-10 text-center">
                {/* Ambient glow blobs */}
                <div className="pointer-events-none absolute -top-8 -left-8 h-40 w-40 rounded-full bg-purple-700/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-pink-700/15 blur-3xl" />
                <p className="text-white/80 leading-relaxed text-base">
                  Bolzaa was born from a simple idea: new YouTube creators shouldn't have to struggle with content ideas alone.
                  We use <span className="text-primary font-semibold">AI-powered research</span> to deeply understand your niche, analyze competitors, and uncover what's actually working —
                  then our <span className="text-purple-300 font-semibold">expert writers</span> craft and refine every script for authenticity and engagement.
                  No shortcuts. No cookie-cutter templates. Just real, thoughtful content strategy delivered straight to your <span className="text-white font-medium">Google Drive</span>.
                </p>
              </div>
            </AnimatedBorderCard>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center card-hover"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
