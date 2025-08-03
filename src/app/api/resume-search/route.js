export async function POST(req) {
    try {
        const { query } = await req.json();

        const response = await fetch("https://resume-orchestrator-api.loca.lt/rank_resumes_direct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: "Failed to fetch resumes" }),
                { status: 500 }
            );
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: "Server Error", message: err.message }),
            { status: 500 }
        );
    }
}