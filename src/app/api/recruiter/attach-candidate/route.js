export async function POST(req) {
    try {
        const { jr_id, candidate_id, session_id } = await req.json();

        // Add validation
        if (!jr_id || typeof jr_id !== 'string') {
            return new Response(
                JSON.stringify({ error: "JR ID parameter is required and must be a string" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!candidate_id || typeof candidate_id !== 'string') {
            return new Response(
                JSON.stringify({ error: "Candidate ID parameter is required and must be a string" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

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

        console.log("Attaching candidate:", { jr_id, candidate_id, session_id });

        const formData = new URLSearchParams();
        formData.append("jr_id", jr_id);
        formData.append("candidate_id", candidate_id);
        formData.append("session_id", session_id);

        console.log("Sending to Attach Candidate API:", formData.toString());

        const response = await fetch("https://srv933455.hstgr.cloud:40080/recruiter/attach-candidate", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "ngrok-skip-browser-warning": "true",
            },
            body: formData.toString(),
        });

        console.log("Attach Candidate API Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Attach Candidate API Error:", errorText);
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
        console.log("Attach Candidate API Response data:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Attach Candidate Server Error:", err);
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