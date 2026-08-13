import { NextResponse } from 'next/server';
import { transporter } from '@/lib/mailer';
import { userConfirmationEmail, companyNotificationEmail } from '@/lib/emailTemplates';

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // 1. Email to company
    const companyInfo = await transporter.sendMail({
      from: `"Strange In Website" <${process.env.SMTP_USER}>`,
      to: process.env.COMPANY_EMAIL,
      replyTo: email,
      subject: `💌 New message from ${name}${subject ? ` — ${subject}` : ''}`,
      html: companyNotificationEmail({ name, email, subject, message }),
    });
    console.log('✅ Company email sent:', companyInfo.messageId);

    // 2. Confirmation to user
    const userInfo = await transporter.sendMail({
      from: `"Strange In" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'We received your message 💌 — Strange In',
      html: userConfirmationEmail({ name, message }),
    });
    console.log('✅ User email sent:', userInfo.messageId);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (err) {
    console.error('❌ Contact form error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}