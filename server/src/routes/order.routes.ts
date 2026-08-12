import { Router } from "express";
import { prisma } from "../db";
import { protect, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST /api/orders — Create a new order
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod,
      items,
      subtotal,
      discountAmount = 0,
      shippingFee = 0,
      totalAmount,
    } = req.body;

    if (!customerName || !customerPhone || !items || !items.length || !totalAmount) {
      return res.status(400).json({ error: "Missing required order details." });
    }

    const orderNumber = `SSG-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user?.id || null,
        customerName,
        customerPhone,
        customerEmail: customerEmail || "",
        shippingAddress: JSON.stringify(shippingAddress || {}),
        paymentMethod: paymentMethod || "WHATSAPP",
        paymentStatus: paymentMethod === "COD" || paymentMethod === "WHATSAPP" ? "PENDING" : "PAID",
        orderStatus: "PENDING",
        subtotal: Number(subtotal),
        discountAmount: Number(discountAmount),
        shippingFee: Number(shippingFee),
        totalAmount: Number(totalAmount),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            image: item.image,
            price: Number(item.price),
            quantity: Number(item.quantity || item.qty),
          })),
        },
      },
      include: { items: true },
    });

    // Reduce stock for ordered items & log inventory
    for (const item of items) {
      try {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity || item.qty || 1 } },
        });

        await prisma.inventoryLog.create({
          data: {
            productId: item.productId,
            type: "OUT",
            quantity: item.quantity || item.qty || 1,
            note: `Order ${order.orderNumber}`,
          },
        });
      } catch (err) {
        console.warn(`Could not update stock for product ${item.productId}`);
      }
    }

    return res.status(201).json({
      message: "Order placed successfully!",
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
      },
    });
  } catch (err: any) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ error: "Failed to place order." });
  }
});

// GET /api/orders/user — Get user's order history
router.get("/user", protect, async (req: AuthenticatedRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    const parsedOrders = orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress || "{}"),
    }));

    return res.json({ orders: parsedOrders });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch order history." });
  }
});

// GET /api/orders/track/:orderNumber — Track order by number or ID
router.get("/track/:orderNumber", async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.json({
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress || "{}"),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to track order." });
  }
});

export default router;
