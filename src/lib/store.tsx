import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products, type Product } from "@/data/catalog";

type CartLine = { id: string; qty: number };

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  cartCount: number;
  subtotal: number;
  cartItems: { product: Product; qty: number }[];
};

const ShopCtx = createContext<ShopState | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setCart(read<CartLine[]>("ssg-cart", []));
    setWishlist(read<string[]>("ssg-wish", []));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("ssg-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("ssg-wish", JSON.stringify(wishlist));
  }, [wishlist]);

  const add = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id);
      return found ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...prev, { id, qty }];
    });
    toast.success("Added to bag", { description: products.find((p) => p.id === id)?.name });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const remove = useCallback((id: string) => setCart((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      toast[has ? "message" : "success"](has ? "Removed from wishlist" : "Saved to wishlist");
      return has ? prev.filter((w) => w !== id) : [...prev, id];
    });
  }, []);

  const cartItems = useMemo(
    () =>
      cart
        .map((l) => ({ product: products.find((p) => p.id === l.id)!, qty: l.qty }))
        .filter((l) => Boolean(l.product)),
    [cart],
  );

  const value: ShopState = {
    cart,
    wishlist,
    add,
    setQty,
    remove,
    clear,
    toggleWish,
    cartCount: cart.reduce((s, l) => s + l.qty, 0),
    subtotal: cartItems.reduce((s, l) => s + l.product.price * l.qty, 0),
    cartItems,
  };

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
