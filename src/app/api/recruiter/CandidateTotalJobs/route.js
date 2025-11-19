export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jr_id = searchParams.get("jr_id");
    const session_id = searchParams.get("session_id");

    // Validate query params
    if (!jr_id || !session_id) {
      return new Response(
        JSON.stringify({ error: "Bad Request: candidate_id and session_id are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("🟢 Fetching job mappings for:", { jr_id, session_id });

    // Backend API call
    const apiUrl = `https://srv933455.hstgr.cloud:40080/recruiter/candidate-job-mappings?jr_id=${jr_id}&session_id=${session_id}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    // Handle backend failure
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend API Error:", errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch job mappings",
          details: errorText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    console.log("✅ Backend API Response:", data);

    // Send success response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("🔥 Internal API Error:", err);
    return new Response(
      JSON.stringify({ error: "Server Error", message: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
