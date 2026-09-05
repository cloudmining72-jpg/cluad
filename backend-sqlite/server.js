/**
 * Claudex Mining - Production Node.js Express & MongoDB REST API Server
 * Complete backend server ready for VPS deployment (Hostinger, DigitalOcean, Hetzner, AWS)
 */

const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: path.join(__dirname, 'database.sqlite'), logging: false });
const inMemoryUsers = new Map();
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/claudex_mining_db';
const JWT_SECRET = process.env.JWT_SECRET || 'claudex_mining_jwt_secret_key_2026';

// Helper function to send real OTP emails via SMTP or Ethereal Email Service
const sendOtpEmail = async (toEmail, otpCode, type = 'RESET', fullName = '') => {
  let transporter;
  let isTestAccount = false;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      isTestAccount = true;
    } catch (e) {
      console.warn('⚠️ Could not create Ethereal test account:', e.message);
      return { sent: false, reason: e.message };
    }
  }

  const isSignup = type === 'SIGNUP';
  const subject = isSignup
    ? `✨ ClaudeMining - Email Verification Code: ${otpCode}`
    : `🔑 ClaudeMining - Password Reset Code: ${otpCode}`;

  const headerTitle = isSignup ? 'Account Email Verification' : 'Password Reset Request';
  const accentColor = isSignup ? '#10b981' : '#f59e0b';
  const introGreeting = fullName ? `Hello <strong>${fullName}</strong>,` : 'Hello,';
  const bodyText = isSignup
    ? 'Welcome to ClaudeMining! Please use the 6-digit verification code below to verify your email address and activate your cloud mining account.'
    : `You requested a password reset for account: <strong>${toEmail}</strong>. Please use the 6-digit OTP code below to set your new password.`;

  const footerNote = isSignup
    ? 'If you did not request this verification code, please ignore this email.'
    : 'If you did not request this password reset, your account is still secure and you can safely ignore this email.';

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"ClaudeMining Security" <info@claudemining.com>',
    to: toEmail,
    subject: subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0e17; color: #f3f4f6; padding: 24px; border-radius: 12px; max-width: 480px; margin: 0 auto; border: 1px solid #1f293d;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #f3f4f6; font-size: 22px; margin: 0; font-weight: 800;">Claude<span style="color: #06b6d4;">Mining</span></h1>
          <span style="font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">Official Security Dispatch</span>
        </div>
        <div style="border-top: 1px solid #1f293d; padding-top: 16px;">
          <h2 style="color: ${accentColor}; margin-top: 0; font-size: 18px;">${headerTitle}</h2>
          <p style="color: #d1d5db; font-size: 14px; margin-bottom: 8px;">${introGreeting}</p>
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5;">${bodyText} This code expires in <strong>10 minutes</strong>.</p>
          <div style="background-color: #111827; border: 1px dashed ${accentColor}; padding: 18px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: ${accentColor}; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-bottom: 0; line-height: 1.4;">${footerNote}</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`✉️ Real Ethereal Email Inbox Link: ${previewUrl}`);
    } else {
      console.log(`✅ Real [${type}] OTP Email dispatched via SMTP to ${toEmail}`);
    }
    return { sent: true, previewUrl: previewUrl || undefined };
  } catch (err) {
    console.error(`❌ Failed to dispatch SMTP [${type}] Email:`, err.message);
    return { sent: false, error: err.message };
  }
};


// ==================== ENTERPRISE SECURITY MIDDLEWARE ====================
app.disable('x-powered-by');

// Security Headers (Clickjacking, MIME Sniffing, XSS protection)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// In-Memory IP Rate Limiter (Protection against Brute Force & DDoS)
const requestTracker = new Map();
const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown_ip';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxAttempts = 100;

  const userRecord = requestTracker.get(ip) || { count: 0, firstAttempt: now };
  if (now - userRecord.firstAttempt > windowMs) {
    userRecord.count = 1;
    userRecord.firstAttempt = now;
  } else {
    userRecord.count++;
  }
  requestTracker.set(ip, userRecord);

  if (userRecord.count > maxAttempts) {
    return res.status(429).json({
      success: false,
      message: '⛔ Too many security attempts from this IP. Please wait 10 minutes before retrying.',
    });
  }
  next();
};

// NoSQL Injection Sanitizer (Blocks malicious MongoDB $ operators)
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
    return obj;
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};

