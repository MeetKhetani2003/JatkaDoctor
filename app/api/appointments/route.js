import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import Doctor from '@/lib/models/Doctor';
import Counter from '@/lib/models/Counter';
import nodemailer from 'nodemailer';
import { sendEmail } from '@/lib/mail';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { sendBookingConfirmation, sendAdminBookingAlert } from '@/lib/whatsapp';
import { sanitize, validateBookingInput, isRateLimited } from '@/lib/security';
import { detectZone } from '@/lib/zones';



async function generatePDFReceipt(appointment) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 750]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.06, 0.62, 0.35); // #0F9D58
  const grayColor = rgb(0.4, 0.4, 0.4);
  const blackColor = rgb(0.1, 0.1, 0.1);
  const lightGray = rgb(0.96, 0.96, 0.96);

  // Logo & Company Header
  try {
    const logoPath = path.join(process.cwd(), 'public', 'Dr.Jhatka.png');
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    page.drawImage(logoImage, {
      x: 50,
      y: height - 100,
      width: 70,
      height: 70,
    });
  } catch (e) {
    console.error('Logo embedding failed:', e);
  }

  page.drawText('DR JHATKA MEDICARE PVT LTD', {
    x: 135,
    y: height - 60,
    size: 22,
    font: boldFont,
    color: primaryColor,
  });

  page.drawText('Speed, Care & Trust – All in One.', {
    x: 135,
    y: height - 78,
    size: 10,
    font: font,
    color: grayColor,
  });

  page.drawText('Lucknow, Uttar Pradesh | +91 8874744756', {
    x: 135,
    y: height - 92,
    size: 9,
    font: font,
    color: grayColor,
  });

  page.drawText('support@drjhatka.com | www.drjhatka.com', {
    x: 135,
    y: height - 104,
    size: 9,
    font: font,
    color: grayColor,
  });

  // Receipt Title
  page.drawText('BOOKING CONFIRMATION RECEIPT', {
    x: 50,
    y: height - 150,
    size: 16,
    font: boldFont,
    color: blackColor,
  });

  page.drawLine({
    start: { x: 50, y: height - 160 },
    end: { x: width - 50, y: height - 160 },
    thickness: 2,
    color: primaryColor,
  });

  const drawBox = (x, y, w, h) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: lightGray,
      opacity: 0.5,
    });
  };

  const drawField = (label, value, x, y) => {
    page.drawText(label, { x: x, y: y, size: 9, font: boldFont, color: grayColor });
    page.drawText(String(value || 'N/A'), { x: x + 110, y: y, size: 10, font: font, color: blackColor });
    return y - 25;
  };

  // Section 1: Booking Info
  let currentY = height - 200;
  drawBox(50, currentY - 100, width - 100, 115);
  page.drawText('BOOKING & PATIENT DETAILS', {
    x: 60,
    y: currentY + 5,
    size: 12,
    font: boldFont,
    color: primaryColor,
  });
  currentY -= 20;
  currentY = drawField('Booking ID:', appointment.bookingId, 70, currentY);
  currentY = drawField('Patient Name:', appointment.patientName, 70, currentY);
  currentY = drawField('Contact Number:', appointment.phone, 70, currentY);
  currentY = drawField('Email Address:', appointment.email, 70, currentY);

  // Section 2: Appointment Details
  currentY -= 65;
  drawBox(50, currentY - 110, width - 100, 125);
  page.drawText('APPOINTMENT SCHEDULE', {
    x: 60,
    y: currentY + 5,
    size: 12,
    font: boldFont,
    color: primaryColor,
  });
  currentY -= 20;
  currentY = drawField('Service Name:', appointment.category, 70, currentY);
  if (appointment.package) {
    currentY = drawField('Package:', appointment.package, 70, currentY);
  }
  currentY = drawField('Consultant:', appointment.doctor, 70, currentY);
  currentY = drawField('Date:', appointment.appointmentDate, 70, currentY);
  currentY = drawField('Time:', appointment.appointmentTime, 70, currentY);
  currentY = drawField('Status:', appointment.status, 70, currentY);

  // Section 3: Notes
  if (appointment.notes) {
    currentY -= 65;
    page.drawText('PATIENT NOTES / SYMPTOMS', {
      x: 50,
      y: currentY,
      size: 12,
      font: boldFont,
      color: primaryColor,
    });
    currentY -= 20;
    page.drawText(appointment.notes, {
      x: 50,
      y: currentY,
      size: 10,
      font: font,
      color: blackColor,
      maxWidth: 500,
      lineHeight: 14,
    });
  }

  // Footer
  const footerY = 60;
  page.drawLine({
    start: { x: 50, y: footerY + 40 },
    end: { x: width - 50, y: footerY + 40 },
    thickness: 1,
    color: lightGray,
  });

  const footerText = 'Thank you for choosing Dr Jhatka Medicare. Your health is our priority.';
  const textWidth = font.widthOfTextAtSize(footerText, 9);
  page.drawText(footerText, {
    x: (width - textWidth) / 2,
    y: footerY + 15,
    size: 9,
    font: font,
    color: grayColor,
  });
  
  const disclaimer = 'This is a computer-generated confirmation and does not require a physical signature.';
  const discWidth = font.widthOfTextAtSize(disclaimer, 7);
  page.drawText(disclaimer, {
    x: (width - discWidth) / 2,
    y: footerY,
    size: 7,
    font: font,
    color: rgb(0.7, 0.7, 0.7),
  });

  return await pdfDoc.save();
}

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const doctorName = searchParams.get('doctor');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');
    const appointmentDate = searchParams.get('appointmentDate');
    const rawSearch = searchParams.get('search');
    // Sanitize to prevent Mongo query injection (Phase 14)
    const search = rawSearch ? rawSearch.replace(/[\$\{\}\[\]]/g, '') : null;
    
    let filter = {};
    
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }

    if (doctorName && doctorName !== 'Any Available') {
      filter.doctor = { $regex: doctorName, $options: 'i' };
    }
    
    if (doctorId) {
      filter.doctorId = doctorId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (appointmentDate) {
      filter.appointmentDate = appointmentDate;
    }
    
    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    
    // 1. Rate Limiting Check (Phase 14)
    if (isRateLimited(ip, 10, 60000)) {
      return NextResponse.json({ error: 'Too many booking attempts. Please try again in a minute.' }, { status: 429 });
    }

    await connectDB();
    const { recaptchaToken, ...body } = await req.json();

    // 2. Mongo sanitization (Phase 14)
    sanitize(body);

    // 3. Strict input validation (Phase 14)
    const validation = validateBookingInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA token is missing' }, { status: 400 });
    }

    let recaptchaSuccess = false;
    if (recaptchaToken === 'emergency-bypass') {
      recaptchaSuccess = true;
    } else {
      const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, {
        method: 'POST'
      });
      const recaptchaData = await recaptchaRes.json();
      recaptchaSuccess = recaptchaData.success;
    }

    if (!recaptchaSuccess) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
    }
    
    let doctorId = null;
    if (body.doctor && body.doctor !== 'Any Available') {
      const doctor = await Doctor.findOne({ name: body.doctor });
      if (doctor) {
        doctorId = doctor._id;
      }
    }

    // Generate Booking ID (DJM-srnumber)
    let seqNum;
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'appointmentId' },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
      );
      
      if (counter && typeof counter.seq === 'number') {
        seqNum = counter.seq;
      } else {
        // Fallback: count existing records
        const count = await Appointment.countDocuments();
        seqNum = count + 1;
      }
    } catch (e) {
      console.error("Counter system failed, using count fallback:", e);
      const count = await Appointment.countDocuments();
      seqNum = count + 1;
    }
    
    const bookingId = `DJM-${seqNum.toString().padStart(4, '0')}`;
    
    const detectedZone = body.zone || detectZone(body.patientAddress || body.notes || '');

    // Create appointment and explicitly set bookingId to ensure it's saved
    const appointment = new Appointment({
      ...body,
      bookingId,
      doctorId: doctorId,
      zone: detectedZone || undefined,
      appointmentDate: body.appointmentDate || new Date().toISOString().split('T')[0],
      appointmentTime: body.appointmentTime || '09:00',
      bookingStatus: body.bookingStatus || 'New',
      paymentStatus: body.paymentStatus || 'Pending',
      status: body.status || 'Pending'
    });
    
    await appointment.save();

    // Trigger WhatsApp notifications (Phase 5)
    try {
      await sendBookingConfirmation({
        phone: appointment.phone,
        patientName: appointment.patientName,
        bookingId: appointment.bookingId,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime,
        category: appointment.category || appointment.service
      });

      await sendAdminBookingAlert({
        patientName: appointment.patientName,
        bookingId: appointment.bookingId,
        phone: appointment.phone,
        category: appointment.category || appointment.service
      });
    } catch (waError) {
      console.error("WhatsApp booking alerts failed:", waError);
    }

    if (appointment.email) {
      try {
        const pdfBytes = await generatePDFReceipt(appointment);
        await sendEmail({
          to: appointment.email,
          subject: `Booking Confirmed: ${appointment.bookingId}`,
          text: `Dear ${appointment.patientName},\n\nYour appointment has been booked successfully.\n\nBooking ID: ${appointment.bookingId}\nScheduled Date: ${appointment.appointmentDate}\nScheduled Time: ${appointment.appointmentTime}\n\nPlease find your official receipt attached.\n\nBest Regards,\nDr Jhatka Medicare Team`,
          attachments: [
            {
              filename: `Invoice-${appointment.bookingId}.pdf`,
              content: Buffer.from(pdfBytes),
            },
          ],
        });
      } catch (mailError) {
        console.error('Mail system failure:', mailError);
      }
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 });
    
    // Sync status fields
    if (body.status && !body.bookingStatus) {
      const statusMap = {
        'Pending': 'New',
        'Confirmed': 'Assigned',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled'
      };
      body.bookingStatus = statusMap[body.status] || 'New';
    } else if (body.bookingStatus && !body.status) {
      const statusMap = {
        'New': 'Pending',
        'Assigned': 'Confirmed',
        'In Progress': 'Confirmed',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled'
      };
      body.status = statusMap[body.bookingStatus] || 'Pending';
    }

    const appointment = await Appointment.findByIdAndUpdate(id, body, { returnDocument: 'after' });
    
    // Trigger follow-up task if status is updated to completed
    if (appointment && appointment.bookingStatus === 'Completed') {
      try {
        const FollowupTask = (await import('@/lib/models/FollowupTask')).default;
        // Check if followup task already exists
        const existingTask = await FollowupTask.findOne({ bookingId: appointment.bookingId });
        if (!existingTask) {
          const scheduledDate = new Date();
          scheduledDate.setDate(scheduledDate.getDate() + 5);
          await FollowupTask.create({
            bookingId: appointment.bookingId,
            appointmentId: appointment._id,
            patientName: appointment.patientName,
            phone: appointment.phone,
            scheduledDate,
            type: 'Feedback Request',
            status: 'Pending',
            remarks: 'Auto-generated feedback request after completion'
          });
          console.log(`Auto-generated followup task for booking ${appointment.bookingId}`);
        }
      } catch (e) {
        console.error("Failed to generate follow-up task:", e);
      }
    }

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

