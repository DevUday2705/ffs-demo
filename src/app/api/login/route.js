export async function POST(req) {
    try {
        console.log("Processing login request...");

        // Extract form data from request
        const { email_id, password, agent_type } = await req.json();
        console.log("Received login data:", { email_id, password: password ? 'PROVIDED' : 'MISSING', agent_type });

        if (!email_id) {
            return new Response(
                JSON.stringify({
                    error: "email_id is required",
                    message: "Please provide email_id in request body"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!password) {
            return new Response(
                JSON.stringify({
                    error: "password is required",
                    message: "Please provide password in request body"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // For demo purposes, validate password (you can remove this in production)
        if (password !== "password") {
            return new Response(
                JSON.stringify({
                    error: "Invalid credentials",
                    message: "Invalid email or password"
                }),
                {
                    status: 401,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Prepare form data for external API
        const formData = new URLSearchParams();
        formData.append('email_id', email_id);

        // If agent_type is provided (second call after role selection), include it
        if (agent_type) {
            formData.append('agent_type', agent_type);
        }

        console.log("Calling external session API with:", formData.toString());

        // Call external session creation API
        const response = await fetch("https://srv933455.hstgr.cloud:40080/sessions/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "ngrok-skip-browser-warning": "true",
            },
            body: formData.toString(),
        });

        console.log("External API Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("External API Error:", errorText);
            return new Response(
                JSON.stringify({
                    error: `Authentication failed with status ${response.status}`,
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
        console.log("External API Response data:", data);

        // Handle role selection required
        if (data.role_selection_required) {
            return new Response(JSON.stringify({
                role_selection_required: true,
                message: data.message || "Multiple roles found. Please select one.",
                available_roles: data.available_roles || []
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // Handle successful login with single role
        if (data.session_id && data.role) {
            // Map external role to internal role codes
            const roleMapping = {
                'hiring_manager': 'HM',
                'recruiter': 'R',
                'candidate': 'C'
            };

            const roleLabelMapping = {
                'hiring_manager': 'Hiring Manager',
                'recruiter': 'Recruiter',
                'candidate': 'Candidate'
            };

            const internalRole = roleMapping[data.role] || data.role;
            const roleLabel = roleLabelMapping[data.role] || data.role;

            return new Response(JSON.stringify({
                success: true,
                session_id: data.session_id,
                role: internalRole,
                roleLabel: roleLabel,
                email: email_id
            }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // Handle unexpected response format
        return new Response(
            JSON.stringify({
                error: "Unexpected response format",
                message: "The authentication service returned an unexpected response"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (err) {
        console.error("Login Server Error:", err);
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