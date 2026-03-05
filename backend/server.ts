import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { SendMailOptions } from 'nodemailer';
import { config } from 'dotenv';

// Load env files for both execution contexts:
// 1) service root at /backend (Render in this repo)
// 2) monorepo root with /backend/.env.local
config({ path: '.env.local' });
config({ path: 'backend/.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// ========================================
// 🔒 SECURITY MIDDLEWARE
// ========================================

// 1. Helmet - Secure HTTP headers (prevents XSS, clickjacking, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// 2. Rate limiting for payment verification (prevent brute force)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 payment attempts per 15 minutes per IP
  message: { 
    success: false, 
    error: 'Too many payment verification attempts. Please try again later.',
    verified: false 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Rate limiting for email sending (prevent spam)
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 emails per hour per IP
  message: { 
    success: false, 
    error: 'Too many email requests. Please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ========================================
// 📦 STANDARD MIDDLEWARE
// ========================================

// 4. Compression (reduces response size)
app.use(compression({ level: 6, threshold: 1024 }));

// 5. JSON parsing with size limits (increased for base64 screenshots)
app.use(express.json({ limit: '10mb' }));

// 6. CORS with flexible whitelist protection
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean) || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (isDev) return callback(null, true);

    if (allowedOrigins.includes('*')) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    if (origin.endsWith('.vercel.app')) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  maxAge: 86400, // Cache preflight for 24 hours
}));

// Email transporter with connection pooling + timeout handling
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS?.trim(), // Remove any spaces from password
  },
  pool: {
    maxConnections: 3,
    maxMessages: 50,
    rateDelta: 4000,
    rateLimit: 14,
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 15000, // 15 seconds
  logger: isDev,
  debug: isDev,
} as SMTPTransport.Options);

// In-memory transaction store (would be database in production)
const verifiedTransactions: {
  [key: string]: {
    transactionId: string;
    amount: number;
    email: string;
    timestamp: number;
    verified: boolean;
    verificationToken: string;
    screenshotBase64?: string;
  };
} = {};

// ========================================
// 🛡️ SECURITY HELPERS
// ========================================

// Sanitize input to prevent XSS attacks
const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .substring(0, 2000); // Max length protection
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate transaction ID format (Paytm format)
const isValidTransactionId = (txId: string): boolean => {
  if (!txId || typeof txId !== 'string') return false;
  return /^T\d{21,22}$/.test(txId.trim());
};

// ========================================
// 📧 EMAIL TEMPLATE GENERATORS
// ========================================

