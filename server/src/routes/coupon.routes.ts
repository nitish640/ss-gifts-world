import { Router } from "express";
import { prisma } from "../db";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

// POST /api/coupons/verify — Validate promo code
router.post("/verify", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ error: "Coupon code is required." });

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ error: "Invalid or inactive coupon code." });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ error: "This coupon code has expired." });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "Coupon usage limit reached." });
    }

    if (Number(subtotal) < coupon.minPurchase) {
      return res.status(400).json({
        error: `Minimum cart value of ₹${coupon.minPurchase} required for this coupon.`,
      });
    }

    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = (Number(subtotal) * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return res.json({
      valid: true,
      code: coupon.code,
      discount: Math.round(discount),
      message: `Coupon applied! You saved ₹${Math.round(discount)}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to verify coupon." });
  }
});

// GET /api/coupons — List coupons (Admin)
router.get("/", protect, adminOnly, async (_req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ coupons });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch coupons." });
  }
});

// POST /api/coupons — Create coupon (Admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { code, type, value, minPurchase, maxDiscount, expiryDate, usageLimit } = req.body;
    if (!code || !value) {
      return res.status(400).json({ error: "Code and discount value required." });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type: type || "PERCENTAGE",
        value: Number(value),
        minPurchase: Number(minPurchase || 0),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        expiryDate: new Date(expiryDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: Number(usageLimit || 100),
      },
    });

    return res.status(201).json({ message: "Coupon created", coupon });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to create coupon." });
  }
});

// DELETE /api/coupons/:id — Delete coupon (Admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } });
    return res.json({ message: "Coupon deleted." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete coupon." });
  }
});

export default router;
