import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { products } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — SS Gift World" },
      { name: "description", content: "Your saved gifts, ready to move into the bag whenever you are." },
      { property: "og:title", content: "Wishlist — SS Gift World" },
      { property: "og:description", content: "Your saved gifts at SS Gift World." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useShop();
  const saved = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="shell py-12 md:py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold md:text-5xl">Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            {saved.length} saved {saved.length === 1 ? "gift" : "gifts"}.
          </p>
        </div>
        <Link to="/account" className="rounded-full border border-border px-5 py-2.5 text-xs font-bold hover:bg-secondary">
          ← Back to My Account
        </Link>
      </div>

      {saved.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-[2rem] border border-dashed border-border bg-card px-6 py-24 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="grid size-20 place-items-center rounded-3xl bg-secondary text-primary"
          >
            <Heart className="size-9" />
          </motion.div>
          <h2 className="mt-8 text-2xl font-bold">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any gift to keep it here.</p>
          <Link
            to="/shop"
            className="mt-8 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            Explore gifts
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
