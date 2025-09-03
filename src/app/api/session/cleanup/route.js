export async function POST(req) {
    try {
        // Handle FormData sent from navigator.sendBeacon
        const formData = await req.formData();
        const thread_id = formData.get('thread_id');

        console.log("Received FormData entries:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        console.log("Extracted thread_id:", thread_id);

        // Validate thread_id
        if (!thread_id || typeof thread_id !== 'string' || thread_id.trim() === '') {
            console.log("Invalid thread_id:", { thread_id, type: typeof thread_id, length: thread_id?.length });
            return new Response(
                JSON.stringify({ 
                    error: "thread_id is required and must be a non-empty string",
                    received: { value: thread_id, type: typeof thread_id }
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        console.log("Cleaning up session for thread_id:", thread_id);

        // Create URLSearchParams for x-www-form-urlencoded format
        const formBody = new URLSearchParams();
        formBody.append('thread_id', thread_id);
        
        console.log("Request body being sent:", formBody.toString());

        const response = await fetch("https://srv933455.hstgr.cloud:27182/session/cleanup", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "ngrok-skip-browser-warning": "true",
            },
            body: formBody.toString(),
        });

        console.log("Cleanup API Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Cleanup API Error:", errorText);
            return new Response(
                JSON.stringify({
                    error: `Cleanup API request failed with status ${response.status}`,
                    details: errorText
                }),
                {
                    status: response.status,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const data = await response.json();
        console.log("Cleanup API Response data:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Session cleanup error:", err);
        return new Response(
            JSON.stringify({
                error: "Session cleanup failed",
                message: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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
