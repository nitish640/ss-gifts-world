import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Award, Compass, Heart, Sparkles, Target, Users } from "lucide-react";
import hero from "@/assets/hero-gifts.jpg";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { categories } from "@/data/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SS Gift World — Our Gifting Story" },
      {
        name: "description",
        content:
          "From a single storefront to 12,000+ gifts delivered — the people, craft and standards behind SS Gift World.",
      },
      { property: "og:title", content: "About SS Gift World" },
      { property: "og:description", content: "The craft and standards behind every SS Gift World hamper." },
    ],
  }),
  component: About,
});

const timeline = [
  { year: "2016", title: "A single counter", text: "We started wrapping gifts from one small shop in Mumbai." },
  { year: "2019", title: "Studio & atelier", text: "Our in-house styling team and packaging line took shape." },
  { year: "2022", title: "Pan-India delivery", text: "Cold-chain flowers and 24-hour dispatch across 400+ cities." },
  { year: "2026", title: "12,000+ gifts", text: "A 4.9 rating and a growing corporate gifting practice." },
];

function About() {
  return (
    <>
      <section className="shell grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold">
            <Sparkles className="size-3.5 text-primary" /> Our story
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
            Gifting, treated as a <span className="text-primary">craft</span>.
          </h1>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
            SS Gift World began with one belief: a gift should feel considered the moment it's seen. A decade later, we
            still assemble every hamper by hand, inspect it twice, and finish it with the packaging we'd want to
            receive ourselves.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105"
          >
            See the collection
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[2rem] border border-border shadow-lift"
        >
          <img src={hero} alt="Curated gift boxes" width={1408} height={1408} className="aspect-[4/3] w-full object-cover" />
        </motion.div>
      </section>

      <section className="section-pad bg-surface">
        <div className="shell grid gap-5 md:grid-cols-3">
          {[
            { icon: Target, title: "Mission", text: "Make premium gifting effortless, reliable and genuinely personal." },
            { icon: Compass, title: "Vision", text: "Be India's most trusted name for gifts that people remember." },
            { icon: Heart, title: "Values", text: "Craft over volume, honesty over hype, care in every parcel." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-soft">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <c.icon className="size-5" />
                </span>
                <h2 className="mt-5 text-xl font-bold">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="shell">
          <SectionHeading eyebrow="Timeline" title="Ten years of wrapping" />
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <p className="font-display text-3xl font-extrabold text-primary">{t.year}</p>
                  <h3 className="mt-4 font-bold">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="rounded-[2rem] bg-accent p-10 text-accent-foreground">
              <Users className="size-8" />
              <blockquote className="mt-6 text-xl leading-relaxed md:text-2xl">
                “We don't ship boxes. We ship the ten seconds someone spends opening one.”
              </blockquote>
              <p className="mt-6 text-sm opacity-75">Sohail S. — Founder, SS Gift World</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.slice(0, 6).map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.05}>
                <motion.div whileHover={{ y: -6 }} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="shell grid gap-5 sm:grid-cols-3">
          {[
            ["12,000+", "Gifts delivered"],
            ["400+", "Cities served"],
            ["4.9 / 5", "Customer rating"],
          ].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.08}>
              <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
                <Award className="mx-auto size-6 text-primary" />
                <p className="mt-4 font-display text-3xl font-extrabold">{v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
