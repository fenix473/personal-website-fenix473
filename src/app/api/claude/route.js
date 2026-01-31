import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
    const { message } = await request.json();
    const messages = [{ role: 'user', content: message }];

    const anthropic = new Anthropic();
    const msg = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: messages,
    });

    const text = msg.content?.[0]?.text ?? "";
    return Response.json({ text });
}