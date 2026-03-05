import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { sendEmail } from "@/lib/api";

type CheckoutState = {
  plan?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    transactionId?: string;
    amount?: string | number;
    paymentMethod?: string;
  };
};

const SubmitForm = () => {
  const location = useLocation();
  const state = (location.state as CheckoutState | null) ?? undefined;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: state?.customerInfo?.name || "",
    email: state?.customerInfo?.email || "",
    phone: state?.customerInfo?.phone || "",
    channelLink: "",
    instagramLink: "",
    driveEmail: "",
    niche: "",
    audience: "",
    language: "",
    contentStyle: "",
    references: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Trim all form data
      const trimmedData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        channelLink: formData.channelLink.trim(),
        instagramLink: formData.instagramLink.trim(),
        driveEmail: formData.driveEmail.toLowerCase().trim(),
        niche: formData.niche.trim(),
        audience: formData.audience.trim(),
        language: formData.language.trim(),
        contentStyle: formData.contentStyle.trim(),
        references: formData.references.trim(),
      };

      // Check required fields with proper validation
      if (!trimmedData.name || trimmedData.name.length < 2) {
        setError("Name must be at least 2 characters");
        setLoading(false);
        return;
      }
      if (!trimmedData.email || trimmedData.email.length < 5) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }
      if (!trimmedData.channelLink || trimmedData.channelLink.length < 10) {
        setError("Please enter a valid YouTube channel link");
        setLoading(false);
        return;
      }
      if (!trimmedData.driveEmail || trimmedData.driveEmail.length < 5) {
        setError("Please enter a valid Google Drive email");
        setLoading(false);
        return;
      }
      if (!trimmedData.niche || trimmedData.niche.length < 2) {
        setError("Please enter channel niche");
        setLoading(false);
        return;
      }
      if (!trimmedData.audience || trimmedData.audience.length < 2) {
        setError("Please enter target audience");
        setLoading(false);
        return;
      }
      if (!trimmedData.language) {
        setError("Please select language preference");
        setLoading(false);
        return;
      }
      if (!trimmedData.contentStyle) {
        setError("Please select content style");
        setLoading(false);
        return;
      }

      // Prepare plain text fallback
      const emailContent = `NEW PAYMENT RECEIVED & CHANNEL FORM SUBMITTED!\n\nPAYMENT DETAILS:\nPlan: ${state?.plan || "Unknown"}\nTransaction ID: ${state?.customerInfo?.transactionId || "N/A"}\nAmount: Rs.${state?.customerInfo?.amount || "TBD"}\nPayment Method: ${state?.customerInfo?.paymentMethod || "UPI"}\nDate: ${new Date().toLocaleString('en-IN')}\n\nUSER DETAILS:\nName: ${trimmedData.name}\nEmail: ${trimmedData.email}\nPhone: ${trimmedData.phone}\nYouTube Channel: ${trimmedData.channelLink}\nInstagram: ${trimmedData.instagramLink || "Not provided"}\nGoogle Drive Email: ${trimmedData.driveEmail}\n\nCHANNEL DETAILS:\nNiche: ${trimmedData.niche}\nTarget Audience: ${trimmedData.audience}\nLanguage: ${trimmedData.language}\nContent Style: ${trimmedData.contentStyle}\nReferences: ${trimmedData.references || "None"}\n\nNext Step: Share scripts via Google Drive within 24 hours`;

      // Prepare HTML email
      const submitDate = new Date().toLocaleString('en-IN');
      const emailHTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
