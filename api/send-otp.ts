export default async function handler(req: any, res: any) {
  // Enable CORS headers for Vercel Serverless Function
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { email, code } = body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required.' });
    }

    const apiKey = process.env.RESEND_API_KEY || "re_JjXihM2Z_PaK4HvKeJ5yeniYXdn3jCJZu";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "🔐 Your SS Gift World Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 480px; margin: 0 auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #e53935; margin: 0; font-size: 24px;">🎁 SS Gift World</h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Sri Swetchavathi Gift Store — Ichapuram</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <h3 style="color: #1e293b; font-size: 16px; margin-top: 0;">Password Reset Security Code</h3>
            <p style="color: #475569; font-size: 14px;">We received a password reset request for your account (<strong>${email}</strong>).</p>
            <p style="color: #475569; font-size: 14px;">Your 6-digit security verification code is:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="background-color: #f1f5f9; color: #0f172a; font-size: 28px; font-weight: bold; font-family: monospace; letter-spacing: 6px; padding: 12px 28px; border-radius: 12px; border: 1px solid #cbd5e1; display: inline-block;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #64748b; font-size: 12px; text-align: center;">SS Gift World, Main Road, Ichapuram | WhatsApp Support: +91 9030690787</p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    console.log("Resend API response:", data);
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error("Vercel Serverless Send OTP Error:", err);
    return res.status(500).json({ error: "Failed to send email OTP." });
  }
}
