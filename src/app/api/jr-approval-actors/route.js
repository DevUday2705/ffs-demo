import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");

        if (!role) {
            return NextResponse.json(
                { error: "Role parameter is required" },
                { status: 400 }
            );
        }

        // Validate role parameter
        const validRoles = ["recruiter", "approver_1", "approver_2", "approver_3"];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: "Invalid role. Must be one of: recruiter, approver_1, approver_2, approver_3" },
                { status: 400 }
            );
        }

        console.log("Fetching approval actors for role:", role);

        const response = await fetch(
            `https://srv933455.hstgr.cloud:40080/jr-approval-flow/actors?role=${role}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error("External API failed with status:", response.status);
            return NextResponse.json(
                { error: "Failed to fetch approval actors" },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("Approval actors API response:", data);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching approval actors:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}