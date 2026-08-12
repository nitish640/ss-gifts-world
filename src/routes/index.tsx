import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Gift,
  Headphones,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import hero from "@/assets/hero-gifts.jpg";
import { categories, faqs, inr, products, testimonials } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SS Gift World — Premium Curated Gifts, Delivered Beautifully" },
      {
        name: "description",
        content:
          "Shop luxury gift hampers, fresh flowers, chocolates and personalised gifts. Signature packaging, 24-hour dispatch and free handwritten notes across India.",
      },
      { property: "og:title", content: "SS Gift World — Premium Curated Gifts" },
      {
        property: "og:description",
        content: "Luxury curated gifting for birthdays, weddings, anniversaries and corporate occasions.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <WhyUs />
      <Trending />
      <OfferBanner />
      <Testimonials />
      <Faq />
      <Newsletter />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-40 size-[26rem] rounded-full bg-gold/15 blur-3xl" />

      <div className="shell grid items-center gap-12 pb-16 pt-12 md:pb-28 md:pt-20 lg:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold shadow-soft"
          >
            <Sparkles className="size-3.5 text-primary" />
            ⚡ 60-Minute Express Local Delivery in Ichapuram
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-balance-tight text-[2.6rem] font-extrabold leading-[1.05] md:text-6xl lg:text-[4.1rem]"
          >
            Gifts that feel <span className="text-primary">unforgettable</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Hand-assembled hampers, fresh blooms and personalised keepsakes — finished with signature packaging and a
            handwritten note, every single time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-glow"
              >
                Shop Now <ArrowRight className="size-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-bold shadow-soft"
              >
                Explore Categories
              </a>
            </motion.div>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6"
          >
            {[
              ["12k+", "Gifts delivered"],
              ["4.9", "Average rating"],
              ["24h", "Dispatch time"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-extrabold">{v}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div style={{ y }} className="relative">
          <Link to="/shop" className="group block overflow-hidden rounded-[2rem] border border-border bg-card shadow-lift cursor-pointer">
            <motion.img
              style={{ scale }}
              src={hero}
              alt="Premium wrapped gift boxes with satin ribbons"
              width={1408}
              height={1408}
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-2 top-8 flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-lift backdrop-blur md:-left-8"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Gift className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Free gift wrap</p>
              <p className="text-xs text-muted-foreground">On every order</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -right-2 bottom-10 flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-lift backdrop-blur md:-right-8"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-gold/20 text-gold">
              <Star className="size-5 fill-gold" />
            </span>
            <div>
              <p className="text-sm font-bold">4.9 / 5</p>
              <p className="text-xs text-muted-foreground">2,400+ reviews</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="section-pad bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow="Categories"
          title="Find the perfect occasion"
          subtitle="Eight curated collections, each styled by our team so you never have to second-guess a gift again."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
            >
              <Link
                to="/shop"
                search={{ category: c.slug }}
                className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.count} gifts</p>
                  </div>
                  <motion.span
                    whileHover={{ rotate: 12 }}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <ArrowRight className="size-4" />
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="section-pad">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Featured"
            title="Loved by thousands"
            subtitle="Our most gifted pieces this season."
          />
          <Reveal>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const perks = [
  { icon: Truck, title: "Fast Delivery", text: "Same-day dispatch in metros, tracked all the way." },
  { icon: BadgeCheck, title: "Best Quality", text: "Every hamper is inspected before it leaves us." },
  { icon: ShieldCheck, title: "Secure Payment", text: "256-bit encrypted checkout, all methods accepted." },
  { icon: Package, title: "Premium Packaging", text: "Rigid boxes, satin ribbon and a handwritten note." },
  { icon: Star, title: "Trusted Store", text: "12,000+ gifts delivered with a 4.9 average rating." },
  { icon: Headphones, title: "24/7 Support", text: "Real humans on WhatsApp, call and email." },
];

function WhyUs() {
  return (
    <section className="section-pad bg-surface">
      <div className="shell">
        <SectionHeading eyebrow="Why SS Gift World" title="Premium in every detail" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-lift"
            >
              <motion.span
                whileHover={{ rotate: -10, scale: 1.08 }}
                className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"
              >
                <p.icon className="size-5" />
              </motion.span>
              <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trending() {
  const list = [...products.slice(8), ...products.slice(8)];
  return (
    <section className="section-pad overflow-hidden">
      <div className="shell">
        <SectionHeading eyebrow="Trending now" title="Moving fast this week" />
      </div>
      <div className="group mt-12 overflow-hidden">
        <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
          {list.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              to="/product/$id"
              params={{ id: p.id }}
              className="w-64 shrink-0 overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="aspect-square overflow-hidden bg-surface">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="size-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-bold">{p.name}</p>
                <p className="mt-1 text-sm font-extrabold text-primary">{inr(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferBanner() {
  const [t, setT] = useState({ h: 12, m: 45, s: 30 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let { h, m, s } = p;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) return { h: 23, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="section-pad">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-accent px-7 py-14 text-accent-foreground md:px-16 md:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
                  <Clock className="size-3.5" /> Limited offer
                </span>
                <h2 className="mt-6 text-3xl font-extrabold md:text-5xl">Flat 25% off festive hampers</h2>
                <p className="mt-4 max-w-md text-sm opacity-80 md:text-base">
                  Ends tonight. Applied automatically on all curated hampers above {inr(1499)}.
                </p>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="mt-8 inline-block">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground"
                  >
                    Claim the offer <ArrowRight className="size-4" />
                  </Link>
                </motion.div>
              </div>
              <div className="flex gap-3">
                {[
                  ["Hours", pad(t.h)],
                  ["Minutes", pad(t.m)],
                  ["Seconds", pad(t.s)],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex-1 rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur"
                  >
                    <p className="font-display text-3xl font-extrabold tabular-nums md:text-4xl">{val}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-widest opacity-70">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[i]!;

  return (
    <section className="section-pad bg-surface">
      <div className="shell">
        <SectionHeading eyebrow="Testimonials" title="What our customers say" />
        <div className="mx-auto mt-12 max-w-3xl">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft md:p-12"
          >
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="size-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="mt-6 text-lg leading-relaxed md:text-xl">“{t.text}”</p>
            <footer className="mt-8 flex items-center justify-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                {t.name.charAt(0)}
              </span>
              <div className="text-left">
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.city}</p>
              </div>
            </footer>
          </motion.blockquote>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, d) => (
              <button
                key={d}
                onClick={() => setI(d)}
                aria-label={`Testimonial ${d + 1}`}
                className={`h-2 rounded-full transition-all ${d === i ? "w-8 bg-primary" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section-pad">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading align="left" eyebrow="FAQ" title="Good to know before you gift" />
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`i-${i}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-base font-bold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="section-pad bg-surface">
      <div className="shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">Get 10% off your first gift</h2>
          <p className="mt-4 text-muted-foreground">
            Occasion reminders, new drops and private offers. No spam, ever.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("You're on the list", { description: "Your 10% code is on its way." });
              setEmail("");
            }}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-14 flex-1 rounded-full border border-border bg-card px-6 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="h-14 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Subscribe
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
