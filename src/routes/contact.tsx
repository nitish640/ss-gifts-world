import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { faqs } from "@/data/catalog";
import { shop, waLink } from "@/data/shop-info";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SSG Gift World, Ichapuram — WhatsApp & Store Location" },
      {
        name: "description",
        content:
          "WhatsApp or call Sri Swetchavathi Gift World, Market Road, Radham Street, Ichapuram 532312 for mug printing, frames and event items.",
      },
      { property: "og:title", content: "Contact SSG Gift World, Ichapuram" },
      { property: "og:description", content: "WhatsApp us or find our store on the map in Ichapuram, Srikakulam." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  return (
    <>
      <section className="shell py-14 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold md:text-6xl">Let's plan the perfect gift</h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {shop.name} (SSG) — mug printing, photo frames, birthday gifts and event items. Message us on WhatsApp with
            your photo and we'll send a design preview before printing.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={shop.map.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-bold hover:bg-secondary"
            >
              <Navigation className="size-4" /> Get live directions
            </motion.a>
          </div>
        </div>


        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSending(true);
                setTimeout(() => {
                  setSending(false);
                  toast.success("Message sent", { description: "We'll get back to you within a day." });
                  (e.target as HTMLFormElement).reset();
                }, 900);
              }}
              className="rounded-[2rem] border border-border bg-card p-7 shadow-soft md:p-10"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" placeholder="Your name" />
                <Field label="Phone" name="phone" placeholder="+91 00000 00000" />
              </div>
              <div className="mt-4">
                <Field label="Email" name="email" type="email" placeholder="you@email.com" />
              </div>
              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us about the occasion, quantity and budget..."
                  className="mt-2 w-full resize-none rounded-3xl border border-border bg-background p-5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={sending}
                className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-70"
              >
                {sending ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    className="size-4 rounded-full border-2 border-current border-t-transparent"
                  />
                ) : (
                  <>
                    Send message <Send className="size-4" />
                  </>
                )}
              </motion.button>
            </form>
          </Reveal>

          <div className="space-y-4">
            {[
              {
                icon: Phone,
                title: "Call us",
                text: shop.phones.join("  ·  "),
                sub: shop.hours,
                href: `tel:${shop.phones[0].replace(/\s/g, "")}`,
              },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                text: shop.phones[0],
                sub: "Fastest response — send your photo or design",
                href: waLink(),
              },
              { icon: Mail, title: "Email", text: shop.email, sub: "Replies within a day", href: `mailto:${shop.email}` },
              {
                icon: MapPin,
                title: "Store",
                text: `${shop.address.line1}, ${shop.address.line2}`,
                sub: "Walk-ins welcome",
                href: shop.map.directions,
              },
              { icon: Clock, title: "Working hours", text: "9:30 – 21:30", sub: "Open all days" },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <motion.a
                  href={c.href ?? undefined}
                  target={c.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  className="flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <c.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{c.title}</p>
                    <p className="mt-1 break-words text-sm text-muted-foreground">{c.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-[2rem] border border-border shadow-soft">
            <iframe
              title={`${shop.name} location — Ichapuram`}
              src={shop.map.embed}
              className="h-[360px] w-full"
              loading="lazy"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-6 py-4">
              <p className="text-sm text-muted-foreground">{shop.address.full}</p>
              <a
                href={shop.map.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground"
              >
                <Navigation className="size-4" /> Open live location
              </a>
            </div>
          </div>
        </Reveal>

      </section>

      <section className="section-pad bg-surface">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading align="left" eyebrow="FAQ" title="Quick answers" />
          <Reveal>
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`c-${i}`} className="border-b border-border">
                  <AccordionTrigger className="text-left text-base font-bold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 h-14 w-full rounded-full border border-border bg-background px-5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
