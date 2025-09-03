export async function POST(req) {
    try {
        console.log("=== Test Cleanup Endpoint ===");
        
        // Try both FormData and JSON parsing
        const contentType = req.headers.get('content-type');
        console.log("Content-Type:", contentType);
        
        let thread_id = null;
        
        if (contentType && contentType.includes('multipart/form-data')) {
            console.log("Parsing as FormData...");
            const formData = await req.formData();
            thread_id = formData.get('thread_id');
            
            console.log("FormData entries:");
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
        } else {
            console.log("Parsing as JSON...");
            const body = await req.json();
            thread_id = body.thread_id;
            console.log("JSON body:", body);
        }
        
        console.log("Final thread_id:", thread_id);
        
        return new Response(JSON.stringify({
            success: true,
            received_thread_id: thread_id,
            content_type: contentType
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Test cleanup error:", err);
        return new Response(
            JSON.stringify({
                error: "Test failed",
                message: err.message
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
