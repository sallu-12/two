import { MessageCircle, X, Mail, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142_70%_45%)] text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        aria-label="Contact Support"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-24 right-6 z-[70] w-80 rounded-xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Contact Support</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Facing any issues? Reach out to us through any of these channels:
                </p>

                <div className="space-y-3">
                  <a
                    href="mailto:bolzaa277@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium text-foreground">bolzaa277@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/bolzaa277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Instagram</p>
                      <p className="text-sm font-medium text-foreground">@bolzaa277</p>
                    </div>
                  </a>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    We typically respond within 24 hours. For payment-related issues, please include your transaction ID.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingWhatsApp;
