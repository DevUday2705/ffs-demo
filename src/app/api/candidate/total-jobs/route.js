import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get data from FormData instead of JSON
    const formData = await req.formData();
    const session_id = formData.get("session_id");
    const query = formData.get("query");
    const file = formData.get("file");

    if (!session_id || !query) {
      return NextResponse.json(
        { error: "Missing required parameters: session_id or query" },
        { status: 400 }
      );
    }

    console.log("🚀 Running workflow for candidate:", { session_id, query });

    // Prepare form data for external API
    const externalFormData = new FormData();
    externalFormData.append("session_id", session_id);
    externalFormData.append("query", query);
    if (file) {
      externalFormData.append("file", file);
    }

    // 🌐 Call the external candidate workflow API
    const response = await fetch(
      "https://srv933455.hstgr.cloud:40080/candidate/run-workflow",
      {
        method: "POST",
        body: externalFormData, // ✅ Pass FormData directly
      }
    );

    const data = await response.json();
    console.log("✅ Workflow Response:", data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("🔥 Error in run-workflow API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