// CORS - Allow all origins in production (Render, Railway, Capacitor APK)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://claudemining.com',
  'https://www.claudemining.com',
  'capacitor://localhost',
  'ionic://localhost',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, APK, Postman, curl)
    if (!origin) return callback(null, true);
    // In production allow all (Render preview URLs etc)
    if (process.env.NODE_ENV === 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(sanitizeInput);

// Apply Rate Limiter to ALL Auth Endpoints (including signup)
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/send-signup-otp', authRateLimiter);
app.use('/api/auth/verify-signup-otp', authRateLimiter);
app.use('/api/auth/forgot-password', authRateLimiter);
app.use('/api/auth/reset-password', authRateLimiter);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer Storage Configuration for CNIC & Selfie Photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ==================== CLOUDINARY MEDIA STORAGE ====================
// Uploads payment receipt screenshots & KYC documents directly to Cloudinary
app.post('/api/upload/cloudinary', upload.single('file'), async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'vlkizgpq';
    const apiKey = process.env.CLOUDINARY_API_KEY || '269229587943487';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'lqv8YPkaEk_Z8XuW4VEmAAoA06I';
    const folder = req.body.folder || 'payment_proofs';

    let fileData = null;
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      fileData = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    } else if (req.body.file) {
      fileData = req.body.file;
    }

    if (!fileData) {
      return res.status(400).json({ success: false, message: 'No image file or base64 data provided.' });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    const formData = new URLSearchParams();
    formData.append('file', fileData);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const cData = await cRes.json();
    if (cData.secure_url) {
      return res.json({
        success: true,
        message: 'Image uploaded to Cloudinary successfully!',
        url: cData.secure_url,
        publicId: cData.public_id,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: cData.error?.message || 'Cloudinary upload failed',
      });
    }
  } catch (err) {
    console.error('Cloudinary API Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== SEQUELIZE SQLITE MODELS ====================

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, defaultValue: '' },
  country: { type: DataTypes.STRING, defaultValue: 'Pakistan' },
  balance: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  availableCash: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  investedAmount: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  todayPL: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  totalPL: { type: DataTypes.FLOAT, defaultValue: 0.00 },
  kycStatus: { type: DataTypes.ENUM('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'), defaultValue: 'UNVERIFIED' },
  referralCode: { type: DataTypes.STRING },
  referredBy: { type: DataTypes.STRING, defaultValue: '' },
  role: { type: DataTypes.ENUM('USER', 'ADMIN'), defaultValue: 'USER' },
  resetOtp: { type: DataTypes.STRING },
  resetOtpExpires: { type: DataTypes.DATE },
});

const MiningPlan = sequelize.define('MiningPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  planName: { type: DataTypes.STRING, allowNull: false },
  investedAmount: { type: DataTypes.FLOAT, allowNull: false },
  dailyProfit: { type: DataTypes.FLOAT, allowNull: false },
  totalTargetReturn: { type: DataTypes.FLOAT, allowNull: false },
  durationDays: { type: DataTypes.INTEGER, defaultValue: 30 },
  claimedDaysCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastClaimDate: { type: DataTypes.STRING, defaultValue: '' },
  status: { type: DataTypes.ENUM('ACTIVE', 'COMPLETED'), defaultValue: 'ACTIVE' },
});

const Deposit = sequelize.define('Deposit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  walletAddress: { type: DataTypes.STRING, defaultValue: '' },
  status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' },
  processedAt: { type: DataTypes.DATE },
});

const Withdrawal = sequelize.define('Withdrawal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  accountDetails: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' },
  processedAt: { type: DataTypes.DATE },
});

// Setup Associations
User.hasMany(MiningPlan, { foreignKey: 'userId' });
User.hasMany(Deposit, { foreignKey: 'userId' });
User.hasMany(Withdrawal, { foreignKey: 'userId' });
MiningPlan.belongsTo(User, { foreignKey: 'userId' });
Deposit.belongsTo(User, { foreignKey: 'userId' });
Withdrawal.belongsTo(User, { foreignKey: 'userId' });

// JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access Token Required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or Expired Token' });
    req.user = decoded;
    next();
  });
};

// Admin Guard
const adminGuard = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin Access Required' });
  }
};

// ==================== REST API ENDPOINTS ====================

// Sanitize user object - strip sensitive fields before sending to client
const sanitizeUser = (user) => {
  if (!user) return null;
  const u = user.get ? user.get({ plain: true }) : { ...user };
  delete u.password;
  delete u.resetOtp;
  delete u.resetOtpExpires;
  
  return u;
};

// Health Check (minimal info)
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'API Online', timestamp: new Date() });
});

// Pending Signup OTPs Storage (15 min validity)
const pendingSignupStore = new Map();

