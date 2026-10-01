import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, referrer, userAgent } = body;

    // Log the click — in production, you'd write to a database or analytics service
    console.log("[RESUME_CLICK]", {
      timestamp,
      referrer,
      userAgent: userAgent?.substring(0, 200),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    });

    // Example: Write to a file, database, or external service
    // await db.resumeClicks.create({ data: { timestamp, referrer, userAgent } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESUME_CLICK_ERROR]", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}