import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, MessageCircle, ShieldCheck, CreditCard, Zap, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { inr, products } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { ProductCard } from "@/components/ProductCard";
import { shop, waLink } from "@/data/shop-info";
import { apiFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag & Checkout — SS Gift World" },
      { name: "description", content: "Review your curated gifts, apply coupons and order via WhatsApp or online payment." },
      { property: "og:title", content: "Your Bag — SS Gift World" },
    ],
  }),
  component: Cart,
});

const FREE_SHIP = 1999;

function Cart() {
  const { cartItems, setQty, remove, add, subtotal, clear } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Delivery Speed State: STANDARD (1-2 days) vs EXPRESS (60 mins, +₹50)
  const [deliverySpeed, setDeliverySpeed] = useState<"STANDARD" | "EXPRESS">("STANDARD");

  // Customer Checkout Details - Auto-filled from user profile
  const [custName, setCustName] = useState(user?.name || "");
  const [custPhone, setCustPhone] = useState(user?.phone || "9030690787");
  const [custAddress, setCustAddress] = useState("Market Road, Radham Street, Ichapuram 532312");
  const [payMethod, setPayMethod] = useState<"WHATSAPP" | "COD" | "RAZORPAY">("WHATSAPP");

  useEffect(() => {
    if (user) {
      setCustName(user.name);
      if (user.phone) setCustPhone(user.phone);
    }
  }, [user]);

  // Suggested add-ons below cart products
  const suggestedAddons = products
    .filter((p) => !cartItems.some((item) => item.product.id === p.id))
    .slice(0, 3);

  // Phone number handler restricting strictly to 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setCustPhone(digitsOnly);
  };

  const baseShipping = 0; // Standard delivery has no extra cost (FREE)
  const expressFee = deliverySpeed === "EXPRESS" ? 50 : 0;
  const totalShipping = baseShipping + expressFee;
  const total = Math.max(0, subtotal - discount) + totalShipping;
  const progress = Math.min(100, (subtotal / FREE_SHIP) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;

    setLoadingCoupon(true);
    try {
      const res = await apiFetch<{ valid: boolean; discount: number; message: string }>("/coupons/verify", {
        method: "POST",
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      setDiscount(res.discount);
      setAppliedCoupon(coupon.toUpperCase());
      toast.success("Coupon Applied!", { description: res.message });
    } catch (err: any) {
      if (coupon.trim().toUpperCase() === "GIFT10" || coupon.trim().toUpperCase() === "WELCOME10") {
        const disc = Math.round(subtotal * 0.1);
        setDiscount(disc);
        setAppliedCoupon(coupon.toUpperCase());
        toast.success("10% Coupon Applied!", { description: `Saved ₹${disc}` });
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        toast.error(err.message || "Invalid coupon code.");
      }
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Customer Sign In Required!", { description: "Please log in to complete your order checkout." });
      navigate({ to: "/login" });
      return;
    }

    const finalName = user.name || custName || "Customer";
    const finalPhone = user.phone || custPhone || "9030690787";

    setPlacingOrder(true);
    const orderId = `SSG-${Date.now().toString().slice(-6)}`;

    const newOrderObj = {
      id: `ord-${Date.now()}`,
      orderNumber: orderId,
      customerName: finalName,
      customerPhone: finalPhone,
      shippingAddress: { line1: custAddress },
      paymentMethod: payMethod,
      deliverySpeed,
      items: cartItems.map((item) => ({
        productName: item.product.name,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.qty,
      })),
      subtotal,
      discountAmount: discount,
      shippingFee: totalShipping,
      totalAmount: total,
      orderStatus: "CONFIRMED",
      paymentStatus: "PAID",
      createdAt: new Date().toISOString(),
    };

    try {
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(newOrderObj),
      });
    } catch {
      // Proceed gracefully offline
    }

    // Persist to local database for real-time admin sales analytics
    const existingOrders = JSON.parse(localStorage.getItem("ssg_orders_db") || "[]");
    localStorage.setItem("ssg_orders_db", JSON.stringify([newOrderObj, ...existingOrders]));

    // Structured WhatsApp order message
    const itemSummary = cartItems
      .map((i, idx) => `${idx + 1}. *${i.product.name}* x${i.qty} — ₹${i.product.price * i.qty}`)
      .join("\n");

    const deliverySpeedText = deliverySpeed === "EXPRESS" ? "⚡ Express 60-Minute Delivery (+₹50 Extra)" : "🚚 Standard Shipping (1 - 2 Days)";

    const waMsg = `🛍️ *NEW ORDER FROM WEBSITE — SS GIFT WORLD*
---------------------------------------
📋 *Order ID*: ${orderId}
👤 *Customer*: ${finalName}
📞 *Phone*: ${finalPhone}
📍 *Delivery Address*: ${custAddress}
🚀 *Delivery Speed*: ${deliverySpeedText}

🛒 *Ordered Items*:
${itemSummary}

💰 *Subtotal*: ₹${subtotal}
🏷️ *Discount*: ₹${discount}
🚚 *Shipping & Delivery*: ${totalShipping === 0 ? "FREE" : `₹${totalShipping}`}
💵 *TOTAL AMOUNT*: ₹${total}
💳 *Payment Method*: ${payMethod}

Please confirm order availability and dispatch time!`;

    clear();
    setPlacingOrder(false);

    if (payMethod === "WHATSAPP") {
      const targetWaUrl = `https://wa.me/919030690787?text=${encodeURIComponent(waMsg)}`;
      window.open(targetWaUrl, "_blank");
      toast.success("Redirecting to WhatsApp!", { description: "Order pre-filled for 9030690787" });
    } else {
      toast.success("Order Placed Successfully!");
    }

    navigate({ to: "/order-success" });
  };

  if (cartItems.length === 0) {
    return (
      <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid size-20 place-items-center rounded-3xl bg-secondary text-muted-foreground shadow-inner"
        >
          <ShoppingBag className="size-9" />
        </motion.div>
        <h1 className="mt-6 text-2xl font-extrabold md:text-3xl">Your Shopping Bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Explore our handcrafted mug prints, photo frames & personalized gifts.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-xs font-bold text-primary-foreground shadow-glow"
        >
          Start Shopping <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 md:py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold md:text-4xl">Review Your Order Bag</h1>
        <p className="text-xs text-muted-foreground">{cartItems.length} unique items ready for dispatch from Ichapuram store.</p>
      </div>

      {!user && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-semibold text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>You are not signed in. Please sign in to your customer account to complete checkout.</span>
          </div>
          <Link to="/login" className="rounded-full bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-soft shrink-0">
            Sign In Now
          </Link>
        </div>
      )}

      {/* Free shipping meter */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2">
            <Truck className="size-4 text-primary" />
            {subtotal >= FREE_SHIP ? "🎉 You've unlocked FREE Standard Shipping!" : `Add ${inr(FREE_SHIP - subtotal)} more for FREE Standard Shipping`}
          </span>
          <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
        </div>
        <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Cart items list + Recommended Add-ons */}
        <div className="space-y-8">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cartItems.map(({ product, qty }) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft sm:grid-cols-[110px_minmax(0,1fr)_auto]"
                >
                  <Link to="/product/$id" params={{ id: product.id }} className="overflow-hidden rounded-2xl bg-surface">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="aspect-square w-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <p className="text-xs capitalize text-muted-foreground">{product.category}</p>
                    <h2 className="mt-1 truncate font-bold">{product.name}</h2>
                    <p className="mt-1 font-extrabold">{inr(product.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-border p-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Minus className="size-3.5" />
                        </motion.button>
                        <span className="w-6 text-center text-xs font-bold">{qty}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Plus className="size-3.5" />
                        </motion.button>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary"
                      >
                        <Trash2 className="size-4" />
                      </motion.button>
                    </div>
                  </div>
                  <p className="hidden font-display text-lg font-extrabold sm:block">{inr(product.price * qty)}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={clear} className="text-xs font-semibold text-muted-foreground hover:text-primary">
              Clear bag
            </button>
          </div>

          {/* FREQUENTLY BOUGHT TOGETHER / RECOMMENDED ADD-ONS BELOW PRODUCTS */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-base font-extrabold">Frequently Bought Together</h2>
                <p className="text-xs text-muted-foreground">Popular gift add-ons you can add with 1-click</p>
              </div>
              <Sparkles className="size-5 text-primary" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {suggestedAddons.map((p) => (
                <div key={p.id} className="flex flex-col justify-between rounded-2xl border border-border bg-background p-3 shadow-soft">
                  <Link to="/product/$id" params={{ id: p.id }} target="_blank" className="flex flex-col gap-2 group cursor-pointer">
                    <img src={p.image} alt={p.name} className="h-24 w-full rounded-xl object-cover border border-border bg-secondary group-hover:scale-105 transition-transform" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-xs group-hover:text-primary group-hover:underline">{p.name}</p>
                      <p className="mt-0.5 text-xs font-extrabold text-primary">{inr(p.price)}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      add(p.id);
                      toast.success(`Added ${p.name} to order!`);
                    }}
                    className="mt-3 w-full rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground py-1.5 text-[11px] font-bold transition-colors"
                  >
                    + Add to Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary & Customer Checkout panel */}
        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Checkout & Delivery Details</h2>
            {user ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600">
                <CheckCircle2 className="size-3" /> Logged In
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-extrabold text-amber-600">
                Sign In Required
              </span>
            )}
          </div>

          {/* CONFIRMED LOGGED-IN CUSTOMER INFO DISPLAY */}
          {user ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Customer Account Verified
                </span>
              </div>
              <p className="text-sm font-extrabold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                Phone: <span className="font-mono font-bold text-foreground">{user.phone || custPhone || "9030690787"}</span> · {user.email}
              </p>
              <p className="text-xs text-muted-foreground border-t border-emerald-500/20 pt-2 mt-2">
                📍 Delivery Address: <span className="font-semibold text-foreground">{custAddress}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Bujji Achary"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number (10 Digits)</label>
                  <span className="text-[10px] font-mono text-muted-foreground">{custPhone.length}/10</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9030690787"
                  value={custPhone}
                  onChange={handlePhoneChange}
                  className={`mt-1 w-full rounded-2xl border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary ${
                    custPhone.length > 0 && custPhone.length < 10 ? "border-amber-500" : "border-border"
                  }`}
                />
                {custPhone.length > 0 && custPhone.length < 10 && (
                  <p className="mt-1 text-[10px] font-semibold text-amber-600">Please enter a 10-digit phone number</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Delivery Address</label>
                <textarea
                  rows={2}
                  placeholder="Market Road, Radham Street, Ichapuram 532312"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}

          {/* DELIVERY SPEED SELECTION */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Choose Delivery Option</label>
            <div className="mt-2 space-y-2">
              <button
                type="button"
                onClick={() => setDeliverySpeed("STANDARD")}
                className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left text-xs transition-all ${
                  deliverySpeed === "STANDARD"
                    ? "border-primary bg-primary/10 font-bold shadow-sm"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="size-4 text-primary" />
                  <div>
                    <p className="font-bold text-foreground">Standard Delivery</p>
                    <p className="text-[10px] text-muted-foreground">Arrives in 1 - 2 Days (No Extra Cost)</p>
                  </div>
                </div>
                <span className="font-extrabold text-emerald-600">FREE</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliverySpeed("EXPRESS")}
                className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left text-xs transition-all ${
                  deliverySpeed === "EXPRESS"
                    ? "border-amber-500 bg-amber-500/10 font-bold shadow-sm"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="size-4 text-amber-500 fill-amber-500" />
                  <div>
                    <p className="font-bold text-amber-600 dark:text-amber-400">⚡ Express 60-Min Delivery</p>
                    <p className="text-[10px] text-muted-foreground">Dispatched in 60 Mins (Inside Ichapuram & within 5 km radius)</p>
                  </div>
                </div>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">+₹50 Extra</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Payment Method</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPayMethod("WHATSAPP")}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center text-xs font-bold transition-all ${
                  payMethod === "WHATSAPP"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-sm"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                <MessageCircle className="size-4 mb-1" />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("RAZORPAY")}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center text-xs font-bold transition-all ${
                  payMethod === "RAZORPAY"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                <CreditCard className="size-4 mb-1" />
                Online / UPI
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("COD")}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center text-xs font-bold transition-all ${
                  payMethod === "COD"
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                <ShieldCheck className="size-4 mb-1" />
                Pay on Delivery
              </button>
            </div>
          </div>

          {/* Coupon form */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Coupon code (e.g. WELCOME10)"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loadingCoupon}
              className="rounded-2xl bg-secondary px-4 text-xs font-bold hover:bg-muted"
            >
              Apply
            </button>
          </form>

          {appliedCoupon && (
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600">
              <span>Code {appliedCoupon} active</span>
              <span>-₹{discount}</span>
            </div>
          )}

          {/* Pricing summary */}
          <div className="space-y-2 border-t border-border pt-4 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-bold text-foreground">{inr(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{inr(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Standard Shipping</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            {expressFee > 0 && (
              <div className="flex justify-between text-amber-600 font-bold">
                <span>⚡ Express 60-Min Delivery</span>
                <span>+{inr(expressFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold">
              <span>Total Amount</span>
              <span className="text-primary">{inr(total)}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={placingOrder}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {placingOrder ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : user ? (
              payMethod === "WHATSAPP" ? (
                <>
                  <MessageCircle className="size-4" /> Order via WhatsApp (9030690787)
                </>
              ) : (
                <>
                  Proceed to Checkout <ArrowRight className="size-4" />
                </>
              )
            ) : (
              <>
                Sign In to Complete Order <ArrowRight className="size-4" />
              </>
            )}
          </motion.button>
        </aside>
      </div>
    </div>
  );
}
