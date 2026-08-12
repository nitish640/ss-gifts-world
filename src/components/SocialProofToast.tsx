import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Sparkles, CheckCircle2 } from "lucide-react";
import { products, inr } from "@/data/catalog";

const sampleNames = ["Ramesh K.", "Swetha A.", "Bujji Achary", "Kiran P.", "Divya N.", "Manoj R.", "Pooja V."];
const sampleLocations = ["Market Road, Ichapuram", "Radham Street, Ichapuram", "Near Station Road, Ichapuram", "Bellupada", "Kanchili"];

export function SocialProofToast() {
  const [currentNotification, setCurrentNotification] = useState<{
    name: string;
    location: string;
    productName: string;
    productImage: string;
    timeAgo: string;
  } | null>(null);

  useEffect(() => {
    const triggerRandomToast = () => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomLoc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
      const minutesAgo = Math.floor(Math.random() * 12) + 2;

      setCurrentNotification({
        name: randomName,
        location: randomLoc,
        productName: randomProduct.name,
        productImage: randomProduct.image,
        timeAgo: `${minutesAgo} mins ago`,
      });

      // Hide notification after 6 seconds
      setTimeout(() => {
        setCurrentNotification(null);
      }, 6000);
    };

    // First toast after 10 seconds, then every 35 seconds
    const initialTimer = setTimeout(triggerRandomToast, 10000);
    const interval = setInterval(triggerRandomToast, 35000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3.5 shadow-lift backdrop-blur max-w-xs"
        >
          <img
            src={currentNotification.productImage}
            alt={currentNotification.productName}
            className="size-12 rounded-xl object-cover border border-border bg-secondary shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <CheckCircle2 className="size-3" /> Recent Order Verified
            </div>
            <p className="truncate text-xs font-extrabold text-foreground">{currentNotification.productName}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              <span className="font-bold text-foreground">{currentNotification.name}</span> · {currentNotification.location}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
