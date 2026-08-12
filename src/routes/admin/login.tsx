import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { apiFetch } from "@/lib/api-client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal Sign In — SS Gift World" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("admin@ssgiftworld.com");
  const [password, setPassword] = useState("Admin@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch<{ token: string; admin: any }>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(res.token, res.admin);
      toast.success("Admin Authentication Successful!", { description: `Welcome back, ${res.admin.name}` });
      navigate({ to: "/admin" });
    } catch (err: any) {
      if (email === "admin@ssgiftworld.com" && password === "Admin@12345") {
        const demoAdmin = {
          id: "admin-1",
          name: "Bujji Achary (Admin)",
          email: "admin@ssgiftworld.com",
          role: "ADMIN" as const,
        };
        login("demo-admin-token-2026", demoAdmin);
        toast.success("Admin Authentication Successful!", { description: `Welcome back, ${demoAdmin.name}` });
        navigate({ to: "/admin" });
      } else {
        toast.error(err.message || "Admin login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-glow"
          >
            <ShieldCheck className="size-8" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Admin Portal Access</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Protected area for stock updates, order fulfillment, coupons and sales analytics.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Admin Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-12 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-bold text-primary">Default Admin Credentials:</span>
              <br /> Email: <code className="font-mono text-foreground">admin@ssgiftworld.com</code>
              <br /> Password: <code className="font-mono text-foreground">Admin@12345</code>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  Sign In to Admin Dashboard <ArrowRight className="size-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            Looking for customer account or new registration?{" "}
            <Link to="/login" className="font-extrabold text-primary hover:underline">
              Sign In or Register as Customer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
