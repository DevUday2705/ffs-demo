export async function POST(req) {
    try {
        console.log("Processing hiring manager workflow...");
        console.log("Request headers:", Object.fromEntries(req.headers.entries()));

        // Extract form data from multipart request - FORM DATA ONLY
        const formData = await req.formData();
        const session_id = formData.get('session_id');
        const query = formData.get('query');
        const file = formData.get('file'); // This will be a File object or null

        console.log("Received form data:", {
            session_id,
            query,
            file: file ? `File: ${file.name} (${file.size} bytes)` : 'No file'
        });

        if (!session_id) {
            return new Response(
                JSON.stringify({
                    error: "session_id is required",
                    message: "Please provide session_id in form data"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!query) {
            return new Response(
                JSON.stringify({
                    error: "query is required",
                    message: "Please provide query in form data"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Prepare multipart form data for external API - ALWAYS USE FORM DATA
        const externalFormData = new FormData();
        externalFormData.append('session_id', session_id);
        externalFormData.append('query', query);

        // Add file if provided
        if (file) {
            externalFormData.append('file', file);
        }

        console.log("Sending multipart form data to external API");

        // Call external hiring manager workflow API
        const response = await fetch("https://srv933455.hstgr.cloud:40080/hiring-manager/run-workflow", {
            method: "POST",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            body: externalFormData,
        });

        console.log("Workflow API Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Workflow API Error:", errorText);
            return new Response(
                JSON.stringify({
                    error: `Workflow execution failed with status ${response.status}`,
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
        console.log("Workflow API Response data:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Workflow Server Error:", err);
        return new Response(
            JSON.stringify({
                error: "Server Error",
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