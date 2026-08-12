import { Router } from "express";

const router = Router();

router.post("/recommend", async (req, res) => {
  const { prompt, occasion, relation, budget } = req.body;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (groqApiKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are the AI Gift Assistant for SS Gift World, a premium gift shop in Ichapuram. Recommend appropriate gifts for occasions (Marriages: bride/groom side, Birthdays, Housewarming) politely and concisely.",
            },
            {
              role: "user",
              content: prompt || `Suggest gift items for occasion: ${occasion}, recipient: ${relation}, budget: ${budget}`,
            },
          ],
        }),
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        return res.json({ result: data.choices[0].message.content });
      }
    } catch {
      // Fallback
    }
  }

  res.json({
    result: `Top recommended curated gifts for ${occasion || "your special occasion"} from SS Gift World!`,
  });
});

export default router;