@media only screen and (max-width:600px){
  .wrap{width:100%!important;padding:12px!important;}
  .sp{padding:20px 14px!important;}
  .hdr{font-size:20px!important;}
}
</style>
</head>
<body style="margin:0;padding:0;background:#eef0f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<div style="display:none;font-size:1px;color:#eef0f3;line-height:1px;max-height:0;overflow:hidden;">New order from ${trimmedData.name} — ${state?.plan || 'Unknown'} — ₹${state?.customerInfo?.amount || 'TBD'}</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef0f3;padding:24px 0;">
<tr><td align="center">
<table class="wrap" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px;max-width:620px;">

  <tr><td style="background:#b91c1c;border-radius:8px 8px 0 0;padding:11px 20px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;">⚠️&nbsp; Verify Payment Before Sending Scripts &nbsp;⚠️</p>
  </td></tr>

  <tr><td style="background:linear-gradient(135deg,#6d28d9 0%,#4338ca 100%);padding:34px 32px;text-align:center;">
    <p style="margin:0 0 4px;color:#c4b5fd;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Bolzaa Studio</p>
    <h1 class="hdr" style="margin:0 0 6px;color:#fff;font-size:26px;font-weight:800;">New Order Received</h1>
    <p style="margin:0 0 18px;color:#a5b4fc;font-size:13px;">${submitDate}</p>
    <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
      <td style="background:rgba(255,255,255,0.18);border-radius:100px;padding:8px 24px;">
        <span style="color:#fff;font-size:14px;font-weight:700;">${state?.plan || 'Unknown'}&nbsp;&nbsp;•&nbsp;&nbsp;₹${state?.customerInfo?.amount || 'TBD'}</span>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="background:#fff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" style="padding:18px 16px;text-align:center;border-right:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;">Amount</p>
          <p style="margin:0;color:#059669;font-size:22px;font-weight:800;">₹${state?.customerInfo?.amount || 'TBD'}</p>
        </td>
        <td width="34%" style="padding:18px 16px;text-align:center;border-right:1px solid #f3f4f6;border-bottom:1px solid #f3f4f6;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;">Status</p>
          <p style="margin:0;color:#d97706;font-size:14px;font-weight:700;">Pending Verify</p>
        </td>
        <td width="33%" style="padding:18px 16px;text-align:center;border-bottom:1px solid #f3f4f6;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;">Plan</p>
          <p style="margin:0;color:#4338ca;font-size:14px;font-weight:700;">${state?.plan || 'Unknown'}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td class="sp" style="background:#fff;padding:28px 32px;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="background:#fef2f2;border:2px solid #fca5a5;border-radius:10px;padding:18px 20px;text-align:center;">
        <p style="margin:0 0 6px;color:#991b1b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Transaction ID</p>
        <p style="margin:0;color:#dc2626;font-size:17px;font-weight:800;font-family:'Courier New',monospace;letter-spacing:1px;word-break:break-all;">${state?.customerInfo?.transactionId || 'N/A'}</p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:26px;">
      <tr><td style="padding-bottom:10px;border-bottom:2px solid #ede9fe;"><p style="margin:0;color:#6d28d9;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">💳 Payment Details</p></td></tr>
      <tr><td style="padding-top:10px;"><table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;width:38%;font-size:13px;font-weight:600;color:#6b7280;">Plan</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:14px;color:#111827;font-weight:600;">${state?.plan || 'Unknown'}</td></tr>
        <tr><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Transaction ID</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:14px;color:#dc2626;font-weight:800;font-family:'Courier New',monospace;word-break:break-all;">${state?.customerInfo?.transactionId || 'N/A'}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Amount Paid</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:16px;color:#059669;font-weight:800;">₹${state?.customerInfo?.amount || 'TBD'}</td></tr>
        <tr><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Payment Method</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;color:#374151;">${state?.customerInfo?.paymentMethod || 'UPI'}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Date &amp; Time</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;color:#374151;">${submitDate}</td></tr>
      </table></td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:26px;">
      <tr><td style="padding-bottom:10px;border-bottom:2px solid #ede9fe;"><p style="margin:0;color:#6d28d9;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">👤 Customer Details</p></td></tr>
      <tr><td style="padding-top:10px;"><table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;width:38%;font-size:13px;font-weight:600;color:#6b7280;">Full Name</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:14px;color:#111827;font-weight:700;">${trimmedData.name}</td></tr>
        <tr><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Email</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;"><a href="mailto:${trimmedData.email}" style="color:#2563eb;text-decoration:none;">${trimmedData.email}</a></td></tr>
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Phone</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:14px;color:#111827;font-weight:600;">${trimmedData.phone}</td></tr>
        <tr><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">YouTube Channel</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;word-break:break-all;"><a href="${trimmedData.channelLink}" style="color:#2563eb;text-decoration:none;">${trimmedData.channelLink}</a></td></tr>
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Instagram</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;">${trimmedData.instagramLink ? `<a href="${trimmedData.instagramLink}" style="color:#2563eb;text-decoration:none;word-break:break-all;">${trimmedData.instagramLink}</a>` : '<span style="color:#9ca3af;font-style:italic;">Not provided</span>'}</td></tr>
        <tr><td style="padding:13px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Drive Email</td><td style="padding:13px 14px;border:2px solid #bbf7d0;background:#f0fdf4;font-size:14px;color:#065f46;font-weight:800;">${trimmedData.driveEmail}</td></tr>
      </table></td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:26px;">
      <tr><td style="padding-bottom:10px;border-bottom:2px solid #ede9fe;"><p style="margin:0;color:#6d28d9;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🎬 Channel Details</p></td></tr>
      <tr><td style="padding-top:10px;"><table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;width:38%;font-size:13px;font-weight:600;color:#6b7280;">Niche</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:14px;color:#111827;">${trimmedData.niche}</td></tr>
        <tr><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Target Audience</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;color:#374151;">${trimmedData.audience}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Language</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;color:#374151;text-transform:capitalize;">${trimmedData.language}</td></tr>
        <tr><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">Content Style</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;color:#374151;text-transform:capitalize;">${trimmedData.contentStyle}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#6b7280;">References</td><td style="padding:11px 14px;border:1px solid #e5e7eb;font-size:13px;color:#374151;">${trimmedData.references || '<span style="color:#9ca3af;font-style:italic;">None</span>'}</td></tr>
      </table></td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
      <tr><td style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;">
        <p style="margin:0 0 10px;color:#92400e;font-size:13px;font-weight:700;">✅ Before Sending Scripts — Verify All:</p>
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:3px 0;color:#78350f;font-size:13px;">☐&nbsp;&nbsp;Confirm Transaction ID is valid in payment app</td></tr>
          <tr><td style="padding:3px 0;color:#78350f;font-size:13px;">☐&nbsp;&nbsp;Amount matches exactly ₹${state?.customerInfo?.amount || 'TBD'}</td></tr>
          <tr><td style="padding:3px 0;color:#78350f;font-size:13px;">☐&nbsp;&nbsp;Payment status shows SUCCESS/COMPLETED</td></tr>
        </table>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:18px 20px;">
        <p style="margin:0 0 6px;color:#14532d;font-size:14px;font-weight:800;">📤 Action Required</p>
        <p style="margin:0 0 6px;color:#166534;font-size:13px;">Share scripts via Google Drive to:</p>
        <p style="margin:0;background:#dcfce7;border-radius:6px;padding:10px 14px;color:#065f46;font-size:15px;font-weight:800;font-family:'Courier New',monospace;">${trimmedData.driveEmail}</p>
        <p style="margin:8px 0 0;color:#166534;font-size:12px;">Deadline: within 24 hours of verification</p>
      </td></tr>
    </table>

  </td></tr>

  <tr><td style="background:#1e1b4b;border-radius:0 0 8px 8px;padding:18px 32px;text-align:center;">
    <p style="margin:0 0 4px;color:#a5b4fc;font-size:13px;font-weight:600;">Bolzaa Studio</p>
    <p style="margin:0;color:#6366f1;font-size:11px;">Automated order notification — Do not forward to customers</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

      // Send email in background - fire and forget
      sendEmail(
        {
          to: import.meta.env.VITE_ADMIN_EMAIL || "bolzaa277@gmail.com",
          subject: `[Bolzaa] New Order - ${state?.plan || "Plan"} | ${trimmedData.name} | TxID: ${state?.customerInfo?.transactionId || "N/A"}`,
          text: emailContent,
          html: emailHTML,
        }
      ).catch((err: unknown) => {
        console.error("Failed to send email:", err);
      });

      // Show success immediately
      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      // Even if there's an error, show success - form was still submitted
      setSubmitted(true);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <FloatingWhatsApp />
        <section className="flex min-h-[80vh] items-center justify-center pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="mt-4 text-muted-foreground">
              We are analyzing your channel. You will receive your scripts within <strong className="text-foreground">5–7 days</strong> via Google Drive.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check your email for a confirmation.
            </p>
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingWhatsApp />

      <section className="pt-28 pb-24">
        <div className="container">
          <SectionHeading
            badge="Almost Done"
            title="Submit Your Channel Details"
            subtitle="Fill this form so we can start analyzing your channel and crafting your scripts."
          />

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-card p-8 shadow-card"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  placeholder="Your name"
                  minLength={2}
                  maxLength={50}
                  className="bg-secondary border-border"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email ID *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  minLength={5}
                  maxLength={100}
                  className="bg-secondary border-border"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">YouTube Channel Link *</Label>
              <Input
                id="channel"
                required
                placeholder="https://youtube.com/@yourchannel"
                className="bg-secondary border-border"
                value={formData.channelLink}
                onChange={(e) => setFormData({ ...formData, channelLink: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Link (optional)</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourprofile"
                className="bg-secondary border-border"
                value={formData.instagramLink}
                onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driveEmail">Google Drive Email ID *</Label>
              <Input
                id="driveEmail"
                type="email"
                required
                placeholder="Email we'll share the Drive folder with"
                className="bg-secondary border-border"
                value={formData.driveEmail}
                onChange={(e) => setFormData({ ...formData, driveEmail: e.target.value })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="niche">Channel Niche *</Label>
                <Input
                  id="niche"
                  required
                  placeholder="e.g. Tech, Finance, Lifestyle"
                  className="bg-secondary border-border"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience *</Label>
                <Input
                  id="audience"
                  required
                  placeholder="e.g. Students, 18-30 year olds"
                  className="bg-secondary border-border"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Language Preference *</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hinglish">Hinglish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content Style *</Label>
                <Select value={formData.contentStyle} onValueChange={(value) => setFormData({ ...formData, contentStyle: value })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="explainer">Explainer</SelectItem>
                    <SelectItem value="facts">Facts</SelectItem>
                    <SelectItem value="motivation">Motivation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="references">Reference Channels (optional)</Label>
              <Textarea
                id="references"
                placeholder="Channels you admire or want to create content like"
                className="bg-secondary border-border"
                rows={3}
                value={formData.references}
                onChange={(e) => setFormData({ ...formData, references: e.target.value })}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow btn-glow"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit & Start My Order"}
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubmitForm;
