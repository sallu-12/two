import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AnimatedBorderCard from "@/components/AnimatedBorderCard";
import { sendEmail } from "@/lib/api";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: (formData.get("name") as string)?.trim(),
        email: (formData.get("email") as string)?.toLowerCase().trim(),
        instagram: (formData.get("instagram") as string)?.trim(),
        channelLink: (formData.get("channelLink") as string)?.trim(),
        niche: (formData.get("niche") as string)?.trim(),
        message: (formData.get("message") as string)?.trim(),
      };

      // Validate minimum lengths
      if (!data.name || data.name.length < 2) {
        setError("Name must be at least 2 characters");
        setLoading(false);
        return;
      }
      if (!data.email || data.email.length < 5) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }
      if (!data.instagram || data.instagram.length < 3) {
        setError("Please enter a valid Instagram ID");
        setLoading(false);
        return;
      }
      if (!data.channelLink || data.channelLink.length < 5) {
        setError("Please enter your YouTube channel link");
        setLoading(false);
        return;
      }
      if (!data.niche) {
        setError("Please select a niche");
        setLoading(false);
        return;
      }
      if (!data.message || data.message.length < 5) {
        setError("Message must be at least 5 characters");
        setLoading(false);
        return;
      }

      await sendEmail(data, 5000);

      // Show success immediately - email will be sent in background
      setSent(true);
      // Reset form
      (e.target as HTMLFormElement).reset();
      setSelectedNiche("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setError(errorMessage);
      console.error("Email sending error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />

      <section className="pt-28 pb-24">
        <div className="container">
          <SectionHeading
            badge="Contact"
            title="Get in Touch"
            subtitle="Have a question or want a free sample script? Reach out anytime."
          />

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-5">
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Email</h4>
                  <a href="mailto:bolzaa277@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">bolzaa277@gmail.com</a>
                </div>
              </div>

            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-3"
            >
              <AnimatedBorderCard>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-10 text-center"
                >
                  <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold">Message Sent!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                  <Button 
                    onClick={() => setSent(false)}
                    variant="outline"
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-8">
                  {error && (
                    <div className="flex items-start gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  )}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" name="name" required placeholder="Your name" minLength={2} maxLength={50} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required placeholder="you@email.com" minLength={5} maxLength={100} className="bg-secondary border-border" />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram ID *</Label>
                      <Input id="instagram" name="instagram" required placeholder="@yourinstagram" minLength={3} maxLength={30} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niche">Select Niche *</Label>
                      <input type="hidden" name="niche" value={selectedNiche} />
                      <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                        <SelectTrigger id="niche" className="w-full bg-secondary border-border text-foreground">
                          <SelectValue placeholder="Choose niche..." />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]">
                          <SelectItem value="tech" className="whitespace-normal break-words">Tech & Software</SelectItem>
                          <SelectItem value="finance" className="whitespace-normal break-words">Finance & Investing</SelectItem>
                          <SelectItem value="motivation" className="whitespace-normal break-words">Motivation & Personal Growth</SelectItem>
                          <SelectItem value="lifestyle" className="whitespace-normal break-words">Lifestyle & Wellness</SelectItem>
                          <SelectItem value="education" className="whitespace-normal break-words">Education & Learning</SelectItem>
                          <SelectItem value="gaming" className="whitespace-normal break-words">Gaming & Entertainment</SelectItem>
                          <SelectItem value="business" className="whitespace-normal break-words">Business & Entrepreneurship</SelectItem>
                          <SelectItem value="fitness" className="whitespace-normal break-words">Fitness & Health</SelectItem>
                          <SelectItem value="beauty" className="whitespace-normal break-words">Beauty & Fashion</SelectItem>
                          <SelectItem value="cooking" className="whitespace-normal break-words">Cooking & Food</SelectItem>
                          <SelectItem value="travel" className="whitespace-normal break-words">Travel & Adventure</SelectItem>
                          <SelectItem value="other" className="whitespace-normal break-words">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channelLink">YouTube Channel Link *</Label>
                    <Input id="channelLink" name="channelLink" required placeholder="https://youtube.com/@yourchannel" minLength={5} maxLength={200} className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" name="message" required placeholder="How can we help?" minLength={5} maxLength={500} rows={5} className="bg-secondary border-border" />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
              </AnimatedBorderCard>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
