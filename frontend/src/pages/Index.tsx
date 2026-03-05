import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, FileText, BarChart3, Users, CheckCircle2, Youtube, Instagram, Eye, Clock, Lightbulb, TrendingUp, FolderOpen, ArrowRight, XCircle, CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import SectionHeading from "@/components/SectionHeading";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import StickyGetStarted from "@/components/StickyGetStarted";


const trustItems = [
  "YouTube-only focus",
  "Beginner-friendly",
  "Affordable plans",
  "AI & Human Enhanced Scripts",
];

const painPoints = [
  { icon: Lightbulb, title: "No Content Ideas", desc: "Staring at a blank screen, wondering what to film next." },
  { icon: Eye, title: "Low Views & Reach", desc: "Uploading regularly but not getting the views you deserve." },
  { icon: Clock, title: "No Time for Research", desc: "Spending hours on research instead of creating." },
  { icon: TrendingUp, title: "Algorithm Confusion", desc: "Not knowing what YouTube actually recommends." },
];

const steps = [
  { icon: BarChart3, title: "Choose a Plan", desc: "Pick the subscription that fits your channel size and goals." },
  { icon: FileText, title: "Fill Out Your Form", desc: "Share your channel details, niche, audience, and content preferences." },
  { icon: Users, title: "Complete Payment", desc: "Pay securely via UPI and submit your transaction reference." },
  { icon: FolderOpen, title: "Receive Scripts", desc: "We research, write, and deliver scripts directly to your Google Drive." },
];

const forYou = [
  "Creators with 0–100K subscribers",
  "YouTubers who struggle with scripting ideas",
  "Channels wanting niche-specific, researched scripts",
  "Hindi, English, or Hinglish content creators",
];

const notForYou = [
  "Channels already having a full content team",
  "Creators looking for video editing services",
  "Anyone expecting overnight viral success",
  "Platforms outside YouTube (TikTok, Instagram, etc.)",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />
      <StickyGetStarted />

      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="pointer-events-none absolute left-8 top-1/2 z-10 hidden -translate-y-1/2 lg:block xl:left-16">
          <div className="flex items-center justify-center drop-shadow-[0_10px_35px_rgba(255,0,0,0.5)] animate-float">
            <Youtube className="h-24 w-24 text-red-600" />
          </div>
        </div>
        <div className="pointer-events-none absolute right-10 top-1/2 z-10 hidden -translate-y-1/2 lg:block xl:right-20">
          <div className="flex items-center justify-center drop-shadow-[0_10px_35px_hsl(var(--primary)/0.3)] animate-float" style={{ animationDelay: '0.5s' }}>
            <Instagram className="h-24 w-24 text-pink-600" />
          </div>
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <Youtube className="h-5 w-5 text-primary" />
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                For New & Growing Creators
              </span>
              <Instagram className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Stop Struggling With{" "}
              <span className="text-gradient">Scripts & Low Views</span>
              <br />
              Start Growing Your Channel
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              We use AI to deep-research your niche, then our expert writers craft and refine every script — delivered straight to your Google Drive. You just hit record and upload.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow btn-glow px-8 text-base animate-bounce-smooth">
                  View Plans
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/samples">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px 0px rgba(168,85,247,0)",
                      "0 0 16px 4px rgba(168,85,247,0.45)",
                      "0 0 0px 0px rgba(168,85,247,0)",
                    ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-lg"
                >
                  <Button size="lg" variant="outline" className="border-primary/60 text-foreground hover:bg-secondary px-8 text-base hover:border-primary hover:shadow-md transition-all duration-300">
                    <Play className="mr-1 h-4 w-4" />
                    Get Free Sample
                  </Button>
                </motion.div>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {trustItems.map((item, i) => (
                <div key={item} className={`flex items-center gap-2 text-sm text-muted-foreground justify-center ${i === 1 || i === 2 ? "hidden sm:flex" : "flex"}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-gradient-surface">
        <div className="container">
          <SectionHeading
            badge="Sound Familiar?"
            title="The Struggles Every New Creator Faces"
            subtitle="You're not alone. Most small creators face the same problems — and they're all solvable."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-border bg-card p-6 card-hover group hover:border-primary/50 hover:bg-gradient-warm transition-all duration-300"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300 animate-pulse-glow">
                  <point.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{point.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-24">
        <div className="container">
          <SectionHeading
            badge="Our Solution"
            title="We Handle the Hard Part"
            subtitle="You focus on filming. We'll give you the scripts, ideas, hooks, and strategy — all researched for your niche."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-2xl border border-border bg-gradient-warm p-8 md:p-10 text-center"
          >
            <p className="text-lg text-foreground leading-relaxed">
              Think of us as your dedicated <span className="text-primary font-semibold">content research partner</span>. 
              We audit your channel, decode your audience behavior, and map what is actually performing in your niche — 
              then combine <span className="text-primary font-semibold">AI-powered insights</span> with expert human writing to deliver scripts you can record the same day. 
              No guesswork. No copy-paste templates. Just consistent, strategy-led content built for real growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-surface">
        <div className="container">
          <SectionHeading
            badge="Simple Process"
            title="How It Works"
            subtitle="Simple steps — from placing your order to getting scripts in your Google Drive."
          />
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group relative rounded-xl border border-border bg-card p-6 card-hover overflow-hidden hover:border-primary/50 hover:shadow-hover transition-all duration-300"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(circle at top right, hsl(16 85% 60% / 0.1), transparent)'}}></div>
                
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-all duration-300 group-hover:from-primary/40 group-hover:to-accent/40 group-hover:scale-110 group-hover:animate-pulse-glow">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="absolute right-4 top-4 font-display text-3xl font-bold bg-gradient-to-r from-primary/40 to-accent/40 bg-clip-text text-transparent">
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/how-it-works">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                Learn More →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-gradient-surface">
        <div className="container">
          <SectionHeading
            badge="Why Trust Us"
            title="Built on Clarity, Not Hype"
            subtitle="We don't make wild promises. Here's what we actually do."
          />
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
            {[
              { title: "Transparent Process", desc: "You always know what happens next. No black boxes." },
              { title: "AI & Human Enhanced", desc: "Every script is AI-researched and human-refined by expert writers for your niche and audience." },
              { title: "Affordable Plans", desc: "No hidden fees. Cancel within 7 days for a full refund — after that, the order is locked in and non-refundable." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 text-center card-hover hover:border-primary/50 hover:shadow-hover hover:bg-gradient-warm transition-all duration-300"
              >
                <div className="w-1 h-1 bg-primary rounded-full mx-auto mb-3 group-hover:animate-pulse-glow"></div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient-shift"></div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-hero p-12 md:p-16 text-center shadow-glow hover:shadow-hover transition-shadow duration-300 border border-primary/20 group"
          >
            {/* Animated corner glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl animate-slide-in-up">
                Ready to Create Better Content?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80 leading-relaxed animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                Stop wasting hours on scripting. Get viral-ready scripts every 24 hours — crafted for your niche, your audience, your growth.
              </p>
              <Link to="/pricing">
                <Button size="lg" className="mt-8 bg-background text-foreground hover:bg-background/90 btn-glow px-8 text-base animate-bounce-smooth">
                  Choose Your Plan
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
