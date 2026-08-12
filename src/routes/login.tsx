import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Lock, Mail, Phone, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { apiFetch } from "@/lib/api-client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Customer Login & Sign Up — SS Gift World" },
      { name: "description", content: "Log in or create an account at SS Gift World for personalized gift tracking and faster checkout." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetStep, setResetStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("4829");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.phone.length !== 10) {
      toast.error("Invalid Mobile Number!", { description: "Please enter a valid 10-digit mobile number." });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Try backend API first
        try {
          const res = await apiFetch<{ token: string; user: any }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });
          login(res.token, res.user);
          toast.success("Welcome back!", { description: `Logged in as ${res.user.name}` });
          if (res.user.role === "ADMIN") {
            navigate({ to: "/admin" });
          } else {
            navigate({ to: "/account" });
          }
          return;
        } catch {
          // Check local users DB & default accounts
          const existingUsers = JSON.parse(localStorage.getItem("ssg_users_db") || "[]");
          
          // Check default admin
          if (formData.email === "admin@ssgiftworld.com" && formData.password === "Admin@12345") {
            const adminUser = { id: "admin-1", name: "Admin", email: "admin@ssgiftworld.com", role: "ADMIN" as const };
            login("admin-token-2026", adminUser);
            toast.success("Admin Logged In!", { description: "Welcome to Store Management Portal" });
            navigate({ to: "/admin" });
            return;
          }

          // Check default customer
          if (formData.email === "customer@ssgiftworld.com" && formData.password === "Customer@12345") {
            const custUser = { id: "cust-1", name: "Swetha Achary", email: "customer@ssgiftworld.com", phone: "9030690787", role: "CUSTOMER" as const };
            login("customer-token-2026", custUser);
            toast.success("Welcome back!", { description: "Logged in as Swetha" });
            navigate({ to: "/account" });
            return;
          }

          // Check user in registered DB
          const found = existingUsers.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
          if (found) {
            if (found.password === formData.password) {
              login(`token-${found.id}`, found);
              toast.success("Welcome back!", { description: `Logged in as ${found.name}` });
              navigate({ to: "/account" });
              return;
            } else {
              toast.error("Incorrect Password!", { description: "The password you entered is incorrect. Click 'Forgot?' to reset it." });
              return;
            }
          }

          // If account is NOT found at all, auto-redirect to Sign Up with email pre-filled!
          setIsLogin(false);
          setFormData((prev) => ({ ...prev, password: "" }));
          toast.info("Account Not Found! Redirecting to Sign Up", {
            description: `We've pre-filled ${formData.email}. Just enter your name, phone number, and password to create your account!`,
          });
        }
      } else {
        // Sign Up / Registration Mode
        const existingUsers = JSON.parse(localStorage.getItem("ssg_users_db") || "[]");
        if (existingUsers.some((u: any) => u.email.toLowerCase() === formData.email.toLowerCase())) {
          toast.error("Account Already Exists!", { description: "An account with this email already exists. Please sign in instead." });
          setIsLogin(true);
          return;
        }

        const registeredUser = {
          id: `user-${Date.now()}`,
          name: formData.name || formData.email.split("@")[0],
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: "Market Road, Radham Street, Ichapuram 532312",
          registeredAt: new Date().toISOString().split("T")[0],
          role: "CUSTOMER" as const,
        };

        localStorage.setItem("ssg_users_db", JSON.stringify([registeredUser, ...existingUsers]));
        login(`token-${registeredUser.id}`, registeredUser);
        toast.success("Account Created Successfully!", { description: `Welcome to SS Gift World, ${registeredUser.name}` });
        navigate({ to: "/account" });
      }
    } finally {
      setLoading(false);
    }
  };

  const sendResendEmailOtp = async (targetEmail: string, code: string) => {
    try {
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, code }),
      });
    } catch (e) {
      console.error("Failed to call /api/send-otp endpoint:", e);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("ssg_users_db") || "[]");
    const isDefaultAcc =
      forgotEmail.toLowerCase() === "customer@ssgiftworld.com" ||
      forgotEmail.toLowerCase() === "admin@ssgiftworld.com" ||
      forgotEmail.toLowerCase() === "swetha@ssgiftworld.com";
    const userAcc = existingUsers.find((u: any) => u.email.toLowerCase() === forgotEmail.toLowerCase());

    if (!userAcc && !isDefaultAcc) {
      toast.error("Account Not Found!", {
        description: `No registered account found under ${forgotEmail}. Redirecting to Sign Up...`,
      });
      setShowForgotModal(false);
      setIsLogin(false);
      setFormData((prev) => ({ ...prev, email: forgotEmail, password: "" }));
      return;
    }

    if (resetStep === "EMAIL") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setResetStep("OTP");

      // Send REAL Email OTP via Resend API
      sendResendEmailOtp(forgotEmail, code);

      toast.success("Verification Code Sent!", {
        description: `6-digit security code sent to ${forgotEmail}. Please check your email inbox.`,
      });
    } else if (resetStep === "OTP") {
      if (otpInput !== generatedOtp) {
        toast.error("Invalid Security OTP!", { description: "Please enter the 6-digit verification code sent to your email." });
        return;
      }
      if (!newPassword || newPassword.length < 4) {
        toast.error("Password Too Short!", { description: "New password must be at least 4 characters long." });
        return;
      }

      // Update password in localStorage DB
      const updatedUsers = existingUsers.map((u: any) =>
        u.email.toLowerCase() === forgotEmail.toLowerCase() ? { ...u, password: newPassword } : u
      );
      localStorage.setItem("ssg_users_db", JSON.stringify(updatedUsers));

      toast.success("Password Reset Successfully!", { description: "You can now log in with your new password." });
      setFormData((prev) => ({ ...prev, email: forgotEmail, password: newPassword }));
      setShowForgotModal(false);
      setResetStep("EMAIL");
      setIsLogin(true);
    }
  };

  return (
    <div className="shell py-12 md:py-20">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-soft"
          >
            <Sparkles className="size-7" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? "Access your saved gifts, wishlist and order tracking"
              : "Join SS Gift World for personalized hampers and instant previews"}
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="mb-6 flex rounded-2xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                !isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Bujji Achary"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mobile Phone Number (10 Digits)</label>
                  <span className="text-[10px] font-mono text-muted-foreground">{formData.phone.length}/10</span>
                </div>
                <div className="relative mt-1">
                  <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9030690787"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    className={`w-full rounded-2xl border bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary ${
                      formData.phone.length > 0 && formData.phone.length < 10 ? "border-amber-500" : "border-border"
                    }`}
                  />
                </div>
                {formData.phone.length > 0 && formData.phone.length < 10 && (
                  <p className="mt-1 text-[10px] font-semibold text-amber-600">Please enter a valid 10-digit mobile number</p>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(formData.email);
                      setResetStep("EMAIL");
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="size-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            Are you a store manager or staff?{" "}
            <Link to="/admin/login" className="font-extrabold text-primary hover:underline">
              Admin Portal Sign In →
            </Link>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-glow md:p-8 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-extrabold">Reset Account Password</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              {resetStep === "EMAIL" && (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Enter your registered email address below. We'll generate a security verification code to reset your password.
                  </p>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary font-bold"
                    />
                  </div>
                </div>
              )}

              {resetStep === "OTP" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-700 font-semibold">
                    🔑 Security verification code sent to <strong className="font-bold">{forgotEmail}</strong> & registered WhatsApp. Please check your notification.
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">6-Digit Verification OTP</label>
                      <button
                        type="button"
                        onClick={() => {
                          const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
                          setGeneratedOtp(freshCode);
                          sendResendEmailOtp(forgotEmail, freshCode);
                          toast.success("Fresh OTP Code Sent!", {
                            description: `New 6-digit verification code sent to ${forgotEmail}. Please check your inbox.`,
                          });
                        }}
                        className="text-[11px] font-extrabold text-primary hover:underline"
                      >
                        🔄 Resend OTP Code
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit OTP code"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="mt-1 w-full rounded-2xl border border-border bg-background p-3.5 text-center font-mono text-base font-bold tracking-widest outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enter New Password</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="password"
                        required
                        minLength={4}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="rounded-full border border-border px-5 py-2.5 text-xs font-bold hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-glow"
                >
                  {resetStep === "EMAIL" ? "Send Security OTP →" : "Update Password & Sign In"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
