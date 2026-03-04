import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Phone, CreditCard, CheckCircle2, WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

interface PlanDetails {
  name: string;
  price: number;
  scripts: string;
}

const planDetails: Record<string, PlanDetails> = {
  ideas: {
    name: "Ideas Plan",
    price: 199,
    scripts: "28 Video ideas/month",
  },
  starter: {
    name: "Starter Plan",
    price: 499,
    scripts: "28 Short-form scripts/month + 28 Shorts ideas",
  },
  growth: {
    name: "Growth Plan",
    price: 999,
    scripts: "90 Short-form scripts/month + 90 Shorts ideas",
  },
  scale: {
    name: "Scale Plan",
    price: 1499,
    scripts: "120+ Short-form scripts/month + 3 Long-form videos",
  },
};

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = planDetails[planId || "starter"];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    email: "",
    phone: "",
    // Channel Info
    channelLink: "",
    instagramLink: "",
    driveEmail: "",
    // Channel Details
    niche: "",
    audience: "",
    language: "",
    contentStyle: "",
    references: "",
  });

  const [transactionId, setTransactionId] = useState("");
  const [isUtrValid, setIsUtrValid] = useState(false);
  const upiId = import.meta.env.VITE_UPI_ID || "";

  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-foreground">Plan not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required fields with strict per-field checks
    const name = formData.name.trim();
    const email = formData.email.toLowerCase().trim();
    const phone = formData.phone.trim();
    const channelLink = formData.channelLink.trim();
    const instagramLink = formData.instagramLink.trim();
    const driveEmail = formData.driveEmail.toLowerCase().trim();
    const niche = formData.niche.trim();
    const audience = formData.audience.trim();
    const language = formData.language.trim();
    const contentStyle = formData.contentStyle.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 2) {
      setError("Please enter your full name (at least 2 characters)");
      return;
    }

    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const onlyDigitsPhone = phone.replace(/\D/g, "");
    if (!onlyDigitsPhone || onlyDigitsPhone.length < 10) {
      setError("Please enter a valid phone number (minimum 10 digits)");
      return;
    }

    if (!channelLink || channelLink.length < 10) {
      setError("Please enter a valid YouTube channel link");
      return;
    }

    if (!channelLink.includes("youtube.com") && !channelLink.includes("youtu.be")) {
      setError("Please enter a valid YouTube channel link (must be from youtube.com)");
      return;
    }

    if (instagramLink) {
      if (!instagramLink.includes("instagram.com")) {
        setError("Please enter a valid Instagram link (must be from instagram.com)");
        return;
      }
      // Validate that there's a username after instagram.com (basic format check)
      const instaRegex = /instagram\.com\/[a-zA-Z0-9._-]+/;
      if (!instaRegex.test(instagramLink)) {
        setError("Please enter a valid Instagram profile link (e.g., https://instagram.com/username)");
        return;
      }
    }

    if (!driveEmail || driveEmail.length < 5) {
      setError("Please enter your Google Drive email");
      return;
    }

    if (!emailRegex.test(driveEmail)) {
      setError("Please enter a valid Google Drive email (example: name@gmail.com)");
      return;
    }

    if (!niche || niche.length < 2) {
      setError("Please enter your channel niche");
      return;
    }

    if (!audience || audience.length < 2) {
      setError("Please enter your target audience");
      return;
    }

    if (!language) {
      setError("Please select your language preference");
      return;
    }

    if (!contentStyle) {
      setError("Please select your content style");
      return;
    }

    // Move to payment step
    setStep(2);
  };

  const validateUtr = (utr: string) => {
    const trimmed = utr.trim();
    if (!trimmed) {
      setIsUtrValid(false);
      return false;
    }
    // Transaction ID Validation (Paytm/UPI format):
    // - Must start with 'T' (uppercase)
    // - Followed by exactly 21-22 digits
    // - Total length: 22-23 characters
    const utrRegex = /^T\d{21,22}$/;
    const valid = utrRegex.test(trimmed);
    setIsUtrValid(valid);
    return valid;
  };

  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTransactionId(value);
    validateUtr(value);
    setError(""); // Clear error on input change
    setNetworkError(false);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Screenshot must be less than 5MB");
      return;
    }

    setPaymentScreenshot(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview("");
    setError("");
    setShowRemoveConfirm(false);
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = "";
    }
  };

  const handlePaymentSubmit = async () => {
    setError("");
    setNetworkError(false);
    setLoading(true);

    if (!transactionId.trim()) {
      setError("Transaction ID enter karein");
      setLoading(false);
      return;
    }

    if (!isUtrValid) {
      setError("Invalid Transaction ID! Should start with 'T' followed by 21-22 digits");
      setLoading(false);
      return;
    }

    if (!paymentScreenshot) {
      setError("❌ Payment screenshot/receipt required - Upload screenshot from your payment app");
      setLoading(false);
      return;
    }

    try {
      // Convert screenshot to base64
      const screenshotBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(paymentScreenshot);
      });

      // 🔐 STEP 1: VERIFY TRANSACTION WITH BACKEND (CRITICAL SECURITY CHECK)
      const verifyResponse = await fetch("/api/verify-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          amount: plan.price,
          email: formData.email,
          screenshotBase64,
          // Pass all customer + channel details so HR email is complete
          customerName: formData.name.trim(),
          customerPhone: formData.phone.trim(),
          planName: plan.name,
          planScripts: plan.scripts,
          channelLink: formData.channelLink.trim(),
          instagramLink: formData.instagramLink.trim(),
          driveEmail: formData.driveEmail.trim(),
          niche: formData.niche.trim(),
          audience: formData.audience.trim(),
          language: formData.language.trim(),
          contentStyle: formData.contentStyle.trim(),
          references: formData.references.trim(),
        }),
      });

      const verifyData = await verifyResponse.json().catch(() => ({ success: false, error: "Server response error" }));

      if (!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Transaction verification failed. Please check your transaction ID and try again.");
      }

      // 🔐 STEP 2: Send comprehensive HTML email to admin
      const txId = transactionId.trim();
      const orderDate = new Date().toLocaleString('en-IN');

      const adminEmailHTML = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Order — Bolzaa</title>
  <style>
    @media only screen and (max-width:600px){
      .em-wrap{width:100%!important;border-radius:0!important;}
      .em-pad{padding:20px 14px!important;}
      .em-h1{font-size:21px!important;}
      .em-stats td{display:block!important;width:100%!important;box-sizing:border-box!important;border-right:none!important;border-bottom:1px solid #e5e7eb!important;}
      .em-tbl{display:block!important;width:100%!important;}
      .em-tbl tr{display:block!important;width:100%!important;border-bottom:1px solid #e8edf2!important;}
      .em-tbl tr:last-child{border-bottom:none!important;}
      .em-lbl{display:block!important;width:100%!important;box-sizing:border-box!important;border-right:none!important;border-bottom:none!important;padding:10px 14px 3px!important;font-size:10px!important;}
      .em-val{display:block!important;width:100%!important;box-sizing:border-box!important;padding:3px 14px 12px!important;font-size:13px!important;}
      .em-img{max-height:300px!important;width:100%!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;font-size:0;color:#F1F5F9;">New order from ${formData.name} — ${plan.name} ₹${plan.price} — TxID: ${txId}</div>

<!-- WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F1F5F9" style="background:#F1F5F9;">
<tr><td align="center" style="padding:32px 12px;">

<table class="em-wrap" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- TOP ACCENT -->
  <tr><td height="5" style="background:linear-gradient(90deg,#7c3aed,#4f46e5,#0ea5e9);font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- ALERT -->
  <tr><td style="background:#dc2626;padding:12px 24px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">⚠ Verify Payment Before Sending Scripts ⚠</p>
  </td></tr>

  <!-- HEADER -->
  <tr><td style="background:#1e1b4b;padding:40px 40px 36px;text-align:center;">
    <p style="margin:0 0 6px;color:#818cf8;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Bolzaa Studio</p>
    <h1 class="em-h1" style="margin:0 0 10px;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">New Order Received</h1>
    <p style="margin:0 0 22px;color:#a5b4fc;font-size:13px;line-height:1.5;">${orderDate}</p>
    <table cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:9px 22px;">
          <span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:0.3px;">${plan.name} &nbsp;·&nbsp; ₹${plan.price.toLocaleString()}</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- STATS -->
  <tr><td style="background:#fff;padding:0;border-bottom:1px solid #e2e8f0;">
    <table class="em-stats" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" style="padding:22px 16px;text-align:center;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 5px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Amount</p>
          <p style="margin:0;color:#10b981;font-size:24px;font-weight:800;">₹${plan.price.toLocaleString()}</p>
        </td>
        <td width="34%" style="padding:22px 16px;text-align:center;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 5px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Status</p>
          <p style="margin:0;display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;padding:3px 10px;border-radius:100px;">⏳ Pending</p>
        </td>
        <td width="33%" style="padding:22px 16px;text-align:center;">
          <p style="margin:0 0 5px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Plan</p>
          <p style="margin:0;color:#4f46e5;font-size:13px;font-weight:700;">${plan.name}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- BODY -->
  <tr><td class="em-pad" style="background:#fff;padding:32px 40px;">

    <!-- TXN ID CARD -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td style="background:#0f172a;border-radius:12px;padding:20px 24px;text-align:center;">
        <p style="margin:0 0 8px;color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Transaction ID</p>
        <p style="margin:0;color:#f1f5f9;font-size:17px;font-weight:800;font-family:'Courier New',monospace;letter-spacing:1.5px;word-break:break-all;">${txId}</p>
        <p style="margin:8px 0 0;display:inline-block;background:#dc2626;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:100px;letter-spacing:0.5px;">VERIFY IN PAYMENT APP</p>
      </td></tr>
    </table>

    <!-- PAYMENT SECTION -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#4f46e5;border-radius:4px;width:4px;">&nbsp;&nbsp;</td>
          <td style="padding-left:10px;"><p style="margin:0;color:#1e1b4b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">💳 Payment Details</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <table class="em-tbl" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;width:36%;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Plan</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;font-weight:600;">${plan.name}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Includes</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${plan.scripts}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Amount Paid</td><td class="em-val" style="padding:11px 16px;font-size:18px;color:#10b981;font-weight:800;">₹${plan.price.toLocaleString()}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Date &amp; Time</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${orderDate}</td></tr>
        </table>
      </td></tr>
    </table>

    <!-- CUSTOMER SECTION -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#0ea5e9;border-radius:4px;width:4px;">&nbsp;&nbsp;</td>
          <td style="padding-left:10px;"><p style="margin:0;color:#1e1b4b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">👤 Customer Details</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <table class="em-tbl" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;width:36%;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Full Name</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;font-weight:700;">${formData.name}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Email</td><td class="em-val" style="padding:11px 16px;font-size:13px;"><a href="mailto:${formData.email}" style="color:#4f46e5;text-decoration:none;font-weight:600;">${formData.email}</a></td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Phone</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;font-weight:600;">${formData.phone}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">YouTube</td><td class="em-val" style="padding:11px 16px;font-size:13px;word-break:break-all;"><a href="${formData.channelLink}" style="color:#4f46e5;text-decoration:none;">${formData.channelLink}</a></td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Instagram</td><td class="em-val" style="padding:11px 16px;font-size:13px;word-break:break-all;">${formData.instagramLink ? `<a href="${formData.instagramLink}" style="color:#4f46e5;text-decoration:none;">${formData.instagramLink}</a>` : '<span style="color:#94a3b8;">—</span>'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#ecfdf5;border-right:1px solid #d1fae5;font-size:12px;font-weight:600;color:#065f46;text-transform:uppercase;letter-spacing:0.5px;">Drive Email</td><td class="em-val" style="padding:11px 16px;background:#ecfdf5;font-size:14px;color:#047857;font-weight:800;font-family:'Courier New',monospace;">${formData.driveEmail}</td></tr>
        </table>
      </td></tr>
    </table>

    <!-- CHANNEL SECTION -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#8b5cf6;border-radius:4px;width:4px;">&nbsp;&nbsp;</td>
          <td style="padding-left:10px;"><p style="margin:0;color:#1e1b4b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">🎬 Channel Details</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <table class="em-tbl" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;width:36%;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Niche</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;">${formData.niche}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Audience</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${formData.audience}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Language</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;text-transform:capitalize;">${formData.language}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Content Style</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;text-transform:capitalize;">${formData.contentStyle}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">References</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${formData.references || '<span style="color:#94a3b8;">None</span>'}</td></tr>
        </table>
      </td></tr>
    </table>

    <!-- SCREENSHOT -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#f59e0b;border-radius:4px;width:4px;">&nbsp;&nbsp;</td>
          <td style="padding-left:10px;"><p style="margin:0;color:#1e1b4b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">📸 Payment Screenshot</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center;">
        <img class="em-img" src="cid:payment_screenshot" alt="Payment Screenshot" style="max-width:100%;max-height:500px;border-radius:8px;display:block;margin:0 auto;box-shadow:0 2px 16px rgba(0,0,0,0.12);">
        <p style="margin:10px 0 0;color:#94a3b8;font-size:11px;">Also attached to this email as a file</p>
      </td></tr>
    </table>

    <!-- CHECKLIST -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      <tr><td style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:20px 22px;">
        <p style="margin:0 0 14px;color:#78350f;font-size:13px;font-weight:800;">✅ Checklist — Verify Before Sending Scripts</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="padding:5px 0;color:#92400e;font-size:13px;line-height:1.5;"><span style="color:#d97706;margin-right:8px;">☐</span>TxID visible in screenshot: <strong style="font-family:'Courier New',monospace;color:#1e293b;">${txId}</strong></td></tr>
          <tr><td style="padding:5px 0;color:#92400e;font-size:13px;line-height:1.5;"><span style="color:#d97706;margin-right:8px;">☐</span>Amount matches exactly <strong>₹${plan.price}</strong></td></tr>
          <tr><td style="padding:5px 0;color:#92400e;font-size:13px;line-height:1.5;"><span style="color:#d97706;margin-right:8px;">☐</span>Status shows SUCCESS or COMPLETED</td></tr>
          <tr><td style="padding:5px 0;color:#92400e;font-size:13px;line-height:1.5;"><span style="color:#d97706;margin-right:8px;">☐</span>Cross-check TxID in Paytm / PhonePe / GPay</td></tr>
          <tr><td style="padding:5px 0;color:#92400e;font-size:13px;line-height:1.5;"><span style="color:#d97706;margin-right:8px;">☐</span>Screenshot not edited or faked</td></tr>
        </table>
      </td></tr>
    </table>

    <!-- ACTION BOX -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background:#052e16;border-radius:12px;padding:22px 24px;">
        <p style="margin:0 0 6px;color:#86efac;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Action Required</p>
        <p style="margin:0 0 14px;color:#d1fae5;font-size:15px;font-weight:800;">📤 Share scripts via Google Drive to:</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#064e3b;border:1px solid #059669;border-radius:8px;padding:12px 16px;">
            <p style="margin:0;color:#6ee7b7;font-size:16px;font-weight:800;font-family:'Courier New',monospace;word-break:break-all;">${formData.driveEmail}</p>
          </td>
        </tr></table>
        <p style="margin:10px 0 0;color:#6ee7b7;font-size:12px;">Deadline: within 24 hours of verification</p>
      </td></tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0f172a;padding:22px 40px;text-align:center;">
    <p style="margin:0 0 4px;color:#818cf8;font-size:13px;font-weight:700;letter-spacing:0.5px;">Bolzaa Studio</p>
    <p style="margin:0;color:#334155;font-size:11px;">Automated order notification · Do not forward to customers</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

      const adminEmailText = `NEW ORDER\n\nPlan: ${plan.name}\nTransaction ID: ${txId}\nAmount: Rs.${plan.price}\nDate: ${orderDate}\n\nUSER:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nYouTube: ${formData.channelLink}\nInstagram: ${formData.instagramLink || 'N/A'}\nDrive Email: ${formData.driveEmail}\n\nCHANNEL:\nNiche: ${formData.niche}\nAudience: ${formData.audience}\nLanguage: ${formData.language}\nStyle: ${formData.contentStyle}\nReferences: ${formData.references || 'None'}\n\nVerify payment before sending scripts.`;

      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: import.meta.env.VITE_ADMIN_EMAIL || "bolzaa277@gmail.com",
          subject: `[Bolzaa] New Order - ${plan.name} | ${formData.name} | TxID: ${txId}`,
          text: adminEmailText,
          html: adminEmailHTML,
          screenshotBase64,
        }),
      }).catch((err: unknown) => {
        console.error("Email failed:", err);
      });

      // ✅ Only show success page after backend verification
      setStep(3);
      setLoading(false);
    } catch (err: Error | unknown) {
      console.error("❌ Payment submission error:", err);
      const isNetworkErr =
        err instanceof TypeError ||
        (err instanceof Error &&
          (err.message.toLowerCase().includes("fetch") ||
            err.message.toLowerCase().includes("network") ||
            err.message.toLowerCase().includes("failed to fetch") ||
            err.message.toLowerCase().includes("load failed")));
      if (isNetworkErr) {
        setNetworkError(true);
        setError("");
      } else {
        setNetworkError(false);
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        setError(`⚠️ ${errorMsg}`);
      }
      setLoading(false);
    }
  };

  // STEP 1: FULL FORM
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <FloatingWhatsApp />

        <section className="pt-28 pb-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 text-center max-w-2xl mx-auto"
            >
              <h1 className="text-4xl font-bold text-foreground">Let's Get Started!</h1>
              <p className="mt-2 text-muted-foreground">
                Fill your details and we'll set up your {plan.name}
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleFormSubmit}
              className="mx-auto max-w-3xl space-y-8 rounded-xl border border-border bg-card p-8 shadow-card"
            >
              {/* PERSONAL INFO SECTION */}
              <div>
                <h2 className="mb-6 text-xl font-semibold text-foreground">📋 Personal Information</h2>
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
                    <Label htmlFor="email">Email Address *</Label>
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

                <div className="mt-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      minLength={10}
                      maxLength={15}
                      className="bg-secondary border-border"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* CHANNEL INFO SECTION */}
              <div className="border-t border-border pt-8">
                <h2 className="mb-6 text-xl font-semibold text-foreground">🎬 Channel Information</h2>
                <div className="space-y-5">
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
                    <Label htmlFor="driveEmail">Google Drive Email *</Label>
                    <Input
                      id="driveEmail"
                      type="email"
                      required
                      placeholder="Email where we'll share scripts"
                      className="bg-secondary border-border"
                      value={formData.driveEmail}
                      onChange={(e) => setFormData({ ...formData, driveEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* CONTENT PREFERENCES SECTION */}
              <div className="border-t border-border pt-8">
                <h2 className="mb-6 text-xl font-semibold text-foreground">🎯 Content Preferences</h2>
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

                <div className="grid gap-5 sm:grid-cols-2 mt-5">
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

                <div className="space-y-2 mt-5">
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
              </div>

              {/* ORDER SUMMARY */}
              <div className="border-t border-border pt-8 bg-secondary/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">You selected:</p>
                    <p className="text-xl font-semibold text-foreground">{plan.name}</p>
                    <p className="text-sm text-secondary-foreground mt-1">{plan.scripts}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gradient">₹{plan.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
              </div>

              {networkError && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/60 to-red-950/60 backdrop-blur-sm overflow-hidden"
                >
                  <div className="flex items-center gap-3 bg-orange-500/20 border-b border-orange-500/20 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20 border border-orange-500/40">
                      <WifiOff className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-300">Network Issue Detected</p>
                      <p className="text-xs text-orange-400/70">Server se connection fail hua</p>
                    </div>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    <p className="text-sm text-orange-200/90 leading-relaxed">
                      Aapka form submit hua but server tak reach nahi kar paya. Yeh usually internet ya backend issue hota hai.
                    </p>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                      <p className="text-xs font-bold text-white/60 uppercase tracking-wide flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> Yeh try karein:</p>
                      <ul className="space-y-1.5">
                        {["Internet connection check karein (WiFi / Mobile data)","Page reload karein aur dobara submit karein","Backend server chal raha hai ensure karein (port 3001)","Thodi der baad retry karein"].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500/30 text-orange-300 font-bold" style={{fontSize:'10px'}}>{i+1}</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setNetworkError(false); setError(""); }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm font-semibold py-2.5 transition-all"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </button>
                  </div>
                </motion.div>
              )}

              {error && !networkError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow btn-glow py-6 text-base"
              >
                <Phone className="mr-2 h-4 w-4" />
                Continue to Payment
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your information is secure and encrypted
              </p>
            </motion.form>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // STEP 2: PAYMENT
  if (step === 2) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <FloatingWhatsApp />

        <section className="pt-28 pb-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 text-center max-w-2xl mx-auto"
            >
              <h1 className="text-4xl font-bold text-foreground">Complete Payment</h1>
              <p className="mt-2 text-muted-foreground">
                Final step: Pay ₹{plan.price.toLocaleString()} via UPI
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-2xl space-y-8"
            >
              {/* ORDER CONFIRMATION */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan Selected:</p>
                    <p className="text-2xl font-bold text-foreground">{plan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gradient">₹{plan.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
                <p className="text-sm text-secondary-foreground">{plan.scripts}</p>
              </div>

              {/* PAYMENT INSTRUCTIONS */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground">📱 Payment Instructions</h2>

                {/* QR CODE BOX */}
                <div className="bg-secondary/20 rounded-lg p-5 space-y-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Step 1:</strong> Scan this QR code with any UPI app
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    {plan.price === 199 ? (
                      <div className="border-2 border-border rounded-lg p-2 bg-background">
                        <img 
                          src="/1.png"
                          alt="UPI Payment QR Code" 
                          loading="lazy"
                        />
                      </div>
                    ) : plan.price === 499 ? (
                      <div className="border-2 border-border rounded-lg p-2 bg-background">
                        <img 
                          src="/2.png"
                          alt="UPI Payment QR Code" 
                          loading="lazy"
                        />
                      </div>
                    ) : plan.price === 999 ? (
                      <div className="border-2 border-border rounded-lg p-2 bg-background">
                        <img 
                          src="/3.png"
                          alt="UPI Payment QR Code" 
                          loading="lazy"
                        />
                      </div>
                    ) : plan.price === 1499 ? (
                      <div className="border-2 border-border rounded-lg p-2 bg-background">
                        <img 
                          src="/4.png"
                          alt="UPI Payment QR Code" 
                          loading="lazy"
                        />
                      </div>
                    ) : upiId ? (
                      <div className="border-2 border-border rounded-lg p-2 bg-background">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(upiId)}`}
                          alt="UPI Payment QR Code" 
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-80 h-80 border-2 border-border rounded-lg p-2 bg-background flex items-center justify-center text-xs text-muted-foreground text-center">
                        Loading QR Code...
                      </div>
                    )}
                    <p className="text-xs text-center text-muted-foreground">
                      Scan with GPay, PhonePe, Paytm, or any UPI app
                    </p>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Enter amount: <strong>₹{plan.price.toLocaleString()}</strong>
                  </p>
                </div>

                {/* TRANSACTION ID INPUT */}
                <div className="bg-secondary/20 rounded-lg p-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    <strong>Step 2:</strong> After payment, enter the transaction ID
                  </p>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter Transaction ID from your payment app"
                      className={`bg-secondary text-base transition-all ${
                        transactionId && !isUtrValid
                          ? "border-red-500 focus:ring-red-500"
                          : transactionId && isUtrValid
                          ? "border-green-500 focus:ring-green-500"
                          : "border-border"
                      }`}
                      value={transactionId}
                      onChange={handleUtrChange}
                    />
                    {transactionId && !isUtrValid && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        ❌ Invalid format - Must start with 'T' followed by 21-22 digits (e.g., T260303204852627391258)
                      </p>
                    )}
                    {transactionId && isUtrValid && (
                      <p className="text-xs text-green-400 flex items-center gap-1">
                        ✅ Valid Transaction ID - Click Continue to submit
                      </p>
                    )}
                    {!transactionId && (
                      <p className="text-xs text-muted-foreground">
                        Transaction ID starts with 'T' followed by numbers (found in payment app after UPI payment)
                      </p>
                    )}
                  </div>
                </div>

                {/* PAYMENT SCREENSHOT UPLOAD */}
                <div className="bg-secondary/20 rounded-lg p-5 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    <strong>Step 3:</strong> Upload payment screenshot for verification
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                      <div className="text-center">
                        {screenshotPreview ? (
                          <>
                            <img src={screenshotPreview} alt="Payment screenshot" className="max-h-32 mx-auto mb-2 rounded" />
                            <p className="text-xs text-green-400 font-semibold">✅ Screenshot selected</p>
                            <p className="text-xs text-muted-foreground">Click to change</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-foreground">📸 Upload Payment Screenshot</p>
                            <p className="text-xs text-muted-foreground mt-1">Click to upload screenshot of your payment receipt</p>
                            <p className="text-xs text-amber-400 mt-2">Required: Screenshot showing transaction ID & amount</p>
                          </>
                        )}
                      </div>
                      <input
                        ref={screenshotInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        required
                      />
                    </label>
                    {paymentScreenshot && (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-green-400 flex items-center gap-1 break-all">
                          ✅ Screenshot: {paymentScreenshot.name} ({(paymentScreenshot.size / 1024).toFixed(2)} KB)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowRemoveConfirm(true)}
                          className="h-8 w-fit border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                        >
                          Remove Screenshot
                        </Button>
                        {showRemoveConfirm && (
                          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 space-y-2">
                            <p className="text-xs text-red-200">Are you sure you want to remove this screenshot?</p>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={handleRemoveScreenshot}
                                className="h-8 bg-red-600 text-white hover:bg-red-700"
                              >
                                Yes, Remove
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setShowRemoveConfirm(false)}
                                className="h-8 border-border text-foreground hover:bg-secondary"
                              >
                                Keep It
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {!paymentScreenshot && (
                      <p className="text-xs text-amber-300 flex items-center gap-1">
                        ⚠️ Screenshot is required - HR will verify this before sending scripts
                      </p>
                    )}
                  </div>
                </div>

                {/* INFO BOX */}
                <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <Lock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-200">
                      <strong>Payment Process:</strong> Complete your payment, then our HR will verify the details and send you a confirmation message within 24 hours.
                    </p>
                  </div>
                </div>

                {networkError && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/60 to-red-950/60 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="flex items-center gap-3 bg-orange-500/20 border-b border-orange-500/20 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20 border border-orange-500/40">
                        <WifiOff className="h-4 w-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-orange-300">Network Issue Detected</p>
                        <p className="text-xs text-orange-400/70">Server se connection fail hua</p>
                      </div>
                    </div>
                    <div className="px-4 py-4 space-y-3">
                      <p className="text-sm text-orange-200/90 leading-relaxed">
                        Aapka form submit hua but server tak reach nahi kar paya. Yeh usually internet ya backend issue hota hai.
                      </p>
                      <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
                        <p className="text-xs font-bold text-white/60 uppercase tracking-wide flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> Yeh try karein:</p>
                        <ul className="space-y-1.5">
                          {["Internet connection check karein (WiFi / Mobile data)","Page reload karein aur dobara submit karein","Backend server chal raha hai ensure karein (port 3001)","Thodi der baad retry karein"].map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500/30 text-orange-300 font-bold" style={{fontSize:'10px'}}>{i+1}</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setNetworkError(false); setError(""); }}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm font-semibold py-2.5 transition-all"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                      </button>
                    </div>
                  </motion.div>
                )}

                {error && !networkError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handlePaymentSubmit}
                  disabled={loading || !isUtrValid || !transactionId || !paymentScreenshot}
                  size="lg"
                  className="w-full h-auto min-h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow btn-glow py-4 sm:py-6 px-3 sm:px-4 text-sm sm:text-base leading-snug whitespace-normal break-words text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⏳</span>
                      Verifying Payment...
                    </>
                  ) : !transactionId ? (
                    <>
                      <CreditCard className="mr-2 h-4 w-4 shrink-0" />
                      Enter Transaction ID to Continue
                    </>
                  ) : !isUtrValid ? (
                    <>
                      <CreditCard className="mr-2 h-4 w-4 shrink-0" />
                      Invalid Transaction ID
                    </>
                  ) : !paymentScreenshot ? (
                    <>
                      <CreditCard className="mr-2 h-4 w-4 shrink-0" />
                      Upload Payment Screenshot to Continue
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4 shrink-0" />
                      Submit for HR Verification
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-full"
                  disabled={loading}
                >
                  Back to Form
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // STEP 3: SUCCESS
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <FloatingWhatsApp />

      <section className="flex min-h-[85vh] items-center justify-center pt-20 pb-12 px-3 sm:px-4 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl w-full min-w-0"
        >
          {/* Success Icon with Animation */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 sm:mb-8 flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-primary/20 border-4 border-green-500/30 shadow-xl shadow-green-500/20"
          >
            <CheckCircle2 className="h-11 w-11 sm:h-16 sm:w-16 text-green-400 drop-shadow-glow" />
          </motion.div>

          {/* Main Heading - Professional */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2 leading-tight">
              Payment Confirmed ✓
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-1 break-words">
              Thank you for your purchase, <span className="text-primary font-semibold">{formData.name}</span>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground/70 break-all">
              Transaction ID: <span className="font-mono text-primary break-all">{transactionId}</span>
            </p>
          </motion.div>

          {/* Professional Verification Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/30 rounded-2xl p-4 sm:p-7 mb-8 min-w-0"
          >
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🔐</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-2">Payment Verification Status</h3>
                <p className="text-sm text-muted-foreground mb-4 break-words">Your transaction details and screenshot have been received. Our HR team will now verify if this payment is genuine and authentic.</p>
                
                <div className="space-y-3 mb-4">
                  {/* Amount */}
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20 min-w-0">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Amount Received</p>
                      <p className="text-xs text-muted-foreground">₹{plan.price.toLocaleString()} - Amount is correct</p>
                    </div>
                  </div>

                  {/* Transaction ID */}
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20 min-w-0">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Transaction ID Received</p>
                      <p className="text-xs text-muted-foreground font-mono break-all">{transactionId}</p>
                      <p className="text-xs text-amber-300 mt-1">📋 Will verify if genuine</p>
                    </div>
                  </div>

                  {/* Screenshot */}
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20 min-w-0">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Screenshot Received</p>
                      <p className="text-xs text-muted-foreground">Payment screenshot uploaded</p>
                      <p className="text-xs text-amber-300 mt-1">📸 Will verify authenticity</p>
                    </div>
                  </div>

                  {/* HR Verification */}
                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 min-w-0">
                    <span className="text-blue-400 text-lg animate-pulse">⏳</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">HR Verification in Progress</p>
                      <p className="text-xs text-muted-foreground">Checking if transaction is real & genuine (1-4 hours)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-300 mb-2">✓ After HR Verification:</p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 font-bold mt-0.5">→</span>
                        <span className="break-words">If <strong className="text-green-300">Verified as Genuine</strong>: Confirmation email with script access will be sent to <strong className="text-foreground break-all">{formData.email}</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 font-bold mt-0.5">→</span>
                        <span>If <strong className="text-red-300">Not Genuine</strong>: Email notification with reason will be sent</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary Card - Professional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden mb-6 min-w-0"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-primary/15 to-transparent px-6 py-4 border-b border-border/30">
              <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-secondary/20 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Plan</p>
                  <p className="text-lg font-bold text-foreground">{plan.name}</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Amount Paid</p>
                  <p className="text-lg font-bold text-green-400">₹{plan.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-t border-border/20 pt-4">
                <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-foreground bg-secondary/30 px-3 py-2 rounded-lg break-all">{transactionId}</p>
              </div>
              
              <div className="border-t border-border/20 pt-4">
                <p className="text-xs text-muted-foreground mb-1">Confirmation Email</p>
                <p className="text-sm text-primary font-medium break-all">{formData.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Professional Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-500/5 to-slate-600/5 border border-slate-400/20 rounded-2xl p-4 sm:p-6 mb-6"
          >
            <h4 className="text-lg font-semibold text-foreground mb-6">What Happens Next</h4>
            
            <div className="space-y-4">
              {/* Step 1 - Complete */}
              <div className="flex gap-3 sm:gap-4 min-w-0">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-400">✓</span>
                  </div>
                  <div className="w-0.5 h-12 bg-gradient-to-b from-green-500/50 to-blue-500/50 my-1"></div>
                </div>
                <div className="pt-1 pb-4 min-w-0">
                  <p className="font-semibold text-foreground">Payment Submitted</p>
                  <p className="text-sm text-muted-foreground">Your transaction has been received and logged</p>
                </div>
              </div>

              {/* Step 2 - In Progress */}
              <div className="flex gap-3 sm:gap-4 min-w-0">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <span className="text-blue-400 text-xl">⏱</span>
                  </div>
                  <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500/50 to-slate-400/30 my-1"></div>
                </div>
                <div className="pt-1 pb-4 min-w-0">
                  <p className="font-semibold text-foreground">Verification in Progress</p>
                  <p className="text-sm text-muted-foreground">Our team is reviewing your payment details (1-4 hours)</p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex gap-3 sm:gap-4 min-w-0">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-400/20 border-2 border-slate-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-400">📦</span>
                  </div>
                </div>
                <div className="pt-1 min-w-0">
                  <p className="font-semibold text-foreground">Scripts Delivered</p>
                  <p className="text-sm text-muted-foreground">Confirmation email with scripts sent to your email</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-500/5 border border-slate-400/20 rounded-xl p-4 sm:p-5 mb-6 text-center min-w-0"
          >
            <p className="text-sm text-foreground flex items-center justify-center gap-2 flex-wrap">
              <span className="text-lg">📧</span>
              <span>A verification email has been sent to</span>
              <span className="font-mono text-primary font-semibold break-all">{formData.email}</span>
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-xl"
            >
              Back to Home
            </Button>
          </motion.div>

          {/* Support Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center space-y-2"
          >
            <p className="text-sm text-muted-foreground">
              Questions? Our support team is available to help
            </p>
            <p className="text-xs text-muted-foreground/60 break-words">
              Email: <a href="mailto:bolzaa277@gmail.com" className="text-primary hover:underline">bolzaa277@gmail.com</a> | Instagram: <a href="https://instagram.com/bolzaa277" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@bolzaa277</a>
            </p>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
