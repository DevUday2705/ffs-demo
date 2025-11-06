import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse incoming request body
    const { jr_id, session_id, application_remarks } = await req.json();

    if (!jr_id || !session_id) {
      return NextResponse.json(
        { success: false, message: "jr_id and session_id are required." },
        { status: 400 }
      );
    }

    // Prepare form-urlencoded body
    const formBody = new URLSearchParams({
      jr_id,
      session_id,
      ...(application_remarks && { application_remarks }),
    }).toString();

    // Send to backend
    const response = await fetch(
      "https://srv933455.hstgr.cloud:40080/candidate/apply-job",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      }
    );

    const data = await response.json();
    console.log(data)

    // Pass backend response directly
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("🔥 Error applying for job:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
