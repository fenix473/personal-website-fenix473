/**
 * API route to generate a melody via N8N workflow
 * POST /api/piano/generate
 * Body: { message: string }
 * Returns: { output: string, melody: { id, name, tempo, notes } }
 */

const N8N_WEBHOOK_URL = 'https://fenix473.app.n8n.cloud/webhook/81942a4e-0e4b-4469-82e7-72f57b09e3ba';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let text = await response.text();

    // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
    text = text.trim();
    if (text.startsWith('```')) {
      // Remove opening ``` (with optional language tag) and closing ```
      text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // N8N returned plain text, wrap it
      data = [{ output: text }];
    }

    return Response.json(data);
  } catch (error) {
    console.error('N8N melody generation error:', error);
    return Response.json(
      { error: 'Failed to generate melody' },
      { status: 500 }
    );
  }
}
