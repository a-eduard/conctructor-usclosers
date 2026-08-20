import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Configure the SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, // STARTTLS
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER, // e.g., your-name@gmail.com
        pass: process.env.SMTP_PASSWORD, // 16-digit App Password
      },
    });

    // Email to be sent TO YOU (notification)
    const mailOptions = {
      from: `"USClosers Website" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Sending to yourself
      subject: `New Newsletter Subscription: ${email}`,
      text: `You have a new subscriber from the footer form.\n\nEmail: ${email}`,
      html: `
        <h3>New Subscription Alert</h3>
        <p>A new user has subscribed to the newsletter from the website footer.</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('SMTP Error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}