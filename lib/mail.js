import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dr. Jhatka Medicare" <${process.env.GMAIL}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

/**
 * Sends official Free Health Card confirmation and download link email
 */
export const sendHealthCardEmail = async ({ email, patientName, patientId, cardUrl }) => {
  if (!email) return { success: false, error: 'No email provided' };

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #006837 0%, #004d26 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">DR JHATKA MEDICARE</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Speed, Care & Trust — All in One</p>
        <div style="display: inline-block; margin-top: 14px; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 1px;">
          FREE HEALTH CARD ISSUED
        </div>
      </div>
      
      <div style="padding: 28px 24px;">
        <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0;">Dear <strong>${patientName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 20px 0;">
          Congratulations! Your <strong>Dr Jhatka Medicare Free Digital Health Card</strong> has been generated successfully. Your Permanent Lifetime Patient ID has been issued.
        </p>

        <div style="background: #f0fdf4; border: 2px dashed #006837; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #166534; text-transform: uppercase;">Permanent Lifetime Patient ID</p>
          <p style="margin: 0; font-size: 26px; font-weight: 800; color: #006837; letter-spacing: 1px;">${patientId}</p>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #15803d;">Status: <strong>ACTIVE</strong></p>
        </div>

        <p style="font-size: 13px; color: #374151; line-height: 1.5; margin-bottom: 20px;">
          This Patient ID is permanent and lifetime valid. Use it across all clinic visits, free medical camps, physiotherapy at home, doctor visits, and ambulance requests.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${cardUrl || 'https://www.drjhatka.com/patient/dashboard'}" style="background: #006837; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 8px; display: inline-block;">
            View & Download Health Card
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
          <p style="margin: 0 0 4px 0;"><strong>Need Assistance?</strong></p>
          <p style="margin: 0 0 4px 0;">Helpline / WhatsApp: +91 87077 90677</p>
          <p style="margin: 0 0 4px 0;">Website: www.drjhatka.com</p>
          <p style="margin: 0;">Lucknow, Uttar Pradesh, India</p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: `Your Dr Jhatka Medicare Free Health Card [ID: ${patientId}]`,
    text: `Dear ${patientName}, Your Dr Jhatka Medicare Free Health Card has been issued. Your Permanent Patient ID is ${patientId}. Access your card here: ${cardUrl || 'https://www.drjhatka.com/patient/dashboard'}`,
    html,
  });
};
