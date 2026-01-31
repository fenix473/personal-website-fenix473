import Anthropic from '@anthropic-ai/sdk';
import { getSystemPrompt } from '@/lib/agent-personas';

export async function POST(request) {
    const { message, agent = 'composer' } = await request.json();
    const messages = [{ role: 'user', content: message }];
    const systemPrompt = getSystemPrompt(agent);

    const anthropic = new Anthropic();
    const msg = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages,
    });

    const text = msg.content?.[0]?.text ?? "";
    return Response.json({ text });
}