// Auth: Send Signup Email Verification OTP
app.post('/api/auth/send-signup-otp', async (req, res) => {
  try {
    const { email, fullName } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    const cleanEmail = email.toLowerCase().trim();

    if (true) {
      const existing = await User.findOne({ where: { email: cleanEmail } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please login instead.' });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingSignupStore.set(cleanEmail, {
      otp,
      expires: Date.now() + 15 * 60 * 1000,
    });

    const emailResult = await sendOtpEmail(cleanEmail, otp, 'SIGNUP', fullName);

    res.json({
      success: true,
      message: emailResult.previewUrl
        ? `Verification code sent to ${cleanEmail}! Check your email inbox.`
        : `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      // NOTE: otp is NEVER sent to client in production (only logged server-side for dev)
      emailSent: emailResult.sent,
      // Only include preview URL in development for testing
      ...(process.env.NODE_ENV !== 'production' && emailResult.previewUrl ? { previewUrl: emailResult.previewUrl } : {}),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Auth: Verify Signup OTP & Create User
app.post('/api/auth/verify-signup-otp', async (req, res) => {
  try {
    const { email, otp, fullName, password, phone, country, referralCode } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const record = pendingSignupStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No pending registration found or code has expired. Please request a new code.' });
    }

    if (Date.now() > record.expires) {
      pendingSignupStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please request a new code.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit verification code. Please check your email.' });
    }

    pendingSignupStore.delete(cleanEmail);

    // Generate unique referral code for new user
    const newRefCode = 'REF_' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanReferralCode = (referralCode || '').trim().toUpperCase();

    // If MongoDB connected, persist user, otherwise inMemoryUsers
    let user;
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    if (true) {
      user = new User({
        name: fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        country: country || 'Pakistan',
        referralCode: newRefCode,
        referredBy: cleanReferralCode || '',
        balance: 0,
        availableCash: 0,
      });
      await user.save();
    } else {
      user = {
        id: `usr_${Date.now()}`,
        name: fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        country: country || 'Pakistan',
        referralCode: newRefCode,
        referredBy: cleanReferralCode || '',
        balance: 0,
        availableCash: 0,
        role: 'USER',
        save: async function () { inMemoryUsers.set(this.email, this); },
      };
      inMemoryUsers.set(cleanEmail, user);
    }

    const token = jwt.sign({ id: user.id || user.id, role: user.role || 'USER', email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    console.log(`✅ New user registered: ${cleanEmail} | Referred by: ${cleanReferralCode || 'none'} | Own code: ${newRefCode}`);
    res.json({ success: true, message: 'Email verified and account registered successfully!', token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

// Auth: Direct Signup (Backup)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone, country } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    const cleanEmail = email.toLowerCase().trim();

    let existing;
    if (true) {
      existing = await User.findOne({ where: { email: cleanEmail } });
    } else {
      existing = inMemoryUsers.get(cleanEmail);
    }

    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if (true) {
      user = new User({
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        country: country || 'Pakistan',
      });
      await user.save();
    } else {
      user = {
        id: `usr_${Date.now()}`,
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        country: country || 'Pakistan',
        role: 'USER',
        save: async function () { inMemoryUsers.set(this.email, this); },
      };
      inMemoryUsers.set(cleanEmail, user);
    }

    const token = jwt.sign({ id: user.id || user.id, role: user.role || 'USER', email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: 'Registration successful!', token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const cleanEmail = email.toLowerCase().trim();

    const ADMIN_EMAILS = ['admin@claudemining.com'];
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      const adminPassCorrect = password === '12345six@';
      if (!adminPassCorrect) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
      const adminUser = { id: 'admin_01', name: 'Master Admin', email: cleanEmail, role: 'ADMIN' };
      const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '7d' });
      console.log(`[SECURITY] Admin login: ${cleanEmail} at ${new Date().toISOString()}`);
      return res.json({ success: true, message: 'Authenticated successfully!', token, user: adminUser });
    }

    let user;
    let isValidPassword = false;

    if (true) {
      user = await User.findOne({ where: { email: cleanEmail } });
      if (user) {
        isValidPassword = await bcrypt.compare(password, user.password);
      }
    } else {
      user = inMemoryUsers.get(cleanEmail);
      if (user) {
        isValidPassword = user.password === password || (await bcrypt.compare(password, user.password).catch(() => false));
      }
    }

    if (!user || !isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id || user.id, role: user.role || 'USER', email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, message: 'Login successful!', token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// Auth: Forgot Password - Request OTP
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    const cleanEmail = email.toLowerCase().trim();

    let user;
    if (true) {
      user = await User.findOne({ where: { email: cleanEmail } });
    } else {
      user = inMemoryUsers.get(cleanEmail);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with this email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    // Dispatch real email via Nodemailer
    const emailResult = await sendOtpEmail(user.email, otp, 'RESET');

    res.json({
      success: true,
      message: `Password reset code has been sent to your email inbox.`,
      emailSent: emailResult.sent,
      // NEVER expose OTP in response - only send via email
      ...(process.env.NODE_ENV !== 'production' && emailResult.previewUrl ? { previewUrl: emailResult.previewUrl } : {}),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send reset code. Please try again.' });
  }
});

// Auth: Reset Password - Verify OTP & Update Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP code, and new password are required.' });
    }
    const cleanEmail = email.toLowerCase().trim();

    let user;
    if (true) {
      user = await User.findOne({ where: { email: cleanEmail } });
    } else {
      user = inMemoryUsers.get(cleanEmail);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found with this email address.' });
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP verification code.' });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP verification code has expired. Please request a new code.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully! You can now sign in with your new password.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// User: Change Password
app.post('/api/user/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Plans: Buy Mining Machine ($50+)
app.post('/api/plans/buy', authenticateToken, async (req, res) => {
  try {
    const { planName, amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount.' });

    const user = await User.findByPk(req.user.id);
    if (user.availableCash < amount) {
      return res.status(400).json({ success: false, message: `Insufficient cash. Available: $${user.availableCash.toFixed(2)}` });
    }

    // DEDUCT COST FROM BALANCE & CASH
    user.availableCash -= amount;
    user.balance -= amount;
    user.investedAmount += amount;
    await user.save();

    const dailyProfit = Number(((amount * 2) / 30).toFixed(2));
    const miningPlan = new MiningPlan({
      userId: user.id,
      planName: `${planName} ($${amount})`,
      investedAmount: amount,
      dailyProfit,
      totalTargetReturn: amount * 2,
    });
    await miningPlan.save();

    res.json({ success: true, message: `Mining machine ${planName} activated!`, user, plan: miningPlan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Plans: Daily Profit Claim (10 AM - 4 PM Window Check)
app.post('/api/plans/claim', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await MiningPlan.findOne({ where: { id: planId, userId: req.user.id } });
    if (!plan) return res.status(404).json({ success: false, message: 'Mining machine plan not found.' });

    if (plan.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: 'This mining machine contract is completed.' });
    }

    // Local 10 AM - 4 PM Time Check
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour < 10 || currentHour >= 16) {
      return res.status(400).json({ success: false, message: 'Daily claim window is open ONLY between 10:00 AM and 04:00 PM.' });
    }

    const todayStr = now.toISOString().split('T')[0];
    if (plan.lastClaimDate === todayStr) {
      return res.status(400).json({ success: false, message: 'Today\'s profit has already been claimed!' });
    }

    const user = await User.findByPk(req.user.id);
    user.availableCash += plan.dailyProfit;
    user.balance += plan.dailyProfit;
    user.todayPL += plan.dailyProfit;
    user.totalPL += plan.dailyProfit;
    await user.save();

    plan.claimedDaysCount += 1;
    plan.lastClaimDate = todayStr;
    if (plan.claimedDaysCount >= plan.durationDays) {
      plan.status = 'COMPLETED';
    }
    await plan.save();

    res.json({ success: true, message: `Successfully claimed +$${plan.dailyProfit.toFixed(2)} coin yield!`, user, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ==================== STATIC ASSETS & WEB APP ROUTING ====================

// 1. Direct APK download (Serves ClaudeMining.apk with proper filename & headers)
app.get(['/ClaudeMining.apk', '/claudemining.apk', '/app.apk'], (req, res) => {
  let apkPath = path.join(__dirname, 'ClaudeMining.apk');
  if (!fs.existsSync(apkPath)) apkPath = path.join(__dirname, 'app-debug.apk');
  if (!fs.existsSync(apkPath)) apkPath = path.join(__dirname, 'app-debug.apk');

  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="ClaudeMining.apk"');
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.download(apkPath, 'ClaudeMining.apk');
  } else {
    res.status(404).send('APK file not found');
  }
});

// 2. Serve React App build at /app and /app/*
const appDistDir = path.join(__dirname, 'app');
if (fs.existsSync(appDistDir)) {
  app.use('/app', express.static(appDistDir));
  app.use('/assets', express.static(path.join(appDistDir, 'assets')));
  app.get(['/app', '/app/*'], (req, res) => {
    res.sendFile(path.join(appDistDir, 'index.html'));
  });
}

// 3. API 404 Catch-all for all methods (GET, POST, etc.)
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// 4. Serve Marketing Landing Website static files from root
app.use(express.static(__dirname));

// 5. Catch-all for client-side SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ClaudeMining Backend API Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Connect to MongoDB Database asynchronously (optional - server works without it)
sequelize.sync({ alter: true }).then(() => console.log('✅ SQLite Database & Tables Synced')).catch(err => console.error('SQLite Sync Error:', err));
