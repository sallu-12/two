import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Youtube, Instagram, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AnimatedBorderCard from "@/components/AnimatedBorderCard";


const Samples = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />

      <section className="pt-28 pb-24">
        <div className="container">
          <SectionHeading
            badge="Sample Scripts"
            title="Get Your Free Sample Script"
            subtitle="Completely free. No plan required. Your script + sample will be sent to email and Instagram DM."
          />

          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-lg"
            >
              <AnimatedBorderCard speed={8} glowBlur={14}>
                <div className="p-8">
                {/* Ambient glows inside */}
                <div className="pointer-events-none absolute -top-8 -left-8 h-44 w-44 rounded-full bg-purple-700/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-pink-700/15 blur-3xl" />
                {/* Icon */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500 shadow-lg shadow-primary/30"
                >
                  <Sparkles className="h-7 w-7 text-white" />
                </motion.div>

                <h3 className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Request Your Free Sample Script
                </h3>

                <p className="mt-3 text-sm text-white/50 leading-relaxed">
                  No credit card. No plan required. Just share your <span className="text-white/80 font-medium">niche, channel link & Instagram handle</span> — we'll craft a complete, ready-to-film sample script and deliver it to your <span className="text-white/80 font-medium">email & Instagram DM</span>.
                </p>

                {/* What we need */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                  {[
                    { icon: Youtube, label: "Channel Link", color: "text-red-400" },
                    { icon: Instagram, label: "Instagram ID", color: "text-pink-400" },
                    { icon: Mail, label: "Your Email", color: "text-blue-400" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5 rounded-lg bg-white/5 py-2.5 px-2 border border-white/8">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <span className="text-white/50">{label}</span>
                    </div>
                  ))}
                </div>

                <Link to="/contact">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6"
                  >
                    <Button className="w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow py-5">
                      Get My Free Sample Script
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>

                <p className="mt-3 text-xs text-white/25">Delivered within 24–48 hours · 100% free · No commitment</p>
                </div>
              </AnimatedBorderCard>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Samples;
