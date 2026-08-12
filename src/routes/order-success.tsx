import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, MessageCircle, ArrowRight, Printer } from "lucide-react";
import { shop, waLink } from "@/data/shop-info";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — SS Gift World" },
      { name: "description", content: "Thank you for shopping at SS Gift World!" },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="shell py-16 text-center md:py-24">
      <div className="mx-auto max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shadow-glow"
        >
          <CheckCircle2 className="size-10" />
        </motion.div>

        <h1 className="mt-6 text-3xl font-extrabold md:text-4xl">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for choosing {shop.name}. Our gift stylists are processing your order.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft text-left space-y-4">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-xs text-muted-foreground">Status</span>
            <span className="text-xs font-bold text-emerald-600">CONFIRMED</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-xs text-muted-foreground">Store Address</span>
            <span className="text-xs font-bold text-right">{shop.address.line1}, Ichapuram</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Store Support</span>
            <span className="text-xs font-bold">{shop.phones[0]}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={waLink("Hi SSG Gift World, I just placed an order and would like an update!")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 text-xs font-bold text-white shadow-glow"
          >
            <MessageCircle className="size-4" /> Track on WhatsApp
          </motion.a>

          <button
            onClick={handlePrint}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-xs font-bold hover:bg-secondary"
          >
            <Printer className="size-4" /> Print Invoice
          </button>
        </div>

        <div className="mt-8">
          <Link to="/shop" className="text-xs font-bold text-primary hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
