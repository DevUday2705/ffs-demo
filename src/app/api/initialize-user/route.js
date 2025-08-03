import { initializeUser } from '@/app/utils/api';

import { NextResponse } from 'next/server';


export async function POST(request) {
    const { reqno } = await request.json();
    const result = await initializeUser(reqno);

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
        success: true,
        data: result.data,
    });
}