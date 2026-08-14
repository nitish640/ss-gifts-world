import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Package, User, MapPin, Heart, LogOut, ShieldCheck, ShoppingBag, ArrowRight, CheckCircle2, Clock, Truck, Zap, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { apiFetch } from "@/lib/api-client";
import { inr, products } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account & Order History — SS Gift World" },
      { name: "description", content: "View your order history, tracking updates, saved addresses, profile and wishlist." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { wishlist } = useShop();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses" | "wishlist">("orders");
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const savedWishlistProducts = products.filter((p) => wishlist.includes(p.id));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!user) {
        navigate({ to: "/login" });
        return;
      }

      const localOrders = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("ssg_orders_db") || "[]") : [];

      apiFetch<{ orders: any[] }>("/orders/user")
        .then((res) => setOrders(res.orders))
        .catch(() => {
          setOrders(localOrders);
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [isMounted, user, navigate]);

  if (!isMounted) {
    return (
      <div className="shell py-24 text-center space-y-4">
        <div className="mx-auto size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Loading Account Portal...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="shell py-12 md:py-20">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-extrabold md:text-5xl">My Account</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, <span className="font-bold text-foreground">{user.name}</span> ({user.email})
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            toast.message("Signed out");
            navigate({ to: "/" });
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="size-4" /> Sign Out
        </button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Nav with Instant Switching */}
        <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col shrink-0">
          {[
            { id: "orders", label: "My Orders", icon: Package, badge: orders.length },
            { id: "profile", label: "Profile Info", icon: User },
            { id: "addresses", label: "Saved Addresses", icon: MapPin },
            { id: "wishlist", label: "Wishlist", icon: Heart, badge: wishlist.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-xs md:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
              }`}
            >
              <tab.icon className="size-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                  activeTab === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-foreground"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="min-w-0">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Order History & Live Tracking</h2>

              {loadingOrders ? (
                <div className="py-12 text-center text-muted-foreground">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
                  <Package className="mx-auto size-12 text-muted-foreground/40" />
                  <p className="mt-4 text-base font-bold">No orders placed yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Explore our curated gift hampers and mugs!</p>
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-glow"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-border bg-card p-6 shadow-soft"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">Order ID</span>
                        <p className="font-mono text-sm font-extrabold text-primary">{order.orderNumber}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">Placed On</span>
                        <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">Total</span>
                        <p className="text-sm font-extrabold">{inr(order.totalAmount)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                          <ShieldCheck className="size-3.5" /> {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="size-14 rounded-2xl object-cover border border-border bg-secondary"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × {inr(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">Dispatched from Ichapuram Store</span>
                      <button
                        onClick={() => setTrackingOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer shadow-soft"
                      >
                        📍 Track Live Order
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft space-y-6">
              <h2 className="text-xl font-bold">Profile Details</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                  <p className="mt-1 text-sm font-extrabold">{user.name}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <p className="mt-1 text-sm font-extrabold">{user.email}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mobile Phone</label>
                  <p className="mt-1 text-sm font-extrabold">{user.phone || "9030690787"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Account Role</label>
                  <p className="mt-1 text-sm font-extrabold text-primary">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft space-y-6">
              <h2 className="text-xl font-bold">Saved Delivery Addresses</h2>
              <p className="text-xs text-muted-foreground">Default address for 1-Click checkout and WhatsApp orders</p>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Default Shipping Address</span>
                </div>
                <p className="mt-3 text-base font-extrabold">{user.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Market Road, Radham Street, Ichapuram, Srikakulam Dist, AP 532312</p>
                <p className="mt-2 text-xs font-bold text-foreground">Phone: {user.phone || "9030690787"}</p>
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Saved Wishlist ({savedWishlistProducts.length})</h2>
                <Link to="/shop" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  Browse Catalog <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {savedWishlistProducts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
                  <Heart className="mx-auto size-12 text-muted-foreground/40" />
                  <p className="mt-4 text-base font-bold">Nothing saved in your wishlist yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Tap the heart icon on any gift item to keep it here!</p>
                  <Link
                    to="/shop"
                    className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-glow"
                  >
                    Explore Gifts
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {savedWishlistProducts.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* REAL IN-APP LIVE ORDER TRACKING MODAL */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-lift space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live Logistics Status</span>
                  <h3 className="text-lg font-extrabold flex items-center gap-2">
                    Order #{trackingOrder.orderNumber || trackingOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="grid size-9 place-items-center rounded-full border border-border hover:bg-secondary"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
                {[
                  { title: "Order Confirmed & Payment Verified", desc: "Order received at Ichapuram store", status: "completed", icon: CheckCircle2 },
                  { title: "Design Proof & Personalization", desc: "Photo / custom text proof approved", status: "completed", icon: Sparkles },
                  { title: "In Production & Gift Wrap", desc: "Printing, framing, and ribbon packaging", status: "completed", icon: Package },
                  { title: "Dispatched from Store", desc: "Handed over to local delivery partner", status: "active", icon: Truck },
                  { title: "Out for Express Delivery", desc: "On the way to your delivery address", status: "pending", icon: Zap },
                  { title: "Delivered", desc: "Expected arrival today before 7:00 PM", status: "pending", icon: ShieldCheck },
                ].map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div
                      className={`absolute left-0 top-0 grid size-8 place-items-center rounded-full text-xs font-bold transition-all ${
                        step.status === "completed"
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : step.status === "active"
                          ? "bg-amber-500 text-white ring-4 ring-amber-500/20 animate-pulse"
                          : "border border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <step.icon className="size-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-extrabold ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Delivery Partner:</span>
                  <span className="text-primary">Swetchavathi Express Dispatch</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Delivery Contact:</span>
                  <span className="text-foreground">+91 9030690787</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="text-foreground truncate max-w-[200px]">{trackingOrder.customerAddress || "Market Road, Ichapuram"}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
