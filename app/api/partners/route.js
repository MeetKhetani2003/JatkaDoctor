import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PartnerRegistration from '@/lib/models/PartnerRegistration';
import { uploadToGridFS, deleteFromGridFS } from '@/lib/gridfs';
import { sendEmail } from '@/lib/mail';

export async function GET() {
  try {
    await connectDB();
    const registrations = await PartnerRegistration.find({}).sort({ createdAt: -1 });
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const recaptchaToken = formData.get('recaptchaToken');

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA token is missing' }, { status: 400 });
    }

    const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, {
      method: 'POST'
    });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
    }
    
    const type = formData.get('type');
    if (!type) {
      return NextResponse.json({ error: "Partner type (collection) is required" }, { status: 400 });
    }

    const file = formData.get('idFile');
    let idFileId = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      idFileId = await uploadToGridFS(buffer, file.name, file.type);
    }

    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      location: formData.get('location'),
      experience: formData.get('experience'),
      bio: formData.get('bio'),
      type: type,
      idFileId: idFileId
    };

    const registration = await PartnerRegistration.create(data);
    return NextResponse.json(registration);
  } catch (error) {
    console.error("Partner registration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const registration = await PartnerRegistration.findById(id);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    registration.status = status;
    await registration.save();

    // Send Email Notification
    if (registration.email && (status === 'Approved' || status === 'Rejected')) {
      const isApproved = status === 'Approved';
      const subject = isApproved 
        ? `Congratulations! Your Request at Dr. Jhatka is Approved` 
        : `Update on Your Request at Dr. Jhatka`;
      
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 20px;">
          <h2 style="color: ${isApproved ? '#0F9D58' : '#EA4335'};">${isApproved ? 'Approved!' : 'Application Update'}</h2>
          <p>Dear ${registration.name},</p>
          <p>We have reviewed your request for <strong>${registration.type}</strong> at Dr. Jhatka Medicare.</p>
          <p>Your request has been <strong>${status.toLowerCase()}</strong>.</p>
          ${isApproved 
            ? '<p>Welcome to our team! We will contact you soon with the next steps.</p>' 
            : '<p>Thank you for your interest. We appreciate your time, but we are unable to proceed with your application at this time.</p>'}
          <br/>
          <p>Best Regards,<br/><strong>Team Dr. Jhatka Medicare</strong></p>
        </div>
      `;

      await sendEmail({
        to: registration.email,
        subject,
        html
      });
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const registration = await PartnerRegistration.findById(id);
    if (registration?.idFileId) {
      try {
        await deleteFromGridFS(registration.idFileId);
      } catch (e) {
        console.error("Error deleting file:", e);
      }
    }

    await PartnerRegistration.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
