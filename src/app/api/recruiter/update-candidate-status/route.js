import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    // 🧾 Parse form data from frontend (x-www-form-urlencoded)
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);

    const jr_id = params.get("jr_id");
    const candidate_id = params.get("candidate_id");
    const session_id = params.get("session_id");
    const status = params.get("status");
    const remarks = params.get("remarks");
    const is_invited = params.get("is_invited");

    if (!jr_id || !candidate_id || !session_id) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log("🟢 Updating candidate mapping:", {
      jr_id,
      candidate_id,
      session_id,
      status,
      remarks,
      is_invited,
    });

    // ✅ Prepare URL-encoded body
    const formBody = new URLSearchParams({
      jr_id,
      candidate_id,
      session_id,
      status,
      remarks,
      is_invited,
    });

    // 🔗 Send to backend as application/x-www-form-urlencoded
    const response = await fetch(
      "https://srv933455.hstgr.cloud:40080/recruiter/update-mapping",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      }
    );

    const data = await response.json();
    console.log("✅ Update Mapping Response:", data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("🔥 Error in update-mapping API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
