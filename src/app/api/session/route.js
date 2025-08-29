export async function POST(req) {
    try {
        console.log("Initializing session...");

        const response = await fetch("https://srv933455.hstgr.cloud:27182/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
        });

        console.log("Session API Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Session API Error:", errorText);
            return new Response(
                JSON.stringify({
                    error: `Session initialization failed with status ${response.status}`,
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
        console.log("Session API Response data:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Session Server Error:", err);
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
