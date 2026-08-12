import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { generateToken, protect, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "CUSTOMER",
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Failed to register user." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Failed to login." });
  }
});

// GET /api/auth/me
router.get("/me", protect, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        addresses: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: "Error fetching user profile." });
  }
});

// POST /api/auth/address
router.post("/address", protect, async (req: AuthenticatedRequest, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

    const address = await prisma.address.create({
      data: {
        userId: req.user!.id,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault: isDefault || false,
      },
    });
    return res.status(201).json({ address });
  } catch (err: any) {
// POST /api/auth/send-otp
router.post("/send-otp", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required." });
    }

    const apiKey = process.env.RESEND_API_KEY || "re_JjXihM2Z_PaK4HvKeJ5yeniYXdn3jCJZu";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "🔐 Your SS Gift World Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 480px; margin: 0 auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #e53935; margin: 0; font-size: 24px;">🎁 SS Gift World</h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Sri Swetchavathi Gift Store — Ichapuram</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <h3 style="color: #1e293b; font-size: 16px; margin-top: 0;">Password Reset Security Code</h3>
            <p style="color: #475569; font-size: 14px;">We received a password reset request for your account (<strong>${email}</strong>).</p>
            <p style="color: #475569; font-size: 14px;">Your 6-digit security verification code is:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="background-color: #f1f5f9; color: #0f172a; font-size: 28px; font-weight: bold; font-family: monospace; letter-spacing: 6px; padding: 12px 28px; border-radius: 12px; border: 1px solid #cbd5e1; display: inline-block;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #64748b; font-size: 12px; text-align: center;">SS Gift World, Main Road, Ichapuram | WhatsApp Support: +91 9030690787</p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error("Send OTP Error:", err);
    return res.status(500).json({ error: "Failed to send email OTP." });
  }
});

export default router;
