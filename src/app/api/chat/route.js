/**
 * API route to proxy chat messages to N8N workflow
 * Avoids CORS issues by making server-to-server requests
 */

const N8N_WEBHOOK_URL = 'https://fenix473.app.n8n.cloud/webhook/81942a4e-0e4b-4469-82e7-72f57b09e3ba';

export async function POST(request) {
    try {
        const body = await request.json();
        
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const text = await response.text();
        
        // Try to parse as JSON, otherwise wrap the text response
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            // N8N returned plain text, wrap it
            data = [{ output: text }];
        }

        return Response.json(data);
        
    } catch (error) {
        console.error('N8N proxy error:', error);
        return Response.json(
            { error: 'Failed to communicate with chat service' },
            { status: 500 }
        );
    }
}
