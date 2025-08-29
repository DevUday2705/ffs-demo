export async function POST(request) {
  try {
    const body = await request.json();
    
    // Forward the request to the external meeting API
    const response = await fetch('https://srv933455.hstgr.cloud:27182/meet/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error calling meeting API:', error);
    return Response.json(
      { error: 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}
