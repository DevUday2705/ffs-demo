import { getAccessToken } from "@/app/utils/api";
import { API_CONFIG } from "@/shared/routes";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { reqNo } = await request.json();
    let token = await getAccessToken();

    if (!reqNo) {
        return NextResponse.json({ error: 'reqNo parameter is required' }, { status: 400 });
    }

    // Add single quotes around reqNo for the OData filter
    const apiUrl = `${API_CONFIG.getDocs}'${reqNo}'`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}