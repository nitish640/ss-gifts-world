import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Check, Heart, Minus, Plus, Share2, ShieldCheck, ShoppingBag, Star, Truck, Zap } from "lucide-react";
import { getProduct, inr, products } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id) || products[0];
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product || products[0];
    return {
      meta: [
        { title: `${p.name} — SS Gift World` },
        { name: "description", content: p.description ? p.description.slice(0, 155) : "Custom Gifts at SS Gift World" },
        { property: "og:title", content: `${p.name} — SS Gift World` },
        { property: "og:description", content: p.description ? p.description.slice(0, 155) : "Custom Gifts at SS Gift World" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const loaderData = Route.useLoaderData();
  const product = loaderData?.product || products[0];
  const { add, toggleWish, wishlist } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [customText, setCustomText] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || "Classic");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);
  const wished = Array.isArray(wishlist) && product ? wishlist.includes(product.id) : false;
  const related = products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4);
  const fallback = products.filter((p) => p.id !== product?.id).slice(0, 4);
  const suggestions = related.length ? related : fallback;

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Sign In Required!", { description: "Please log in to your customer account to add items to your cart." });
      navigate({ to: "/login" });
      return;
    }
    add(product.id, qty);
  };

  return (
    <div className="shell py-10 md:py-16">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/shop" search={{ category: product.category }} className="capitalize hover:text-primary">
          {product.category}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft"
          >
            <img
              src={product.images?.[selectedImageIndex] || product.image}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
            />
            {customText && (
              <div className="absolute inset-x-4 bottom-8 flex justify-center pointer-events-none">
                <span className="rounded-xl bg-background/90 px-4 py-2 text-sm font-extrabold text-primary shadow-lift border border-primary/20 backdrop-blur">
                  ✨ {customText}
                </span>
              </div>
            )}
          </motion.div>

          {/* Multi-Image Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer",
                    selectedImageIndex === idx ? "border-primary shadow-md scale-105" : "border-border opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Dynamic Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-4 rounded-2xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Color / Finish</label>
                <span className="text-xs font-extrabold text-primary">{selectedColor}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all ${
                      selectedColor === c.name ? "border-primary bg-primary/10 shadow-sm font-bold" : "border-border hover:bg-secondary"
                    }`}
                  >
                    <span
                      className="size-5 rounded-full border border-border shadow-inner mb-1"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[10px] truncate w-full">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Size / Dimensions Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4 rounded-2xl border border-border bg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Size / Dimensions</label>
                <span className="text-xs font-extrabold text-primary">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                      selectedSize === sz ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="size-4 fill-gold text-gold" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold md:text-[2.6rem] md:leading-tight">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold">{inr(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{inr(product.oldPrice)}</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Save {inr(product.oldPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Live Personalization Input Box - ONLY for Customizable products */}
          {product.isCustomisable && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                ✨ Add Live Custom Text / Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Happy Birthday Swetha! / Swetha & Bujji"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">Type any custom message to preview it live on the product photo above!</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid size-11 place-items-center rounded-full hover:bg-secondary"
              >
                <Minus className="size-4" />
              </motion.button>
              <motion.span key={qty} initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="w-8 text-center font-bold">
                {qty}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="grid size-11 place-items-center rounded-full hover:bg-secondary"
              >
                <Plus className="size-4" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="inline-flex h-14 flex-1 min-w-[160px] items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-glow"
            >
              <ShoppingBag className="size-4" /> Add to bag
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!user) {
                  toast.error("Sign In Required!", { description: "Please log in to your customer account to complete purchase." });
                  navigate({ to: "/login" });
                  return;
                }
                add(product.id, qty);
                navigate({ to: "/cart" });
              }}
              className="inline-flex h-14 flex-1 min-w-[160px] items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-bold text-background shadow-lift hover:opacity-90 transition-transform"
            >
              <Zap className="size-4 text-amber-400 fill-amber-400" /> Buy Now
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => toggleWish(product.id)}
              aria-label="Add to wishlist"
              className="grid size-14 place-items-center rounded-full border border-border bg-card shrink-0"
            >
              <Heart className={cn("size-5", wished && "fill-primary text-primary")} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => toast.success("Link copied to clipboard")}
              aria-label="Share product"
              className="grid size-14 place-items-center rounded-full border border-border bg-card"
            >
              <Share2 className="size-5" />
            </motion.button>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Delivery checker</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPinResult(pin.length === 6 ? "Delivers by tomorrow, free shipping" : "Enter a valid 6-digit pincode");
              }}
              className="mt-4 flex gap-3"
            >
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                className="h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="h-12 shrink-0 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground">
                Check
              </button>
            </form>
            {pinResult && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="size-4 text-primary" /> {pinResult}
              </motion.p>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Truck, text: "Free delivery above ₹999" },
              { icon: ShieldCheck, text: "Secure encrypted checkout" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-3 rounded-2xl bg-surface p-4 text-sm">
                <b.icon className="size-4 shrink-0 text-primary" /> {b.text}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Specifications</h2>
            <dl className="mt-4 divide-y divide-border">
              {product.specs.map((s: { label: string; value: string }) => (
                <div key={s.label} className="grid grid-cols-[minmax(0,1fr)_1.4fr] gap-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="text-2xl font-extrabold md:text-3xl">You may also love</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
