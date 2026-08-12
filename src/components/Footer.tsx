import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Facebook, Gift, Instagram, Mail, MapPin, MessageCircle, Phone, Twitter } from "lucide-react";
import { categories } from "@/data/catalog";
import { shop, waLink } from "@/data/shop-info";


export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-border bg-card"
    >
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Gift className="size-5" />
            </span>
            <span className="font-display text-lg font-extrabold">
              SSG <span className="text-primary">Gift World</span>
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold">{shop.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            All types of gift items — mug printing, photo frames, birthday gifts, soft toys, balloons, toys and event
            items. Proprietor: {shop.owner}.
          </p>

          <div className="mt-6 flex gap-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -3, scale: 1.06 }}
                aria-label="Social profile"
                className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </motion.a>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links">
          {[
            { to: "/shop", label: "Shop All" },
            { to: "/about", label: "About Us" },
            { to: "/contact", label: "Contact" },
            { to: "/wishlist", label: "Wishlist" },
            { to: "/cart", label: "Your Bag" },
          ].map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="transition-colors hover:text-primary">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Categories">
          {categories.slice(0, 6).map((c) => (
            <li key={c.slug}>
              <Link to="/shop" search={{ category: c.slug }} className="transition-colors hover:text-primary">
                {c.name}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Contact">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <a href={shop.map.directions} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              {shop.address.line1}, {shop.address.line2}
            </a>
          </li>
          {shop.phones.map((p) => (
            <li key={p} className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-primary">
                {p}
              </a>
            </li>
          ))}
          <li className="flex gap-3">
            <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              Chat on WhatsApp
            </a>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-primary" /> {shop.email}
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-border">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {shop.name} (SSG). All rights reserved.
          </p>
          <p>Ichapuram, Srikakulam Dist, Andhra Pradesh</p>

        </div>
      </div>
    </motion.footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.14em]">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm text-muted-foreground">{children}</ul>
    </div>
  );
}
