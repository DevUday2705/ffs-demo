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

        const response = await fetch("https://b33177f114cc.ngrok-free.app/app_api", {
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

        // Validate the response structure
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