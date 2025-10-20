export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const session_id = searchParams.get('session_id');

        // Add validation
        if (!session_id || typeof session_id !== 'string') {
            return new Response(
                JSON.stringify({ error: "Session ID parameter is required and must be a string" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        console.log("Fetching job requisitions for session_id:", session_id);

        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        let response;
        try {
            response = await fetch(`https://srv933455.hstgr.cloud:40080/recruiter/job-requisitions?session_id=${session_id}`, {
                method: "GET",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);

            if (fetchError.name === 'AbortError') {
                console.error("Job Requisitions API request timed out after 30 seconds");
                return new Response(
                    JSON.stringify({
                        error: "Request timed out",
                        message: "Loading job requisitions is taking longer than expected. Please try again.",
                        timeout: true
                    }),
                    {
                        status: 408, // Request Timeout
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            console.error("Job Requisitions API network error:", fetchError);
            return new Response(
                JSON.stringify({
                    error: "Network Error",
                    message: "Unable to connect to the service. Please check your internet connection and try again.",
                    details: fetchError.message
                }),
                {
                    status: 503, // Service Unavailable
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        console.log("Job Requisitions API Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Job Requisitions API Error:", errorText);
            return new Response(
                JSON.stringify({
                    error: `API request failed with status ${response.status}`,
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
        console.log("Job Requisitions API Response data:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Job Requisitions Server Error:", err);
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