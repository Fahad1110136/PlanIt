// ============================================
// EMAIL UTILITY - sends invite emails via Resend
// ============================================
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendInviteEmail({ to, boardTitle, inviterName }) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    await resend.emails.send({
      from: "PlanIT <onboarding@resend.dev>",
      to,
      subject: `${inviterName} invited you to "${boardTitle}" on PlanIT`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1F2421;">You've been invited to PlanIT</h2>
          <p style="color: #1F2421; font-size: 15px; line-height: 1.6;">
            <strong>${inviterName}</strong> has invited you to collaborate on the board
            <strong>"${boardTitle}"</strong>.
          </p>
          <p style="color: #9A9590; font-size: 14px; line-height: 1.6;">
            Log in to PlanIT with this email address to see and accept the invite.
          </p>
          <a href="${clientUrl}/login" style="display: inline-block; background-color: #C7693D; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px; font-weight: 600;">
            Log in to PlanIT
          </a>
          <p style="color: #9A9590; font-size: 12px; margin-top: 32px;">
            PlanIT — Where ideas become actions
          </p>
        </div>
      `,
    });
  } catch (err) {
    // Log but don't crash the invite creation if email fails
    console.error("Failed to send invite email:", err);
  }
}

module.exports = { sendInviteEmail };