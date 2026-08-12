import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { generateToken, protect, adminOnly, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/admin/login — Dedicated Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Admin email and password required." });
    }

    const admin = await prisma.user.findUnique({ where: { email } });
    if (!admin || admin.role !== "ADMIN") {
      return res.status(401).json({ error: "Invalid credentials or non-admin account." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    return res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err: any) {
    console.error("Admin Login Error:", err);
    return res.status(500).json({ error: "Failed to authenticate admin." });
  }
});

// GET /api/admin/analytics — Real sales insights, totals, recent orders & stock alerts
router.get("/analytics", protect, adminOnly, async (_req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });

    const revenueResult = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 } },
      include: { category: true },
    });

    const categoryCounts = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });

    return res.json({
      analytics: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        recentOrders: recentOrders.map((o) => ({
          ...o,
          shippingAddress: JSON.parse(o.shippingAddress || "{}"),
        })),
        lowStockProducts: lowStockProducts.map((p) => ({
          ...p,
          images: JSON.parse(p.images || "[]"),
        })),
        categoryDistribution: categoryCounts.map((c) => ({
          name: c.name,
          count: c._count.products,
        })),
      },
    });
  } catch (err: any) {
    console.error("Analytics Error:", err);
    return res.status(500).json({ error: "Failed to fetch admin analytics." });
  }
});

// GET /api/admin/orders — List all orders for admin
router.get("/orders", protect, adminOnly, async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      orders: orders.map((o) => ({
        ...o,
        shippingAddress: JSON.parse(o.shippingAddress || "{}"),
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// PATCH /api/admin/orders/:id/status — Update order status
router.patch("/orders/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return res.json({ message: "Order status updated", order: updated });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update order status." });
  }
});

// POST /api/admin/products — Create product
router.post("/products", protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      categoryId,
      price,
      oldPrice,
      stock,
      tag,
      description,
      images,
      specs,
      isFeatured,
      isTrending,
      isBestSeller,
    } = req.body;

    if (!name || !categoryId || !price) {
      return res.status(400).json({ error: "Product name, category and price are required." });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stock: Number(stock || 10),
        tag: tag || null,
        description: description || "Fresh handcrafted gift product.",
        images: JSON.stringify(images || ["/placeholder.jpg"]),
        specs: JSON.stringify(specs || []),
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        isBestSeller: Boolean(isBestSeller),
      },
    });

    return res.status(201).json({ message: "Product created successfully", product });
  } catch (err: any) {
    console.error("Create Product Error:", err);
    return res.status(500).json({ error: "Failed to create product." });
  }
});

// PUT /api/admin/products/:id — Edit product
router.put("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId, price, oldPrice, stock, tag, description, isFeatured, isTrending } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        categoryId,
        price: price ? Number(price) : undefined,
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stock: stock !== undefined ? Number(stock) : undefined,
        tag,
        description,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isTrending: isTrending !== undefined ? Boolean(isTrending) : undefined,
      },
    });

    return res.json({ message: "Product updated", product: updated });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update product." });
  }
});

// DELETE /api/admin/products/:id — Delete product
router.delete("/products/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ message: "Product deleted successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete product." });
  }
});

export default router;
