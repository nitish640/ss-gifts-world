import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Gift, Heart, Menu, Moon, Search, ShoppingBag, Sun, User, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { cartCount, wishlist } = useShop();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > prev && y > 180 && !open);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("fixed inset-x-0 top-0 z-50 transition-shadow", scrolled ? "glass shadow-soft" : "bg-transparent")}
    >
      <nav className="shell grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <motion.span
            whileHover={{ rotate: -8, scale: 1.06 }}
            className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow"
          >
            <Gift className="size-5" />
          </motion.span>
          <span className="min-w-0 truncate">
            <span className="block truncate font-display text-lg font-extrabold leading-tight tracking-tight">
              SSG <span className="text-primary">Gift World</span>
            </span>
            <span className="hidden truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Sri Swetchavathi
            </span>
          </span>
        </Link>

        <div className="hidden items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
              {pathname === l.to && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-secondary"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20"
            >
              Admin Panel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/shop"
            aria-label="Search gifts"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
          >
            <Search className="size-[18px]" />
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>

          <Link
            to={user ? (user.role === "ADMIN" ? "/admin" : "/account") : "/login"}
            aria-label="Account"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary text-foreground"
          >
            {user?.role === "ADMIN" ? <ShieldCheck className="size-[18px] text-primary" /> : <User className="size-[18px]" />}
          </Link>

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
          >
            <Heart className="size-[18px]" />
            {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping bag"
            className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="size-[18px]" />
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="shell flex flex-col py-3">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-semibold hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to={user ? "/account" : "/login"}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base font-semibold text-primary hover:bg-secondary"
              >
                {user ? `Account (${user.name})` : "Customer Sign In"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      key={String(children)}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-[18px] text-primary-foreground"
    >
      {children}
    </motion.span>
  );
}
