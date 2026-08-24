import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { categories, inr, products } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type ShopSearch = { category: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    category: typeof s["category"] === "string" ? (s["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All Gifts — SSG Gift World" },
      {
        name: "description",
        content: "Browse custom mug printing, photo frames, birthday gifts, soft toys, balloons & event items in Ichapuram.",
      },
      { property: "og:title", content: "Shop All Gifts — SSG Gift World" },
      { property: "og:description", content: "Browse custom mug printing, photo frames, birthday gifts, soft toys, balloons & event items in Ichapuram." },
      { property: "og:image", content: "https://gifted-elegance-main.vercel.app/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://gifted-elegance-main.vercel.app/og-image.jpg" },
      { name: "twitter:image", content: "https://gifted-elegance-main.vercel.app/og-image.jpg" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState([5000]);
  const [minRating, setMinRating] = useState(0);
  const [ageGroup, setAgeGroup] = useState<string>("all");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (ageGroup === "all" || p.ageGroup === ageGroup) &&
        p.price <= price[0]! &&
        p.rating >= minRating &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, price, minRating, ageGroup, query, sort]);

  const setCategory = (slug?: string) => navigate({ search: { category: slug } });

  const filters = (
    <div className="space-y-8">
      {/* Age Group Filter for Toys & Soft Toys */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
          👶 Kids Age Filter
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "✨ All Ages" },
            { id: "baby", label: "🧸 Toddlers (0-3 Yrs)" },
            { id: "kids", label: "🚗 Kids (3-8 Yrs)" },
            { id: "teens", label: "🎮 Big Kids (8-14+ Yrs)" },
          ].map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAgeGroup(a.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                ageGroup === a.id ? "bg-primary text-primary-foreground shadow-glow" : "bg-card hover:bg-secondary border border-border"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.14em]">Category</h3>
        <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
          <button
            onClick={() => setCategory(undefined)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              !category ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-border",
            )}
          >
            All gifts
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                category === c.slug ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-border",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.14em]">Max price</h3>
        <Slider className="mt-6" min={800} max={5000} step={100} value={price} onValueChange={setPrice} />
        <p className="mt-3 text-sm text-muted-foreground">Up to {inr(price[0]!)}</p>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.14em]">Rating</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                minRating === r ? "bg-accent text-accent-foreground" : "bg-secondary hover:bg-border",
              )}
            >
              {r === 0 ? "Any" : <>{r}+</>}
              {r > 0 && <Star className="size-3.5 fill-gold text-gold" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="shell py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold md:text-5xl">
          {category ? categories.find((c) => c.slug === category)?.name : "All"} Gifts
        </h1>
        <p className="mt-3 text-muted-foreground">
          {results.length} curated {results.length === 1 ? "piece" : "pieces"} ready to ship in 24 hours.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gifts..."
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-12 rounded-full border border-border bg-card px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring max-sm:col-span-2"
        >
          <option value="featured">Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={`${v} view`}
              className={cn(
                "grid size-10 place-items-center rounded-full transition-colors",
                view === v && "bg-secondary",
              )}
            >
              {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold lg:hidden"
        >
          {filtersOpen ? <X className="size-4" /> : <SlidersHorizontal className="size-4" />} Filters
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">{filters}</aside>
        {filtersOpen && (
          <motion.aside
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden rounded-3xl border border-border bg-card p-6 lg:hidden"
          >
            {filters}
          </motion.aside>
        )}

        <div>
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mx-auto grid size-16 place-items-center rounded-3xl bg-secondary text-primary"
              >
                <Search className="size-7" />
              </motion.div>
              <h2 className="mt-6 text-xl font-bold">No gifts match those filters</h2>
              <p className="mt-2 text-sm text-muted-foreground">Try widening the price range or clearing search.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setPrice([5000]);
                  setMinRating(0);
                  setCategory(undefined);
                }}
                className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
              >
                Reset filters
              </button>
            </motion.div>
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="group grid grid-cols-[100px_minmax(0,1fr)] items-center gap-5 rounded-3xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift sm:grid-cols-[140px_minmax(0,1fr)]"
                  >
                    <div className="aspect-square overflow-hidden rounded-2xl bg-surface">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={800}
                        height={800}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs capitalize text-muted-foreground">
                        {typeof p.category === "object" ? (p.category as any)?.name || (p.category as any)?.slug?.replace("-", " ") : String(p.category || "").replace("-", " ")}
                      </p>
                      <h3 className="mt-1 truncate text-lg font-bold group-hover:text-primary">{p.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                      <p className="mt-3 text-lg font-extrabold">{inr(p.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
