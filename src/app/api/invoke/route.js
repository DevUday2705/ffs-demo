export async function POST(req) {
    try {
        const { query, session_id, role } = await req.json();

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

        if (!role || typeof role !== 'string') {
            return new Response(
                JSON.stringify({ error: "Role parameter is required and must be a string" }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        console.log("Received query:", query, "Session ID:", session_id, "Role:", role);

        const formData = new URLSearchParams();
        formData.append("query", query);
        formData.append("session_id", session_id);
        formData.append("role", role);

        console.log("Sending to Invoke API:", formData.toString());

        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for main API

        let response;
        try {
            response = await fetch("https://srv933455.hstgr.cloud:40080/recruiter/run-workflow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "ngrok-skip-browser-warning": "true",
                },
                body: formData.toString(),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);

            if (fetchError.name === 'AbortError') {
                console.error("Invoke API request timed out after 45 seconds");
                return new Response(
                    JSON.stringify({
                        error: "Request timed out",
                        message: "The AI service is taking longer than expected. Please try again with a simpler query or check your internet connection.",
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

            console.error("Invoke API network error:", fetchError);
            return new Response(
                JSON.stringify({
                    error: "Network Error",
                    message: "Unable to connect to the AI service. Please check your internet connection and try again.",
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

        console.log("Invoke API Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Invoke API Error:", errorText);
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
        console.log("Invoke API Response data:", data);

        // Handle new response format with final_state
        if (data.final_state) {
            const finalState = data.final_state;

            // Send the complete response data instead of filtering
            const transformedResponse = {
                message: finalState.response || "I've processed your request.",
                ...finalState, // Include all data from final_state
            };

            console.log("Transformed response:", transformedResponse);

            return new Response(JSON.stringify(transformedResponse), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // Legacy handling for old response format
        // Scenario 1: Direct results with resumes.matches
        if (data.resumes && data.resumes.matches) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // Scenario 2: Direct results with ranking_pipeline_response (fallback)
        if (data.ranking_pipeline_response && data.ranking_pipeline_response.response) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // Scenario 3: No results found
        if (data.message && data.message.includes("No results found")) {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // Scenario 4: Supervisor message (invalid query)
        if (data.message === "Follow-up or pre-handled case.") {
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // If none of the expected scenarios, return the raw response
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Invoke Server Error:", err);
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


