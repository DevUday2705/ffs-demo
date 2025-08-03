import { validateOTP } from "@/app/utils/api";

export async function POST(request) {
    try {
        const body = await request.json();
        const { reqNo, otp } = body;

        if (!reqNo || !otp) {
            return new Response(JSON.stringify({ success: false, error: 'Missing required params' }), {
                status: 400,
            });
        }

        const result = await validateOTP(reqNo, otp);

        if (result.success) {
            return new Response(JSON.stringify(result), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, error: result.error }), {
                status: 500,
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
