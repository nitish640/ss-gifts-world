import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Bot, X, CheckCircle2, ArrowRight, RefreshCw, ShoppingBag, MessageCircle, Gift, Heart } from "lucide-react";
import { products, inr, type Product } from "@/data/catalog";
import { useShop } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function AiGiftConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [occasion, setOccasion] = useState<string>("");
  const [relation, setRelation] = useState<string>("");
  const [budget, setBudget] = useState<"budget" | "medium" | "premium">("medium");

  const { add } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const resetBot = () => {
    setStep(1);
    setOccasion("");
    setRelation("");
    setBudget("medium");
  };

  const getRecommendations = (): { matched: Product[]; rationale: string } => {
    let filtered = [...products];

    // Filter by occasion / category
    if (occasion === "marriage") {
      if (relation.includes("bride")) {
        filtered = products.filter((p) => p.category === "photo-frames" || p.category === "customized" || p.id.includes("frame"));
      } else {
        filtered = products.filter((p) => p.category === "customized" || p.category === "mug-printing" || p.category === "photo-frames");
      }
    } else if (occasion === "birthday") {
      if (relation.includes("kid")) {
        filtered = products.filter((p) => p.category === "soft-toys" || p.category === "toys");
      } else {
        filtered = products.filter((p) => p.category === "birthday" || p.category === "mug-printing" || p.category === "photo-frames");
      }
    } else if (occasion === "housewarming") {
      filtered = products.filter((p) => p.category === "photo-frames" || p.category === "customized" || p.category === "event-items");
    } else if (occasion === "kids") {
      filtered = products.filter((p) => p.category === "soft-toys" || p.category === "toys");
    }

    // Filter by budget
    if (budget === "budget") {
      filtered = filtered.filter((p) => p.price <= 500);
    } else if (budget === "medium") {
      filtered = filtered.filter((p) => p.price > 300 && p.price <= 1500);
    } else if (budget === "premium") {
      filtered = filtered.filter((p) => p.price >= 1000);
    }

    const matched = filtered.length >= 2 ? filtered.slice(0, 6) : products.slice(0, 6);

    let rationale = "Curated based on occasion and budget preferences";
    if (occasion === "marriage") rationale = `Top recommended wedding gifts for ${relation || "the couple"}`;
    if (occasion === "birthday") rationale = `Perfect birthday surprises for ${relation || "your loved one"}`;
    if (occasion === "housewarming") rationale = "Handpicked housewarming keepsake gifts for Ichapuram homes";

    return { matched, rationale };
  };

  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const fetchGroqAiAdvice = async (occ: string, rel: string, bud: string) => {
    setLoadingAi(true);
    setAiInsight("");
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY || (typeof process !== "undefined" ? process.env.GROQ_API_KEY : "");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are the AI Gift Expert at SS Gift World in Ichapuram. Give a 1-sentence super friendly, enthusiastic recommendation why these gifts fit their occasion.",
            },
            {
              role: "user",
              content: `Give 1 sentence advice for buying a ${occ} gift for ${rel} with budget ${bud}.`,
            },
          ],
        }),
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        setAiInsight(data.choices[0].message.content);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingAi(false);
    }
  };

  const { matched, rationale } = getRecommendations();

  const handleAddToCart = (productId: string) => {
    if (!user) {
      toast.error("Customer Sign In Required!", { description: "Please log in to add items to your cart." });
      setIsOpen(false);
      navigate({ to: "/login" });
      return;
    }
    add(productId);
    toast.success("Added to your shopping bag!");
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 rounded-full border border-primary/30 bg-card/95 px-5 py-3 text-xs font-bold text-foreground shadow-lift backdrop-blur hover:bg-card"
      >
        <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
          <Bot className="size-4" />
        </span>
        <span className="hidden sm:inline">AI Gift Assistant</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">
          <Sparkles className="size-3" /> Idea Helper
        </span>
      </motion.button>

      {/* AI Concierge Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-lift p-6 md:p-8 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg flex items-center gap-2">
                      SS Gift World AI Assistant <Sparkles className="size-4 text-primary" />
                    </h3>
                    <p className="text-xs text-muted-foreground">Smart Gift Advisor for Marriages, Birthdays & Events</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Progress Dots */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      step === i ? "w-8 bg-primary" : step > i ? "w-3 bg-emerald-500" : "w-3 bg-secondary"
                    }`}
                  />
                ))}
              </div>

              {/* STEP 1: OCCASION */}
              {step === 1 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-sm text-center">What is the occasion for the gift?</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "marriage", label: "💍 Marriage / Wedding", desc: "Bride & Groom gifts" },
                      { id: "birthday", label: "🎂 Birthday Party", desc: "For all age groups" },
                      { id: "housewarming", label: "🏡 Housewarming", desc: "Gruhapravesam keepsakes" },
                      { id: "kids", label: "🧸 Kids & Soft Toys", desc: "Fun toys & plush items" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setOccasion(opt.id);
                          setStep(2);
                        }}
                        className={`flex flex-col text-left rounded-2xl border p-4 transition-all hover:scale-102 ${
                          occasion === opt.id ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:bg-secondary"
                        }`}
                      >
                        <span className="font-bold text-xs">{opt.label}</span>
                        <span className="text-[11px] text-muted-foreground mt-1">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: RECIPIENT & RELATIONSHIP */}
              {step === 2 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-sm text-center">Who are you buying for?</h4>
                  <div className="grid gap-2.5">
                    {occasion === "marriage" && [
                      { id: "bride_side", label: "Bride's Side (Custom Photo Frames, Keepsakes)" },
                      { id: "groom_side", label: "Groom's Side (Personalized Mug Sets, Watch Frames)" },
                      { id: "couple_close", label: "Close Family & Relatives (Hamper Sets)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setRelation(opt.label);
                          setStep(3);
                        }}
                        className="rounded-2xl border border-border p-3 text-xs font-bold text-left hover:bg-secondary hover:border-primary transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}

                    {occasion === "birthday" && [
                      { id: "kids_age", label: "Kids (0 - 12 yrs: Toys & Soft Bears)" },
                      { id: "teens_youth", label: "Youth / Friends (Photo Mugs & LED Lights)" },
                      { id: "adults", label: "Parents / Adults (Custom Wall Photo Frames)" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setRelation(opt.label);
                          setStep(3);
                        }}
                        className="rounded-2xl border border-border p-3 text-xs font-bold text-left hover:bg-secondary hover:border-primary transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}

                    {occasion === "kids" && [
                      { id: "my_child", label: "👶 My Own Child (Son / Daughter)" },
                      { id: "nephew_niece", label: "🧒 Nephew / Niece / Grandchild" },
                      { id: "friends_kid", label: "🎁 Friend's Kid / Relative's Child" },
                      { id: "birthday_kid", label: "🎂 Birthday Boy / Birthday Girl" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setRelation(opt.label);
                          setStep(3);
                        }}
                        className="rounded-2xl border border-border p-3 text-xs font-bold text-left hover:bg-secondary hover:border-primary transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}

                    {occasion === "housewarming" && [
                      { id: "rel_1", label: "Close Family Member" },
                      { id: "rel_2", label: "Friend or Colleague" },
                      { id: "rel_3", label: "Neighbor / Special Guest" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setRelation(opt.label);
                          setStep(3);
                        }}
                        className="rounded-2xl border border-border p-3 text-xs font-bold text-left hover:bg-secondary hover:border-primary transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => setStep(1)} className="text-xs text-muted-foreground font-bold">
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: BUDGET */}
              {step === 3 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-sm text-center">What is your preferred budget range?</h4>
                  <div className="grid gap-3">
                    {[
                      { id: "budget", label: "💰 Budget Friendly", price: "Under ₹500" },
                      { id: "medium", label: "🎁 Popular Choice", price: "₹500 - ₹1,500" },
                      { id: "premium", label: "👑 Premium Keepsake", price: "₹1,500+" },
                    ].map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setBudget(b.id as any);
                          setStep(4);
                          fetchGroqAiAdvice(occasion, relation, b.label);
                        }}
                        className="flex items-center justify-between rounded-2xl border border-border p-4 text-xs font-bold hover:bg-secondary hover:border-primary transition-all"
                      >
                        <span>{b.label}</span>
                        <span className="font-extrabold text-primary">{b.price}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => setStep(2)} className="text-xs text-muted-foreground font-bold">
                      ← Back
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: AI CURATED RECOMMENDATIONS */}
              {step === 4 && (
                <div className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
                  <div className="rounded-2xl bg-primary/10 p-3.5 text-center space-y-1">
                    <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider flex items-center justify-center gap-1">
                      <Sparkles className="size-3" /> Groq AI Llama-3 Recommendation
                    </span>
                    <p className="text-xs font-bold text-foreground">
                      {loadingAi ? "Thinking with Groq AI Llama 3..." : aiInsight || rationale}
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
                    {matched.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 shadow-soft hover:border-primary/50 transition-colors">
                        <Link
                          to="/product/$id"
                          params={{ id: p.id }}
                          target="_blank"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer"
                        >
                          <img src={p.image} alt={p.name} className="size-16 rounded-xl object-cover border border-border bg-secondary shrink-0 group-hover:scale-105 transition-transform" />
                          <div className="flex-1 min-w-0">
                            <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                              98% Match
                            </span>
                            <p className="truncate font-bold text-xs mt-0.5 group-hover:text-primary group-hover:underline">{p.name}</p>
                            <p className="text-xs font-extrabold text-primary">{inr(p.price)}</p>
                          </div>
                        </Link>
                        <button
                          onClick={() => handleAddToCart(p.id)}
                          className="rounded-full bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground shadow-glow shrink-0 hover:scale-105 transition-transform"
                        >
                          + Bag
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <button onClick={resetBot} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
                      <RefreshCw className="size-3.5" /> Start Over
                    </button>

                    <a
                      href={`https://wa.me/919030690787?text=${encodeURIComponent(
                        `Hi SS Gift World! I am looking for a ${occasion} gift for ${relation} (Budget: ${budget}). Can you show more options?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-emerald-700"
                    >
                      <MessageCircle className="size-3.5" /> Ask on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
