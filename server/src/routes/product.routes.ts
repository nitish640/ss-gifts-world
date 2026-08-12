import { Router } from "express";
import { prisma } from "../db";

const router = Router();

// GET /api/products — List all products with filtering, search, category, sort
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;

    let whereClause: any = {};

    if (category && typeof category === "string" && category !== "all") {
      whereClause.category = { slug: category };
    }

    if (search && typeof search === "string") {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tag: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = Number(minPrice);
      if (maxPrice) whereClause.price.lte = Number(maxPrice);
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-low") orderBy = { price: "asc" };
    if (sort === "price-high") orderBy = { price: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };
    if (sort === "popular") orderBy = { reviewsCount: "desc" };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy,
    });

    const parsedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]"),
      specs: JSON.parse(p.specs || "[]"),
    }));

    return res.json({ products: parsedProducts });
  } catch (err: any) {
    console.error("Fetch Products Error:", err);
    return res.status(500).json({ error: "Failed to fetch products." });
  }
});

// GET /api/products/categories — List all categories
router.get("/categories", async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return res.json({ categories });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch categories." });
  }
});

// GET /api/products/:id — Single product detail
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    return res.json({
      product: {
        ...product,
        images: JSON.parse(product.images || "[]"),
        specs: JSON.parse(product.specs || "[]"),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch product details." });
  }
});

export default router;
