import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Tag,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sparkles,
  IndianRupee,
  Search,
  Upload,
  Image as ImageIcon,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { apiFetch } from "@/lib/api-client";
import { inr, products as initialProducts } from "@/data/catalog";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Management Dashboard — SS Gift World" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"orders" | "overview" | "products" | "coupons" | "inventory">("orders");
  const [analytics, setAnalytics] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>(initialProducts);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([
    { id: "c1", code: "WELCOME10", type: "PERCENTAGE", value: 10, minPurchase: 499, usageLimit: 100, usedCount: 14, expiryDate: "2026-12-31", isActive: true },
    { id: "c2", code: "FESTIVE200", type: "FLAT", value: 200, minPurchase: 1499, usageLimit: 50, usedCount: 8, expiryDate: "2026-09-30", isActive: true },
    { id: "c3", code: "EXPRESS60", type: "FLAT", value: 100, minPurchase: 999, usageLimit: 30, usedCount: 5, expiryDate: "2026-08-31", isActive: true },
  ]);

  const [customersList, setCustomersList] = useState<any[]>([]);

  // Modals & form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [productSearch, setProductSearch] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: "mug-printing",
    price: "",
    oldPrice: "",
    stock: "15",
    tag: "",
    description: "",
    image: "/assets/p-mug.jpg",
  });

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "10",
    minPurchase: "500",
    usageLimit: "50",
    expiryDate: "2026-12-31",
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!user || user.role !== "ADMIN") {
        navigate({ to: "/admin/login" });
        return;
      }
      loadDashboardData();
    }
  }, [isMounted, user, navigate]);

  const loadDashboardData = () => {
    if (typeof window === "undefined") return;
    const localOrders = JSON.parse(localStorage.getItem("ssg_orders_db") || "[]");
    setOrdersList(localOrders);

    const localUsers = JSON.parse(localStorage.getItem("ssg_users_db") || "[]");
    setCustomersList(localUsers);

    const realRevenue = localOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const realOrdersCount = localOrders.length;
    const realCustomerCount = localUsers.length > 0 ? localUsers.length : (localOrders.length > 0 ? new Set(localOrders.map((o: any) => o.customerPhone)).size : 0);

    apiFetch<{ analytics: any }>("/admin/analytics")
      .then((res) => setAnalytics(res.analytics))
      .catch(() => {
        setAnalytics({
          totalOrders: realOrdersCount,
          totalProducts: initialProducts.length,
          totalCustomers: realCustomerCount,
          totalRevenue: realRevenue,
          recentOrders: localOrders.slice(0, 5),
          lowStockProducts: initialProducts.filter((p) => (p.stock || 10) <= 5),
        });
      });

    apiFetch<{ products: any[] }>("/products")
      .then((res) => setProductsList(res.products))
      .catch(() => {});

    apiFetch<{ coupons: any[] }>("/coupons")
      .then((res) => setCouponsList(res.coupons))
      .catch(() => {});
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      if (isEditing) {
        setEditingProduct((prev: any) => {
          const imgs = prev.images && prev.images.length > 0 ? prev.images : [dataUrl];
          imgs[0] = dataUrl;
          return { ...prev, image: dataUrl, images: [...imgs] };
        });
      } else {
        setNewProduct((prev: any) => {
          const imgs = prev.images && prev.images.length > 0 ? prev.images : [dataUrl];
          imgs[0] = dataUrl;
          return { ...prev, image: dataUrl, images: [...imgs] };
        });
      }
      toast.success("Image file selected!", { description: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (isEditing) {
          setEditingProduct((prev: any) => {
            const currentImages = prev.images || (prev.image ? [prev.image] : []);
            return {
              ...prev,
              images: [...currentImages, dataUrl],
              image: currentImages[0] || dataUrl,
            };
          });
        } else {
          setNewProduct((prev: any) => {
            const currentImages = prev.images || (prev.image ? [prev.image] : []);
            return {
              ...prev,
              images: [...currentImages, dataUrl],
              image: currentImages[0] || dataUrl,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    toast.success("Additional product photos added to gallery!");
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
      });
      toast.success("Product created!", { description: newProduct.name });
    } catch (err: any) {
      const created = {
        id: `ssg-custom-${Date.now()}`,
        name: newProduct.name,
        category: newProduct.categoryId,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        stock: Number(newProduct.stock),
        tag: newProduct.tag || undefined,
        image: newProduct.image || "/assets/p-mug.jpg",
        description: newProduct.description || "Handmade gift item",
        rating: 5.0,
        reviews: 1,
      };
      setProductsList((prev) => [created, ...prev]);
      toast.success("Product added successfully!", { description: newProduct.name });
    } finally {
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        categoryId: "mug-printing",
        price: "",
        oldPrice: "",
        stock: "15",
        tag: "",
        description: "",
        image: "/assets/p-mug.jpg",
      });
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await apiFetch(`/admin/products/${editingProduct.id}`, {
        method: "PUT",
        body: JSON.stringify(editingProduct),
      });
    } catch {
      // Local state fallback
    }

    setProductsList((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, ...editingProduct } : p))
    );
    toast.success("Product updated successfully!", { description: editingProduct.name });
    setEditingProduct(null);
  };

  const handleStockCountChange = (productId: string, newStock: number) => {
    const updatedStock = Math.max(0, newStock);
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: updatedStock } : p))
    );
    toast.success("Stock level updated");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
    } catch {
      // Fallback
    }
    toast.success("Product removed from catalog");
    setProductsList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiFetch(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ orderStatus: status }),
      });
    } catch {
      // Fallback local update
    }
    setOrdersList((prev) => {
      const updated = prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: status } : o));
      localStorage.setItem("ssg_orders_db", JSON.stringify(updated));
      return updated;
    });
    toast.success(`Order status updated to ${status}`);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/coupons", {
        method: "POST",
        body: JSON.stringify(newCoupon),
      });
      toast.success("Coupon code created!");
    } catch {
      setCouponsList((prev) => [
        ...prev,
        { id: `c-${Date.now()}`, code: newCoupon.code.toUpperCase(), type: newCoupon.type, value: Number(newCoupon.value), minPurchase: Number(newCoupon.minPurchase), isActive: true },
      ]);
      toast.success("Coupon code created!");
    } finally {
      setShowAddCoupon(false);
      setNewCoupon({ code: "", type: "PERCENTAGE", value: "10", minPurchase: "500" });
    }
  };

  const handleUpdateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    setCouponsList((prev) =>
      prev.map((c) => (c.id === editingCoupon.id ? { ...editingCoupon } : c))
    );
    toast.success("Coupon code updated!", { description: editingCoupon.code });
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setCouponsList((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon code deleted.");
  };

  if (!isMounted) {
    return (
      <div className="shell py-24 text-center space-y-4">
        <div className="mx-auto size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Loading Admin Management Portal...</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") return null;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const salesMap: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  (ordersList || []).forEach((o) => {
    if (!o) return;
    try {
      const dayName = new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", { weekday: "short" });
      if (salesMap[dayName] !== undefined) {
        salesMap[dayName] += Number(o.totalAmount || 0);
      }
    } catch {
      // Ignore invalid date
    }
  });
  const salesData = days.map((day) => ({ day, sales: salesMap[day] || 0 }));
  const getCatName = (cat: any) => {
    if (!cat) return "General";
    if (typeof cat === "string") return cat.replace("-", " ");
    if (typeof cat === "object") return cat.name || cat.slug?.replace("-", " ") || "General";
    return String(cat);
  };

  return (
    <div className="shell py-10 md:py-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold text-primary">Admin Control Center</span>
            <span className="text-xs text-muted-foreground">SS Gift World Ichapuram</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Store Management Portal</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold hover:bg-secondary"
          >
            <RefreshCw className="size-3.5" /> Refresh Data
          </button>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20"
          >
            <LogOut className="size-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {[
          { id: "orders", label: "Orders Fulfillment & Approval", icon: ShoppingCart },
          { id: "customers", label: "Registered Customers & Addresses", icon: Users },
          { id: "overview", label: "Overview & Analytics", icon: BarChart3 },
          { id: "products", label: "Products Catalog", icon: Package },
          { id: "coupons", label: "Discount Coupons", icon: Tag },
          { id: "inventory", label: "Stock Inventory", icon: AlertTriangle },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === t.id
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Overview & Analytics Tab */}
      {activeTab === "overview" && (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <span className="text-xs font-bold text-muted-foreground">Total Store Revenue</span>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                {inr(analytics?.totalRevenue ?? 0)}
              </p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-emerald-600">
                {analytics?.totalRevenue ? "↑ 18% from last week" : "Live Real-Time Store Revenue"}
              </span>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <span className="text-xs font-bold text-muted-foreground">Total Orders</span>
              <p className="mt-2 text-3xl font-extrabold text-primary">{analytics?.totalOrders ?? 0}</p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-muted-foreground">Fulfilled via WhatsApp & COD</span>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <span className="text-xs font-bold text-muted-foreground">Active Products</span>
              <p className="mt-2 text-3xl font-extrabold">{productsList.length}</p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-muted-foreground">Across 8 categories</span>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <span className="text-xs font-bold text-muted-foreground">Low Stock Warnings</span>
              <p className="mt-2 text-3xl font-extrabold text-amber-600">{productsList.filter((p) => (p?.stock || 10) <= 5).length}</p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-amber-600">Items need replenishment</span>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <h3 className="text-lg font-bold">Weekly Sales Performance (₹)</h3>
            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="var(--color-primary, #E53935)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card py-2.5 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowAddProduct(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-glow"
            >
              <Plus className="size-4" /> Add New Product
            </button>
          </div>

          {/* ADD PRODUCT FORM */}
          {showAddProduct && (
            <form onSubmit={handleCreateProduct} className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">Add New Product to Catalog</h3>
                <button type="button" onClick={() => setShowAddProduct(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Personalised Photo Mug"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Category</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  >
                    <option value="mug-printing">Mug Printing</option>
                    <option value="photo-frames">Photo Frames</option>
                    <option value="birthday">Birthday Gifts</option>
                    <option value="event-items">Event Items</option>
                    <option value="soft-toys">Soft Toys</option>
                    <option value="balloons">Balloons & Decor</option>
                    <option value="toys">Kids Toys</option>
                    <option value="customized">Customized Gifts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="399"
                    value={newProduct.oldPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Stock Count</label>
                  <input
                    type="number"
                    required
                    placeholder="15"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Badge / Tag</label>
                  <input
                    type="text"
                    placeholder="Bestseller / Express 60 Mins"
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                {/* FILE UPLOAD PICKER */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Product Image File (Upload from Device)</label>
                  <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
                    <img src={newProduct.image} alt="Preview" className="size-20 rounded-2xl object-cover border border-border bg-background shrink-0 shadow-soft" />
                    <div className="flex-1 text-center sm:text-left">
                      <label className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-glow cursor-pointer hover:scale-105 transition-transform">
                        <Upload className="size-4" /> Upload Image File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-[11px] text-muted-foreground">Select JPG, PNG, WEBP from your device</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground shadow-glow">
                  Save New Product
                </button>
              </div>
            </form>
          )}

          {/* EDIT PRODUCT FORM */}
          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="rounded-3xl border border-primary/40 bg-card p-6 shadow-glow space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-primary">Edit Product: {editingProduct.name}</h3>
                <button type="button" onClick={() => setEditingProduct(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Category</label>
                  <select
                    value={typeof editingProduct.category === "object" ? editingProduct.category.slug || "mug-printing" : editingProduct.category || "mug-printing"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  >
                    <option value="mug-printing">Mug Printing</option>
                    <option value="photo-frames">Photo Frames</option>
                    <option value="birthday">Birthday Gifts</option>
                    <option value="event-items">Event Items</option>
                    <option value="soft-toys">Soft Toys</option>
                    <option value="balloons">Balloons & Decor</option>
                    <option value="toys">Kids Toys</option>
                    <option value="customized">Customized Gifts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Badge / Tag</label>
                  <input
                    type="text"
                    value={editingProduct.tag || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none"
                  />
                </div>

                {/* EDIT FILE UPLOAD PICKER & MULTI-IMAGE GALLERY MANAGER */}
                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase">Main Cover Image (Upload from Device)</label>
                    <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
                      <img src={editingProduct.image || editingProduct.images?.[0]} alt="Preview" className="size-20 rounded-2xl object-cover border border-border bg-background shrink-0 shadow-soft" />
                      <div className="flex-1 text-center sm:text-left">
                        <label className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-glow cursor-pointer hover:scale-105 transition-transform">
                          <Upload className="size-4" /> Change Main Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                        <p className="mt-1 text-[11px] text-muted-foreground">Select main cover image for catalog</p>
                      </div>
                    </div>
                  </div>

                  {/* MULTI-IMAGE GALLERY MANAGER */}
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase">Product Image Gallery (Multiple Thumbnail Angles)</label>
                      <span className="text-xs font-extrabold text-primary">{editingProduct.images?.length || 1} Photos</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {(editingProduct.images || [editingProduct.image]).map((imgUrl: string, idx: number) => (
                        <div key={idx} className="relative group size-20 rounded-2xl overflow-hidden border border-border bg-background shadow-soft">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProduct.images || [editingProduct.image]).filter((_: any, i: number) => i !== idx);
                              setEditingProduct({ ...editingProduct, images: updated, image: updated[0] || editingProduct.image });
                            }}
                            className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}

                      <label className="flex flex-col items-center justify-center size-20 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                        <Plus className="size-5 text-primary" />
                        <span className="text-[9px] font-bold text-primary mt-1">+ Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleMultiImageUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Upload additional photos (angles, packaging, closeups) for customer product detail view!</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground shadow-glow">
                  Update Product Changes
                </button>
              </div>
            </form>
          )}

          {/* Product Data Table */}
          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-secondary/50 font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productsList
                  .filter((p) => p && p.name && p.name.toLowerCase().includes((productSearch || "").toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/20">
                      <td className="p-4 font-bold flex items-center gap-3">
                        <Link to="/product/$id" params={{ id: String(p?.id || "1") }} target="_blank" className="flex items-center gap-3 group">
                          <img src={p.image || p.images?.[0]} alt={p.name} className="size-12 rounded-xl object-cover border border-border bg-secondary group-hover:scale-105 transition-transform" />
                          <div>
                            <p className="font-bold text-sm group-hover:text-primary group-hover:underline">{p.name}</p>
                            {p.tag && <span className="inline-block mt-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{p.tag}</span>}
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium capitalize">{getCatName(p.category)}</td>
                      <td className="p-4 font-extrabold">
                        {inr(p.price)}
                        {p.oldPrice && <span className="ml-1 text-[11px] font-normal text-muted-foreground line-through">{inr(p.oldPrice)}</span>}
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${(p.stock || 10) <= 5 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                          {p.stock || 10} in stock
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setShowAddProduct(false);
                              setEditingProduct(p);
                            }}
                            title="Edit Product"
                            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-bold hover:bg-secondary"
                          >
                            <Edit className="size-3.5 text-primary" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            title="Delete Product"
                            className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Fulfillment & Approval Tab */}
      {activeTab === "orders" && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-extrabold">Customer Orders & Approval Center</h2>
              <p className="text-xs text-muted-foreground">Review incoming customer orders, verify items, and approve for dispatch.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {ordersList.length} Total Orders Recorded
            </span>
          </div>

          {ordersList.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <ShoppingCart className="mx-auto size-12 text-muted-foreground/40" />
              <p className="mt-4 text-base font-bold">No customer orders placed yet</p>
              <p className="mt-1 text-sm text-muted-foreground">When customers place orders at checkout, they will immediately show up here for your approval!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersList.map((o) => (
                <div key={o.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order ID</span>
                      <p className="font-mono text-sm font-extrabold text-primary">{o.orderNumber}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer</span>
                      <p className="text-xs font-bold">{o.customerName}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">📞 {o.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Delivery Speed</span>
                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        {o.deliverySpeed === "EXPRESS" ? "⚡ Express 60-Min (+₹50 Extra)" : "🚚 Standard Shipping (FREE)"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Amount</span>
                      <p className="text-sm font-extrabold text-foreground">{inr(o.totalAmount)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Status</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                          o.orderStatus === "CONFIRMED" || o.orderStatus === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : o.orderStatus === "DISPATCHED"
                            ? "bg-amber-500/10 text-amber-600"
                            : o.orderStatus === "DELIVERED"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-primary/10 text-primary"
                        }`}>
                          <CheckCircle2 className="size-3.5" /> {o.orderStatus || "PENDING"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Address & Payment */}
                  <div className="rounded-2xl border border-border bg-background p-3.5 text-xs">
                    <p className="font-bold text-muted-foreground">📍 Shipping Address:</p>
                    <p className="font-medium text-foreground mt-0.5">{o.shippingAddress?.line1 || "Market Road, Radham Street, Ichapuram 532312"}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">💳 Payment Method: <span className="font-bold text-foreground">{o.paymentMethod || "WHATSAPP"}</span></p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Ordered Items ({o.items?.length || 0})</span>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {o.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
                          <img
                            src={item.image || "/assets/p-mug.jpg"}
                            alt={item.productName || item.name}
                            className="size-12 rounded-xl object-cover border border-border bg-secondary shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-bold text-xs">{item.productName || item.name}</p>
                            <p className="text-[11px] text-muted-foreground">Qty: {item.quantity} × {inr(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons for Admin Approval */}
                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, "CONFIRMED")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="size-3.5" /> Approve & Confirm Order
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, "DISPATCHED")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-amber-600"
                    >
                      <Zap className="size-3.5" /> Dispatch for Delivery
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(o.id, "DELIVERED")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-blue-700"
                    >
                      <CheckCircle2 className="size-3.5" /> Mark Delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Registered Customers & Addresses Tab */}
      {activeTab === "customers" && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-extrabold">Registered Customer Accounts & Saved Addresses</h2>
              <p className="text-xs text-muted-foreground">Manage customer profiles, saved delivery addresses in Ichapuram, and total order history.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {customersList.length} Registered Accounts
            </span>
          </div>

          {customersList.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <Users className="mx-auto size-12 text-muted-foreground/40" />
              <p className="mt-4 text-base font-bold">No registered customer accounts yet</p>
              <p className="mt-1 text-sm text-muted-foreground">When real customers sign up or place orders on your store, their accounts and saved addresses will automatically show up here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-secondary/50 font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="p-4">Customer Profile</th>
                    <th className="p-4">Mobile Phone</th>
                    <th className="p-4">Saved Shipping Address</th>
                    <th className="p-4 text-center">Orders Placed</th>
                    <th className="p-4 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customersList.map((c) => (
                    <tr key={c.id} className="hover:bg-secondary/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{c.name}</p>
                            <p className="text-[11px] text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-foreground">📞 {c.phone}</td>
                      <td className="p-4 font-medium text-foreground max-w-xs">
                        📍 {c.address}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-extrabold text-emerald-600">
                          {c.totalOrders || 1} Orders
                        </span>
                      </td>
                      <td className="p-4 text-right text-muted-foreground font-mono">{c.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Coupons Tab with Usage Limits & Time Limits */}
      {activeTab === "coupons" && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Discount Codes & Usage Limits</h2>
              <p className="text-xs text-muted-foreground">Control promo codes, maximum usage count per coupon, and expiry dates.</p>
            </div>
            <button
              onClick={() => {
                setEditingCoupon(null);
                setShowAddCoupon(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-glow"
            >
              <Plus className="size-4" /> Create Coupon Code
            </button>
          </div>

          {/* CREATE COUPON FORM */}
          {showAddCoupon && (
            <form onSubmit={handleCreateCoupon} className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Create New Promo Code</h3>
                <button type="button" onClick={() => setShowAddCoupon(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI50"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Type</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Discount Value</label>
                  <input
                    type="number"
                    required
                    placeholder="10 or 200"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Usage Limit (Times)</label>
                  <input
                    type="number"
                    required
                    placeholder="Max 50"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCoupon(false)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-glow">
                  Save Coupon
                </button>
              </div>
            </form>
          )}

          {/* EDIT COUPON FORM */}
          {editingCoupon && (
            <form onSubmit={handleUpdateCoupon} className="rounded-3xl border border-primary/40 bg-card p-6 shadow-glow space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary">Edit Coupon: {editingCoupon.code}</h3>
                <button type="button" onClick={() => setEditingCoupon(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={editingCoupon.code}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Type</label>
                  <select
                    value={editingCoupon.type}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Value</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.value}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Usage Limit</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.usageLimit || 50}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: Number(e.target.value) })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={editingCoupon.expiryDate || "2026-12-31"}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-xs outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-glow">
                  Update Coupon
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {couponsList.map((c) => (
              <div key={c.id || c.code} className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-extrabold text-primary">{c.code}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCoupon(c)}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      title="Edit Coupon"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="rounded-full p-1.5 text-destructive hover:bg-destructive/10"
                      title="Delete Coupon"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-bold text-foreground">
                  {c.type === "PERCENTAGE" ? `${c.value}% OFF` : `₹${c.value} FLAT DISCOUNT`} (Min cart: ₹{c.minPurchase})
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[11px]">
                  <span className="font-semibold text-muted-foreground">🎟️ Usage: <strong className="text-foreground">{c.usedCount || 0} / {c.usageLimit || 50} times</strong></span>
                  <span className="font-semibold text-amber-600">⏳ Expires: {c.expiryDate || "2026-12-31"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Stock Inventory & Stock Replenishment</h2>
              <p className="text-xs text-muted-foreground mt-1">Live stock levels, low-stock warnings, and direct quantity management</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
                <AlertTriangle className="size-3.5" />
                {productsList.filter((p) => (p.stock || 10) <= 5).length} Low Stock Items
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-secondary/50 font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Adjust Stock Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productsList.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <img src={p.image || p.images?.[0]} alt={p.name} className="size-10 rounded-xl object-cover border border-border bg-secondary" />
                      <span>{p.name}</span>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium capitalize">{getCatName(p.category)}</td>
                    <td className="p-4 font-bold">{inr(p.price)}</td>
                    <td className="p-4">
                      {(p.stock || 10) <= 0 ? (
                        <span className="rounded-full bg-destructive/10 px-3 py-1 text-[11px] font-bold text-destructive">Out of Stock</span>
                      ) : (p.stock || 10) <= 5 ? (
                        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-600">Low Stock ({p.stock})</span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600">In Stock ({p.stock})</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background p-1">
                        <button
                          onClick={() => handleStockCountChange(p.id, (p.stock || 10) - 1)}
                          className="grid size-7 place-items-center rounded-full bg-secondary hover:bg-muted text-xs font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={p.stock || 10}
                          onChange={(e) => handleStockCountChange(p.id, Number(e.target.value))}
                          className="w-12 text-center text-xs font-bold outline-none bg-transparent"
                        />
                        <button
                          onClick={() => handleStockCountChange(p.id, (p.stock || 10) + 1)}
                          className="grid size-7 place-items-center rounded-full bg-secondary hover:bg-muted text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
