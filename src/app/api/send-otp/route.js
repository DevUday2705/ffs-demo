import { generateOTP } from "@/app/utils/api";

export async function POST(request) {

    try {
        const body = await request.json();
        const { encryptedID } = body;

        if (!encryptedID) {
            return new Response(JSON.stringify({ error: 'Missing encryptedID' }), { status: 400 });
        }

        const result = await generateOTP(encryptedID);

        if (result.success) {
            return new Response(JSON.stringify(result), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: result.error }), { status: 500 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}