// Generate secure verification token
const generateVerificationToken = (transactionId: string) => {
  return `VRF_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Pre-compiled email template to avoid regenerating on each request
const generateContactEmailHTML = (name: string, email: string, instagram: string, channelLink: string, niche: string, message: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">New Contact Form Submission</h2>
  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
    <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
    <p style="margin: 10px 0;"><strong>Instagram:</strong> ${instagram}</p>
    <p style="margin: 10px 0;"><strong>YouTube Channel:</strong> <a href="${channelLink}" style="color:#8b5cf6;">${channelLink}</a></p>
    <p style="margin: 10px 0;"><strong>Niche:</strong> ${niche}</p>
  </div>
  <div style="margin: 20px 0;">
    <h3 style="color: #555;">Message:</h3>
    <p style="background-color: #fff; padding: 15px; border-left: 4px solid #8b5cf6; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
    <p>This email was sent from your website's contact form.</p>
  </div>
</div>
`;

// Helper function to send email asynchronously with timeout protection.
// It logs failures but does not throw, so API routes can still respond gracefully.
const sendEmailAsync = async (mailOptions: SendMailOptions): Promise<{ ok: boolean; info?: SMTPTransport.SentMessageInfo; error?: string }> => {
  try {
    // Add timeout wrapper - fail after 15 seconds
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout - exceeded 15 seconds')), 15000)
    );
    
    const info = await Promise.race([emailPromise, timeoutPromise]) as SMTPTransport.SentMessageInfo;
    console.log(`✅ Email SENT successfully to: ${mailOptions.to} | MessageID: ${info.messageId}`);
    return { ok: true, info };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Email FAILED to: ${mailOptions.to} | Error: ${errorMsg}`);
    console.error(`📧 Transporter config - Host: smtp.gmail.com | Port: 587 | User: ${process.env.ADMIN_EMAIL}`);
    console.error(`⚠️ Password spaces removed during auth: ${process.env.EMAIL_PASS ? 'YES' : 'NO'}`);
    return { ok: false, error: errorMsg };
  }
};


// ========================================
// 🔒 PAYMENT VERIFICATION ENDPOINT (RATE LIMITED)
// ========================================
app.post('/api/verify-transaction', paymentLimiter, (req: Request, res: Response) => {
  try {
    const { transactionId, amount, email, screenshotBase64,
      customerName, customerPhone, planName, planScripts,
      channelLink, instagramLink, driveEmail,
      niche, audience, language, contentStyle, references
    } = req.body;

    // 🔒 SECURITY: Sanitize all text inputs
    const sanitizedTxId = sanitizeInput(transactionId);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedDriveEmail = sanitizeInput(driveEmail);
    const sanitizedName = sanitizeInput(customerName);
    const sanitizedPhone = sanitizeInput(customerPhone);

    console.log(`🔍 VERIFY REQUEST: TxID=${sanitizedTxId}, Amount=₹${amount}, Email=${sanitizedEmail}`);
    console.log(`📸 Screenshot received: ${screenshotBase64 ? 'YES' : 'NO'}`);

    // Validation - Required fields
    if (!sanitizedTxId || !amount || !sanitizedEmail) {
      console.log(`❌ REJECT: Missing fields`);
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        verified: false 
      });
    }

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      console.log(`❌ REJECT: Invalid email format`);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address format',
        verified: false 
      });
    }

    // Validate screenshot
    if (!screenshotBase64) {
      console.log(`❌ REJECT: Screenshot missing`);
      return res.status(400).json({ 
        success: false, 
        error: 'Payment screenshot is required',
        verified: false 
      });
    }

    // Validate transaction ID using helper function
    if (!isValidTransactionId(sanitizedTxId)) {
      console.log(`❌ REJECT: Invalid transaction ID format`);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid transaction ID format. Must be in format: T followed by 21-22 digits',
        verified: false 
      });
    }

    // SECURITY: Verify amount is from valid plan prices only
    const validAmounts = [199, 299, 499, 599, 799, 999, 1499, 1999, 2999];
    const parsedAmount = parseInt(amount);
    if (!validAmounts.includes(parsedAmount)) {
      console.log(`❌ REJECT: Invalid amount ₹${parsedAmount} (valid: ${validAmounts.join(', ')})`);
      return res.status(400).json({ 
        success: false, 
        error: `Invalid payment amount ₹${parsedAmount}. Valid amounts: ₹${validAmounts.join(', ')}`,
        verified: false 
      });
    }

    // SECURITY: Check if transaction already used (prevent double-spending)
    if (verifiedTransactions[sanitizedTxId]) {
      const existing = verifiedTransactions[sanitizedTxId];
      if (existing.verified && existing.timestamp > Date.now() - 3600000) { // Within 1 hour
        console.log(`❌ REJECT: Transaction already used`);
        return res.status(400).json({ 
          success: false, 
          error: 'This transaction ID has already been used. Cannot reuse.',
          verified: false 
        });
      }
    }

    // Generate verification token
    const verificationToken = generateVerificationToken(sanitizedTxId);
    
    // Store transaction with sanitized data
    verifiedTransactions[sanitizedTxId] = {
      transactionId: sanitizedTxId,
      amount: parsedAmount,
      email: sanitizedEmail,
      timestamp: Date.now(),
      verified: false,
      verificationToken,
      screenshotBase64, // Store screenshot for manual review
    };

    console.log(`✅ ACCEPT: Transaction submitted for manual verification`);
    console.log(`⚠️  HR ALERT: Verify this transaction ID in Paytm: ${sanitizedTxId}`);

    // Build screenshot CID attachment
    const screenshotAttachments: { filename: string; content: string; encoding: string; cid: string }[] = [];
    if (screenshotBase64 && typeof screenshotBase64 === 'string') {
      const base64Data = screenshotBase64.includes(',') ? screenshotBase64.split(',')[1] : screenshotBase64;
      const mimeMatch = screenshotBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const ext = mimeType.split('/')[1]?.replace('jpeg','jpg') || 'jpg';
      screenshotAttachments.push({ filename: `payment_screenshot.${ext}`, content: base64Data, encoding: 'base64', cid: 'payment_screenshot' });
    }

    const orderDate = new Date().toLocaleString('en-IN');

    // 📧 Professional Admin email
    const hrEmailContent = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<style>
@media only screen and (max-width:600px){
  .em-wrap{width:100%!important;border-radius:0!important;}
  .em-pad{padding:20px 14px!important;}
  .em-h1{font-size:21px!important;}
  .em-stats td{display:block!important;width:100%!important;box-sizing:border-box!important;border-right:none!important;border-bottom:1px solid #e2e8f0!important;}
  .em-tbl{display:block!important;width:100%!important;}
  .em-tbl tr{display:block!important;width:100%!important;border-bottom:1px solid #e8edf2!important;}
  .em-tbl tr:last-child{border-bottom:none!important;}
  .em-lbl{display:block!important;width:100%!important;box-sizing:border-box!important;border-right:none!important;border-bottom:none!important;padding:10px 14px 3px!important;font-size:10px!important;}
  .em-val{display:block!important;width:100%!important;box-sizing:border-box!important;padding:3px 14px 12px!important;font-size:13px!important;}
}
</style>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;font-size:0;color:#F1F5F9;">Payment verify required — TxID: ${transactionId} — ₹${parsedAmount} — ${customerName || email}</div>

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
    <h1 class="em-h1" style="margin:0 0 10px;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">New Order Received</h1>
    <p style="margin:0 0 22px;color:#a5b4fc;font-size:13px;">${orderDate}</p>
    <table cellpadding="0" cellspacing="0" border="0" align="center"><tr>
      <td style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:9px 22px;">
        <span style="color:#fff;font-size:13px;font-weight:700;">${planName || 'Plan'} &nbsp;·&nbsp; ₹${parsedAmount}</span>
      </td>
    </tr></table>
  </td></tr>

  <!-- STATS -->
  <tr><td style="background:#fff;padding:0;border-bottom:1px solid #e2e8f0;">
    <table class="em-stats" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" style="padding:22px 16px;text-align:center;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 5px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Amount</p>
          <p style="margin:0;color:#10b981;font-size:24px;font-weight:800;">₹${parsedAmount}</p>
        </td>
        <td width="34%" style="padding:22px 16px;text-align:center;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 5px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Status</p>
          <p style="margin:0;display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;padding:3px 10px;border-radius:100px;">⏳ Pending</p>
        </td>
        <td width="33%" style="padding:22px 16px;text-align:center;">
          <p style="margin:0 0 5px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Plan</p>
          <p style="margin:0;color:#4f46e5;font-size:13px;font-weight:700;">${planName || 'Unknown'}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- BODY -->
  <tr><td class="em-pad" style="background:#fff;padding:32px 40px;">

    <!-- TXN ID -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td style="background:#0f172a;border-radius:12px;padding:20px 24px;text-align:center;">
        <p style="margin:0 0 8px;color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Transaction ID</p>
        <p style="margin:0;color:#f1f5f9;font-size:17px;font-weight:800;font-family:'Courier New',monospace;letter-spacing:1.5px;word-break:break-all;">${transactionId}</p>
        <p style="margin:8px 0 0;display:inline-block;background:#dc2626;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:100px;letter-spacing:0.5px;">VERIFY IN PAYMENT APP</p>
      </td></tr>
    </table>

    <!-- PAYMENT -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#4f46e5;border-radius:4px;width:4px;">&nbsp;&nbsp;</td>
          <td style="padding-left:10px;"><p style="margin:0;color:#1e1b4b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">💳 Payment Details</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <table class="em-tbl" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;width:36%;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Plan</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;font-weight:600;">${planName || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Includes</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${planScripts || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Amount Paid</td><td class="em-val" style="padding:11px 16px;font-size:18px;color:#10b981;font-weight:800;">₹${parsedAmount}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Date &amp; Time</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${orderDate}</td></tr>
        </table>
      </td></tr>
    </table>

    <!-- CUSTOMER -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#0ea5e9;border-radius:4px;width:4px;">&nbsp;&nbsp;</td>
          <td style="padding-left:10px;"><p style="margin:0;color:#1e1b4b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">👤 Customer Details</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <table class="em-tbl" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;width:36%;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Full Name</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;font-weight:700;">${customerName || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Email</td><td class="em-val" style="padding:11px 16px;font-size:13px;"><a href="mailto:${email}" style="color:#4f46e5;text-decoration:none;font-weight:600;">${email}</a></td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Phone</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;font-weight:600;">${customerPhone || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">YouTube</td><td class="em-val" style="padding:11px 16px;font-size:13px;word-break:break-all;">${channelLink ? `<a href="${channelLink}" style="color:#4f46e5;text-decoration:none;">${channelLink}</a>` : '<span style="color:#94a3b8;">—</span>'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Instagram</td><td class="em-val" style="padding:11px 16px;font-size:13px;word-break:break-all;">${instagramLink ? `<a href="${instagramLink}" style="color:#4f46e5;text-decoration:none;">${instagramLink}</a>` : '<span style="color:#94a3b8;">—</span>'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#ecfdf5;border-right:1px solid #d1fae5;font-size:12px;font-weight:600;color:#065f46;text-transform:uppercase;letter-spacing:0.5px;">Drive Email</td><td class="em-val" style="padding:11px 16px;background:#ecfdf5;font-size:14px;color:#047857;font-weight:800;font-family:'Courier New',monospace;">${driveEmail || '—'}</td></tr>
        </table>
      </td></tr>
    </table>

    <!-- CHANNEL -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding-bottom:12px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#8b5cf6;border-radius:4px;width:4px;">&nbsp;&nbsp;</td>
          <td style="padding-left:10px;"><p style="margin:0;color:#1e1b4b;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;">🎬 Channel Details</p></td>
        </tr></table>
      </td></tr>
      <tr><td style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
        <table class="em-tbl" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;width:36%;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Niche</td><td class="em-val" style="padding:11px 16px;font-size:14px;color:#1e293b;">${niche || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Audience</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${audience || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Language</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;text-transform:capitalize;">${language || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Content Style</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;text-transform:capitalize;">${contentStyle || '—'}</td></tr>
          <tr style="border-top:1px solid #f1f5f9;"><td class="em-lbl" style="padding:11px 16px;background:#f8fafc;border-right:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">References</td><td class="em-val" style="padding:11px 16px;font-size:13px;color:#475569;">${references || '<span style="color:#94a3b8;">None</span>'}</td></tr>
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
        <img src="cid:payment_screenshot" alt="Payment Screenshot" style="max-width:100%;max-height:500px;border-radius:8px;display:block;margin:0 auto;box-shadow:0 2px 16px rgba(0,0,0,0.12);">
        <p style="margin:10px 0 0;color:#94a3b8;font-size:11px;">Also attached as a file in this email</p>
      </td></tr>
    </table>

    <!-- CHECKLIST -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      <tr><td style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:20px 22px;">
        <p style="margin:0 0 14px;color:#78350f;font-size:13px;font-weight:800;">✅ Checklist — Verify Before Sending Scripts</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="padding:5px 0;color:#92400e;font-size:13px;line-height:1.5;"><span style="color:#d97706;margin-right:8px;">☐</span>TxID visible in screenshot: <strong style="font-family:'Courier New',monospace;color:#1e293b;">${transactionId}</strong></td></tr>
          <tr><td style="padding:5px 0;color:#92400e;font-size:13px;line-height:1.5;"><span style="color:#d97706;margin-right:8px;">☐</span>Amount matches exactly <strong>₹${parsedAmount}</strong></td></tr>
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
            <p style="margin:0;color:#6ee7b7;font-size:16px;font-weight:800;font-family:'Courier New',monospace;word-break:break-all;">${driveEmail || email}</p>
          </td>
        </tr></table>
        <p style="margin:10px 0 0;color:#6ee7b7;font-size:12px;">If checks FAIL → Do NOT send scripts. Contact user for correct payment.</p>
      </td></tr>
    </table>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0f172a;padding:22px 40px;text-align:center;">
    <p style="margin:0 0 4px;color:#818cf8;font-size:13px;font-weight:700;letter-spacing:0.5px;">Bolzaa Studio</p>
    <p style="margin:0;color:#334155;font-size:11px;">Automated payment notification · Do not forward to customers</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // Send Admin notification email with screenshot as CID attachment
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `[Bolzaa] New Order - ${planName || 'Plan'} | ${customerName || email} | TxID: ${transactionId}`,
      html: hrEmailContent,
      text: `NEW ORDER\n\nPlan: ${planName || 'Unknown'}\nTxID: ${transactionId}\nAmount: Rs.${parsedAmount}\n\nCustomer: ${customerName || '—'}\nEmail: ${email}\nPhone: ${customerPhone || '—'}\nYouTube: ${channelLink || '—'}\nDrive Email: ${driveEmail || '—'}\nNiche: ${niche || '—'}\nAudience: ${audience || '—'}\nLanguage: ${language || '—'}\nStyle: ${contentStyle || '—'}\n\nDate: ${orderDate}\n\nVerify payment before sending scripts.`,
      attachments: screenshotAttachments.length > 0 ? screenshotAttachments : undefined,
    };

    sendEmailAsync(mailOptions);

    // Return success to frontend
    return res.status(200).json({ 
      success: true, 
      message: 'Payment screenshot submitted for verification',
      verified: false,
      verificationToken,
      requiresHRVerification: true 
    });

  } catch (error) {
    if (isDev) {
      console.error('Transaction verification error:', error);
    }
    return res.status(500).json({ 
      success: false, 
      error: 'Verification failed',
      verified: false 
    });
  }
});

// ========================================
// 📧 EMAIL SENDING ENDPOINT (RATE LIMITED)
// ========================================
app.post('/api/send-email', emailLimiter, async (req: Request, res: Response) => {
  try {
    const { to, subject, text, html, name, email, instagram, channelLink, niche, message, screenshotBase64 } = req.body;

    // Early validation - fail fast
    if (!to || !subject || !text) {
      if (name && email && instagram && niche && message) {
        // Contact form email format
        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: process.env.ADMIN_EMAIL || 'bolzaa277@gmail.com',
          replyTo: email,
          subject: `🎯 Bolzaa - New Contact Form Submission from ${name}`,
          html: generateContactEmailHTML(name, email, instagram, channelLink || '—', niche, message),
          text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nInstagram: ${instagram}\nYouTube Channel: ${channelLink || '—'}\nNiche: ${niche}\n\nMessage:\n${message}`,
        };

        const sendResult = await sendEmailAsync(mailOptions);
        if (!sendResult.ok) {
          return res.status(202).json({
            success: true,
            message: 'Message received. Email delivery is delayed, please retry in a minute.',
          });
        }

        console.log(`📬 Contact form email sent from ${email} → ${process.env.ADMIN_EMAIL}`);
        return res.status(200).json({ success: true, message: 'Message received!' });
      }
      
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Payment email format
    const attachments: { filename: string; content: string; encoding: string; cid: string }[] = [];
    if (screenshotBase64 && typeof screenshotBase64 === 'string') {
      // Strip data URL prefix if present (e.g. "data:image/png;base64,")
      const base64Data = screenshotBase64.includes(',') ? screenshotBase64.split(',')[1] : screenshotBase64;
      const mimeMatch = screenshotBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
      attachments.push({
        filename: `payment_screenshot.${ext}`,
        content: base64Data,
        encoding: 'base64',
        cid: 'payment_screenshot',
      });
    }

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, // always deliver to admin, ignore frontend `to` for security
      subject: subject,
      text: text,
      html: html || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const sendResult = await sendEmailAsync(mailOptions);
    if (!sendResult.ok) {
      return res.status(202).json({
        success: true,
        message: 'Payment received. Email delivery is delayed, please retry in a minute.',
      });
    }

    console.log(`📬 Order email sent | Subject: ${subject} | To: ${process.env.ADMIN_EMAIL} | Screenshot: ${attachments.length > 0 ? 'YES' : 'NO'}`);
    
    // Mark transaction as processed if present
    if (req.body.transactionId) {
      if (verifiedTransactions[req.body.transactionId]) {
        verifiedTransactions[req.body.transactionId].verified = true;
      }
    }
    
    return res.status(200).json({ success: true, message: 'Payment received!' });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Send-email endpoint error: ${errorMsg}`);
    return res.status(500).json({ error: 'Request processing failed' });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/debug', (req: Request, res: Response) => {
  res.status(200).json({
    adminEmail: process.env.ADMIN_EMAIL || 'NOT_SET',
    emailPassSet: Boolean(process.env.EMAIL_PASS),
    nodeEnv: process.env.NODE_ENV || 'NOT_SET',
  });
});

// Cleanup old transactions (older than 24 hours)
setInterval(() => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (const txId in verifiedTransactions) {
    if (now - verifiedTransactions[txId].timestamp > oneDay) {
      delete verifiedTransactions[txId];
    }
  }
}, 60 * 60 * 1000); // Run every hour

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Server startup with transporter verification
const server = app.listen(PORT, async () => {
  try {
    // Verify SMTP connection before accepting requests
    await transporter.verify();
    console.log(`✅ SMTP Connection verified for: ${process.env.ADMIN_EMAIL}`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ SMTP Connection FAILED: ${errorMsg}`);
    console.error(`⚠️ Email sending will not work until SMTP is configured correctly`);
  }

  if (isDev) {
    console.log(`
╔════════════════════════════════════════╗
║   📧 Email Server Running              ║
║   Port: ${PORT}                        ║
║   Endpoint: http://localhost:${PORT}/api/send-email ║
╚════════════════════════════════════════╝
    `);
  }
});

// Set request timeout to 30 seconds
server.requestTimeout = 30000;
server.headersTimeout = 35000;
