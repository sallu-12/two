import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const StickyGetStarted = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 z-40 md:hidden"
        >
          <Link to="/pricing">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow btn-glow rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyGetStarted;
