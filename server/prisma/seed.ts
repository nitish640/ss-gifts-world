import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SS Gift World database...");

  // 1. Create Default Admin User
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ssgiftworld.com" },
    update: {},
    create: {
      name: "Bujji Achary (Admin)",
      email: "admin@ssgiftworld.com",
      password: adminPassword,
      phone: "+91 9030690787",
      role: "ADMIN",
      isEmailVerified: true,
    },
  });
  console.log(`✅ Admin account created: ${admin.email}`);

  // 2. Create Categories
  const categoriesData = [
    { slug: "mug-printing", name: "Mug Printing", image: "/assets/p-mug.jpg", sortOrder: 1 },
    { slug: "photo-frames", name: "Photo Frames", image: "/assets/p-frame.jpg", sortOrder: 2 },
    { slug: "birthday", name: "Birthday Gifts", image: "/assets/p-birthday.jpg", sortOrder: 3 },
    { slug: "event-items", name: "Event Items", image: "/assets/p-event.jpg", sortOrder: 4 },
    { slug: "soft-toys", name: "Soft Toys", image: "/assets/p-softtoys.jpg", sortOrder: 5 },
    { slug: "balloons", name: "Balloons & Decor", image: "/assets/p-balloons.jpg", sortOrder: 6 },
    { slug: "toys", name: "Kids Toys", image: "/assets/p-toys.jpg", sortOrder: 7 },
    { slug: "customized", name: "Customized Gifts", image: "/assets/p-custom.jpg", sortOrder: 8 },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categoriesData.length} categories seeded.`);

  // 3. Create Products
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  const productsData = [
    {
      name: "Personalised Photo Mug",
      slug: "personalised-photo-mug",
      categorySlug: "mug-printing",
      price: 299,
      oldPrice: 399,
      tag: "Bestseller",
      stock: 25,
      isFeatured: true,
      isTrending: true,
      description: "Custom ceramic photo mug printed with high-resolution sub-ink process.",
    },
    {
      name: "Magic Colour-Changing Mug",
      slug: "magic-colour-changing-mug",
      categorySlug: "mug-printing",
      price: 449,
      oldPrice: 599,
      tag: "Trending",
      stock: 18,
      isFeatured: true,
      description: "Pour hot liquid to reveal your secret printed photo!",
    },
    {
      name: "Wall Collage Photo Frame Set (13 pcs)",
      slug: "wall-collage-photo-frame-set",
      categorySlug: "photo-frames",
      price: 1499,
      oldPrice: 1999,
      tag: "Popular",
      stock: 12,
      isFeatured: true,
      isBestSeller: true,
      description: "Complete 13-piece synthetic wood photo wall gallery kit with layout template.",
    },
    {
      name: "Wooden Engraved Photo Frame",
      slug: "wooden-engraved-photo-frame",
      categorySlug: "photo-frames",
      price: 799,
      oldPrice: 999,
      stock: 8,
      isTrending: true,
      description: "Real teak-finish wood engraved with your special custom message and photo.",
    },
    {
      name: "Birthday Surprise Gift Hamper",
      slug: "birthday-surprise-gift-hamper",
      categorySlug: "birthday",
      price: 1299,
      oldPrice: 1599,
      tag: "Special",
      stock: 15,
      isFeatured: true,
      description: "Curated birthday box containing chocolates, mini frame, mug and party popper.",
    },
    {
      name: "Cuddly Teddy Bear (Medium)",
      slug: "cuddly-teddy-bear-medium",
      categorySlug: "soft-toys",
      price: 699,
      oldPrice: 899,
      stock: 20,
      description: "Ultra-soft premium plush teddy bear with embroidered heart ribbon.",
    },
    {
      name: "Jumbo Teddy Bear (3 ft)",
      slug: "jumbo-teddy-bear-3ft",
      categorySlug: "soft-toys",
      price: 1999,
      oldPrice: 2499,
      tag: "Giant",
      stock: 4,
      isBestSeller: true,
      description: "Life-size 3ft soft plush teddy bear.",
    },
    {
      name: "Happy Birthday Balloon Arch Kit",
      slug: "happy-birthday-balloon-arch-kit",
      categorySlug: "balloons",
      price: 549,
      oldPrice: 699,
      stock: 30,
      description: "100-piece metallic balloon arch garland set with tape and glue dots.",
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        categoryId,
        price: prod.price,
        oldPrice: prod.oldPrice,
        stock: prod.stock,
        tag: prod.tag || null,
        isFeatured: prod.isFeatured || false,
        isTrending: prod.isTrending || false,
        isBestSeller: prod.isBestSeller || false,
        description: prod.description,
        images: JSON.stringify(["/assets/p-mug.jpg"]),
        specs: JSON.stringify([
          { label: "Personalisation", value: "Photo / name printing available" },
          { label: "Ready in", value: "Same day dispatch" },
        ]),
      },
    });
  }
  console.log(`✅ ${productsData.length} products seeded.`);

  // 4. Create Demo Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minPurchase: 499,
      maxDiscount: 200,
      expiryDate: new Date("2028-12-31"),
      usageLimit: 500,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FESTIVE200" },
    update: {},
    create: {
      code: "FESTIVE200",
      type: "FLAT",
      value: 200,
      minPurchase: 1499,
      expiryDate: new Date("2028-12-31"),
      usageLimit: 100,
    },
  });
  console.log("✅ Coupons seeded.");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
