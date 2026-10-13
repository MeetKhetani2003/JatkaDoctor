import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PhysioPackage from "@/lib/models/physio/PhysioPackage";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const conditionId = url.searchParams.get('conditionId');
    const query = conditionId ? { conditionId } : {};
    
    let packages = await PhysioPackage.find(query).populate('conditionId', 'name').sort({ order: 1 });
    if (!packages || packages.length === 0) {
      const defaultData = [
        {
          title: "1 Session Home Physiotherapy",
          description: "One home physiotherapy session by a qualified physiotherapist. Includes assessment, pain relief treatment, exercise guidance, posture correction and personalized rehabilitation plan. Suitable for first-time consultation and single-session treatment.",
          sessionsCount: 1,
          validityDays: 1,
          basePrice: 699,
          offerPrice: 499,
          perSessionPrice: 499,
          isRecommended: false,
          order: 1,
          isActive: true
        },
        {
          title: "3 Days Trial Home Physiotherapy",
          description: "3-day trial home physiotherapy package for new patients. Includes assessment, pain relief therapy, exercise guidance and personalized treatment plan by a qualified physiotherapist.",
          sessionsCount: 3,
          validityDays: 3,
          basePrice: 1599,
          offerPrice: 1299,
          perSessionPrice: 433,
          isRecommended: false,
          order: 2,
          isActive: true
        },
        {
          title: "5 Days Home Physiotherapy",
          description: "5-day home physiotherapy package for pain relief and early recovery. Ideal for neck pain, back pain, knee pain, shoulder pain, muscle strain and sports injuries. Includes five home physiotherapy sessions, exercise guidance and progress monitoring.",
          sessionsCount: 5,
          validityDays: 5,
          basePrice: 2699,
          offerPrice: 2199,
          perSessionPrice: 440,
          isRecommended: false,
          order: 3,
          isActive: true
        },
        {
          title: "7 Days Home Physiotherapy",
          description: "7-day home physiotherapy package for acute pain and early rehabilitation. Best for neck pain, back pain, knee pain, shoulder pain and muscle injury. Includes daily home visits, pain relief therapy, exercises and progress monitoring.",
          sessionsCount: 7,
          validityDays: 7,
          basePrice: 3499,
          offerPrice: 2999,
          perSessionPrice: 428,
          isRecommended: false,
          order: 4,
          isActive: true
        },
        {
          title: "10 Days Home Physiotherapy",
          description: "10-day home physiotherapy package for faster recovery and rehabilitation. Best for cervical pain, sciatica, knee pain, frozen shoulder, arthritis and post-fracture recovery. Includes daily home visits, exercise program and progress monitoring.",
          sessionsCount: 10,
          validityDays: 10,
          basePrice: 5199,
          offerPrice: 3999,
          perSessionPrice: 400,
          isRecommended: false,
          order: 5,
          isActive: true
        },
        {
          title: "15 Days Home Physiotherapy",
          description: "15-day home physiotherapy package for complete pain relief and rehabilitation. Ideal for cervical pain, back pain, knee pain, sciatica, frozen shoulder, arthritis, post-surgery and post-fracture recovery. Includes daily home visits, personalized exercise plan, progress monitoring and rehabilitation support.",
          sessionsCount: 15,
          validityDays: 15,
          basePrice: 7499,
          offerPrice: 5999,
          perSessionPrice: 400,
          isRecommended: true,
          order: 6,
          isActive: true
        },
        {
          title: "30 Days Home Physiotherapy",
          description: "30-day Home Physiotherapy Package for complete rehabilitation and long-term recovery. Best for stroke rehabilitation, paralysis, arthritis, post-surgery recovery, chronic back pain, cervical pain, sciatica and elderly physiotherapy. Includes daily home physiotherapy sessions, personalized exercise plan, progress tracking and expert guidance.",
          sessionsCount: 30,
          validityDays: 30,
          basePrice: 14999,
          offerPrice: 11999,
          perSessionPrice: 400,
          isRecommended: true,
          order: 7,
          isActive: true
        }
      ];
      try {
        await PhysioPackage.insertMany(defaultData);
        packages = await PhysioPackage.find(query).sort({ order: 1 });
      } catch (insertErr) {
        packages = defaultData.map((p, i) => ({ ...p, _id: `pkg-${i}` }));
      }
    }
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const physioPackage = await PhysioPackage.create(body);
    return NextResponse.json({ success: true, data: physioPackage });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
