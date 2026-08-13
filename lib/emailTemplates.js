export function userConfirmationEmail({ name, message }) {
  return `
  <div style="margin:0;padding:0;background:#faf5f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <tr>
        <td style="background:linear-gradient(135deg,#e11d48,#be185d,#9333ea);padding:36px 32px;text-align:center;">
          <div style="font-size:34px;margin-bottom:8px;">💌</div>
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Strange In</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:13px;letter-spacing:0.5px;">CONNECTING HEARTS, ONE STORY AT A TIME</p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <h2 style="margin:0 0 12px;color:#1f1f1f;font-size:19px;">Hey ${name}, we got your message! 🎉</h2>
          <p style="margin:0 0 18px;color:#555;font-size:14px;line-height:1.6;">
            Thanks for reaching out to us. Our team reads every message personally and will get back to you within 24–48 hours.
          </p>
          <div style="background:#fdf2f6;border-left:3px solid #e11d48;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
            <p style="margin:0 0 4px;color:#9333ea;font-size:11px;font-weight:700;letter-spacing:0.5px;">YOUR MESSAGE</p>
            <p style="margin:0;color:#444;font-size:14px;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <p style="margin:0 0 20px;color:#555;font-size:14px;line-height:1.6;">
            While you wait, why not swipe through some new stories on Strange In? 💕
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <a href="https://strangein.com" style="display:inline-block;background:linear-gradient(135deg,#e11d48,#be185d);color:#fff;text-decoration:none;padding:12px 28px;border-radius:30px;font-size:14px;font-weight:600;">
                  Open Strange In
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;background:#faf5f7;text-align:center;">
          <p style="margin:0;color:#999;font-size:12px;">
            With love,<br/><strong style="color:#e11d48;">The Strange In Team</strong>
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

export function companyNotificationEmail({ name, email, subject, message }) {
  return `
  <div style="margin:0;padding:0;background:#f5f5f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <tr>
        <td style="background:linear-gradient(135deg,#1f1147,#4c1d95,#9333ea);padding:26px 32px;">
          <h1 style="margin:0;color:#fff;font-size:18px;">📥 New Contact Form Submission</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:12px;">Strange In — Website Inquiry</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;width:90px;">NAME</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#1f1f1f;font-size:14px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;">EMAIL</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#1f1f1f;font-size:14px;">
                <a href="mailto:${email}" style="color:#e11d48;text-decoration:none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;">SUBJECT</td>
              <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#1f1f1f;font-size:14px;">${subject || '—'}</td>
            </tr>
          </table>
          <p style="margin:0 0 6px;color:#888;font-size:12px;font-weight:700;">MESSAGE</p>
          <div style="background:#faf5f7;border-radius:10px;padding:16px;color:#333;font-size:14px;line-height:1.6;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px;background:#f9fafb;text-align:center;">
          <p style="margin:0;color:#aaa;font-size:11px;">Sent automatically from strangein.com contact form</p>
        </td>
      </tr>
    </table>
  </div>`;
}