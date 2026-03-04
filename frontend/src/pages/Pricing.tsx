import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AnimatedBorderCard from "@/components/AnimatedBorderCard";

const plans = [
  {
    name: "Ideas",
    price: "₹199",
    period: "/month",
    subtitle: "Beginners who need content direction before scripting",
    focus: "Content ideas only - no scripts",
    features: [
      "28 Video ideas per month",
      "Niche & trend analysis",
      "Target audience insights",
      "Content direction guidance",
      "Delivery via Google Drive",
      "Email support (Response in 3-4 days)",
    ],
    cta: "Get Ideas →",
    popular: false,
    id: "ideas",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Starter",
    price: "₹499",
    period: "/month",
    subtitle: "New creators (0–5K subs) just starting their Shorts journey",
    focus: "Short-form content only (Shorts / Reels)",
    features: [
      "1 Short-form script per day (28/month)",
      "28 Short video ideas per month",
      "Basic YouTube channel analysis",
      "Niche understanding & content direction",
      "Delivery via Google Drive",
      "Email support (Response within 24 hours)",
    ],
    cta: "Get Starter →",
    popular: false,
    id: "starter",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    name: "Growth",
    price: "₹999",
    period: "/month",
    subtitle: "Growing creators (5K–50K subs) ready to post consistently",
    focus: "Consistent short-form growth + stronger strategy",
    features: [
      "3 Short-form scripts per day (90/month)",
      "90 Short video ideas per month",
      "Improved hooks & retention writing",
      "Titles & hook lines included",
      "Deeper channel + competitor analysis",
      "Content direction based on niche research",
      "Delivered within 24 hours",
      "Delivery via Google Drive",
      "Email support (Response within 24 hours)",
    ],
    cta: "Get Growth →",
    popular: true,
    id: "growth",
    color: "from-purple-500/30 to-orange-500/30",
  },
  {
    name: "Scale",
    price: "₹1,499",
    period: "/month",
    subtitle: "Serious creators (50K+ subs) scaling Shorts + Long-form both",
    focus: "Short-form + Long-form growth",
    features: [
      "4 Short-form scripts per day (120+/month)",
      "120+ Short video ideas per month",
      "3 Long-form YouTube videos (6-10 mins) per month",
      "Advanced retention hooks & storytelling",
      "SEO-optimized titles & descriptions",
      "Trend & topic research with competitor analysis",
      "Hashtag research & optimization",
      "Growth-focused content planning & strategy",
      "Weekly content calendar & scheduling",
      "Delivered within 24 hours",
      "Delivery via Google Drive",
      "Email support (Response & resolve within 24 hours)",
    ],
    cta: "Get Scale →",
    popular: false,
    id: "scale",
    color: "from-emerald-500/20 to-teal-500/20",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelectPlan = (planId: string) => {
    navigate(`/checkout/${planId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />

      <section className="pt-28 pb-24">
        <div className="container">
          <SectionHeading
            badge="Affordable & Transparent"
            title="Creator-Friendly Pricing"
            subtitle="AI-researched, human-refined scripts — pick the plan that matches your upload goals. The sooner you start, the faster your channel grows. No hidden fees, no surprises."
          />

          {/* Pricing Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3 mt-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={isMobile ? undefined : { opacity: 0, y: 24 }}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={isMobile ? undefined : { once: true }}
                transition={isMobile ? undefined : { delay: i * 0.1, duration: 0.5 }}
                className={`relative ${
                  plan.popular ? "scale-105 mt-6" : ""
                } hover:-translate-y-2 transition-transform duration-300`}
              >
                {/* Most Popular Badge — outside AnimatedBorderCard so it's never clipped */}
                {plan.popular && (
                  <motion.div
                    initial={isMobile ? undefined : { opacity: 0, scale: 0.8 }}
                    animate={isMobile ? undefined : { opacity: 1, scale: 1 }}
                    transition={isMobile ? undefined : { delay: 0.3 }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 z-30"
                  >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-lg whitespace-nowrap">
                      Most Popular
                    </span>
                  </motion.div>
                )}
                <AnimatedBorderCard
                  speed={plan.popular ? 6 : 10}
                  glowBlur={plan.popular ? 18 : 12}
                  className="h-full"
                >
                <div className="relative flex flex-col p-8 h-full group">

                {/* Plan Header */}
                <div className={`pb-6 border-b border-border/30`}>
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p>
                  
                  {/* Plan Focus */}
                  <div className={`mt-4 inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r ${plan.color} text-muted-foreground border border-border/50`}>
                    {plan.focus}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mt-8 pb-8 border-b border-border/30">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Billed monthly.</p>
                </div>

                {/* Features */}
                <ul className="mt-8 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 group/item">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-secondary-foreground group-hover/item:text-white transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`mt-8 w-full font-semibold py-6 transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                  } group/btn`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
                </div>
                </AnimatedBorderCard>
              </motion.div>
            ))}
          </div>

          {/* Common Details Section */}
          <motion.div
            initial={isMobile ? undefined : { opacity: 0, y: 16 }}
            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
            viewport={isMobile ? undefined : { once: true }}
            transition={isMobile ? undefined : { delay: 0.4 }}
            className="mt-20 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-800/40 backdrop-blur-sm p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h4 className="text-sm font-bold tracking-widest uppercase text-white/50">How It Works</h4>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { num: "01", label: "Pick a Plan", desc: "Choose Ideas, Starter, Growth, or Scale", color: "from-violet-500 to-purple-600" },
                { num: "02", label: "Fill Details", desc: "Submit your niche, audience & channel link", color: "from-blue-500 to-cyan-500" },
                { num: "03", label: "Pay via UPI", desc: "Secure payment + UTR confirmation", color: "from-orange-500 to-amber-500" },
                { num: "04", label: "Get Scripts", desc: "Delivered to Google Drive within 24hrs", color: "from-emerald-500 to-green-500" },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={isMobile ? undefined : { opacity: 0, y: 12 }}
                  whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                  viewport={isMobile ? undefined : { once: true }}
                  transition={isMobile ? undefined : { delay: 0.1 * i }}
                  className="relative flex flex-col gap-2 rounded-xl bg-white/5 border border-white/8 p-4 hover:bg-white/8 transition-colors"
                >
                  <span className={`text-2xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>{step.num}</span>
                  <p className="font-semibold text-white text-sm leading-tight">{step.label}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-white/20 text-lg z-10">›</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Transparency Section */}
          <motion.div
            initial={isMobile ? undefined : { opacity: 0, y: 16 }}
            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
            viewport={isMobile ? undefined : { once: true }}
            transition={isMobile ? undefined : { delay: 0.5 }}
            className="mt-10 text-center"
          >
            <h4 className="text-lg font-bold text-white mb-4">Our Promise</h4>
            <ul className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>No hidden fees</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>No guaranteed views claims</span>
              </li>

              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Simple, transparent process</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
