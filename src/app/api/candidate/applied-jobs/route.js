import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Extract session_id from query params
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Call your backend endpoint
    const response = await fetch(
      `https://srv933455.hstgr.cloud:40080/candidate/applied-jobs?session_id=${session_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await response.json();

    // Handle backend errors
    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to fetch applied jobs" },
        { status: response.status }
      );
    }

    // Return success response
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
