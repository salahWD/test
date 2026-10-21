import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { name, email, phone, message } = parsed.data;

  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_EMAIL) {
    console.warn("[contact] Missing SMTP configuration. Cannot send email. Logging submission instead:", parsed.data);
    return NextResponse.json(
      { ok: false, error: "Email service is not configured. Please contact the administrator." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const textContent = `
New Contact Form Submission
---------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}
  `;

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
    <br/>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${message}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Request from ${name}`,
      text: textContent,
      html: htmlContent,
    });
    
    console.info(`[contact] Email sent successfully from ${name} (${email})`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Error sending email:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
