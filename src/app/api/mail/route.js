export async function POST(request) {
  try {
    const body = await request.json();
    
    // Make the request to the external API
    const response = await fetch('https://srv933455.hstgr.cloud:27182/mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Error sending emails:', error);
    return Response.json(
      { error: 'Failed to send emails', details: error.message },
      { status: 500 }
    );
  }
}
