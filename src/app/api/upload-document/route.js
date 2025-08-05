import { uploadDocumentToService } from "@/app/utils/api";


export async function POST(request) {
    try {
        const body = await request.json();
        const { fileName, content, Doc_Type, mediaType, ReqNo_ReqNo } = body;
        console.log("Upload Document Request:", body);
        // Validate required fields
        if (!fileName || !content || !Doc_Type || !mediaType || !ReqNo_ReqNo) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required fields: fileName, content, Doc_Type, mediaType, ReqNo_ReqNo'
                }),
                { status: 400 }
            );
        }

        // Validate file content (basic base64 validation)
        if (!isValidBase64(content)) {
            return new Response(
                JSON.stringify({ error: 'Invalid file content format' }),
                { status: 400 }
            );
        }

        const result = await uploadDocumentToService({
            fileName,
            content,
            Doc_Type,
            mediaType,
            ReqNo_ReqNo
        });

        if (result.success) {
            return new Response(JSON.stringify(result), { status: 200 });
        } else {
            return new Response(
                JSON.stringify({ error: result.error || 'Upload failed' }),
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Upload document error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}

// Helper function to validate base64
function isValidBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

