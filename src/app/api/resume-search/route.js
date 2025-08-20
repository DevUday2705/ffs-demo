export async function POST(req) {
    try {
        const { query } = await req.json();

        // Add validation
        if (!query || typeof query !== 'string') {
            return new Response(
                JSON.stringify({ error: "Query parameter is required and must be a string" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        console.log("Received query:", query); // Debug log

        const formData = new URLSearchParams();
        formData.append("query", query);

        console.log("Sending to API:", formData.toString()); // Debug log

        const response = await fetch("https://srv933455.hstgr.cloud:8002/app_api", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                // Add ngrok header if needed
                "ngrok-skip-browser-warning": "true",
            },
            body: formData.toString(),
        });

        console.log("API Response status:", response.status); // Debug log

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
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
        console.log("API Response data:", data); // Debug log

        // Check for "Follow-up or pre-handled case." message first (Scenario 3: Invalid query)
        if (data.message === "Follow-up or pre-handled case.") {
            return new Response(
                JSON.stringify({
                    error: "This query is beyond the scope of this application. Let's discuss about candidate requirements for skills or share job reference number you need candidates for.",
                    originalResponse: data
                }),
                {
                    status: 400, // Use 400 instead of 500 since it's a client error (invalid query)
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Validate the response structure only for valid queries
        if (!data.ranking_pipeline_response || !data.ranking_pipeline_response.response) {
            console.error("Invalid API response structure:", data);
            return new Response(
                JSON.stringify({
                    error: "Invalid response structure from API",
                    received: data
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Server Error:", err);
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