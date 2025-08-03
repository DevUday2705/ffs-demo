import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/shared/routes';

// Simple function to get user details with expand params
async function getUserDetailsWithExpand(decryptedID) {
    const expandParams = '$expand=Stock_Receivables,PriorClaimStatus,PendingPILLiability';
    const url = `${API_CONFIG.userDetailsURL}('${decryptedID}')?${expandParams}`;


    const response = await fetch(url);

    if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed to fetch dashboard data. Status:", response.status, "Response:", errText);
        throw new Error('Failed to get dashboard data');
    }

    const data = await response.json();
    return data;
}

export async function POST(request) {
    try {
        const { reqNo } = await request.json();

        if (!reqNo) {
            return NextResponse.json(
                { success: false, error: 'Missing reqNo parameter' },
                { status: 400 }
            );
        }


        // Use reqNo directly as decryptedID (since you mentioned they're the same)
        const dashboardData = await getUserDetailsWithExpand(reqNo);

        return NextResponse.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error("❌ Error in get-dashboard-data:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}