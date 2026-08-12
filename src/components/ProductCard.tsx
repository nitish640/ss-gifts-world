import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { inr, type Product } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, toggleWish, wishlist } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const wished = wishlist.includes(product.id);
  const off = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Sign In Required!", { description: "Please log in to your customer account to add items to your cart." });
      navigate({ to: "/login" });
      return;
    }

    add(product.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow duration-300 hover:shadow-lift"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="relative block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-surface">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
          />
        </div>
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          {off > 0 && (
            <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-soft">
              {off}% OFF
            </span>
          )}
          {product.tag && (
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground">
              {product.tag}
            </span>
          )}
        </div>
      </Link>

      <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 md:translate-x-3 md:group-hover:translate-x-0 max-md:opacity-100">
        <motion.button
          whileTap={{ scale: 0.86 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => toggleWish(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="grid size-11 place-items-center rounded-full bg-card/90 backdrop-blur shadow-soft"
        >
          <Heart className={cn("size-4", wished && "fill-primary text-primary")} />
        </motion.button>
        <motion.div whileTap={{ scale: 0.86 }} whileHover={{ scale: 1.08 }}>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            aria-label={`Quick view ${product.name}`}
            className="grid size-11 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur"
          >
            <Eye className="size-4" />
          </Link>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="font-semibold text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
          <span className="ml-auto capitalize">{product.category}</span>
        </div>

        <Link to="/product/$id" params={{ id: product.id }} className="min-w-0">
          <h3 className="truncate text-base font-bold transition-colors group-hover:text-primary">{product.name}</h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="text-lg font-extrabold">{inr(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">{inr(product.oldPrice)}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to bag`}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingBag className="size-4" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
