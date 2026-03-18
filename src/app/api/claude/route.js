import Anthropic from '@anthropic-ai/sdk';
import { getSystemPrompt } from '@/lib/agent-personas';
import {
    ASSISTANT_TOOLS,
    INSPECT_PROJECT_CODE,
    PROJECT_CODE_MAP,
    GITHUB_REPO_BASE,
    GITHUB_RAW_BASE,
    WEB_FETCH_TOOL,
} from '@/lib/agent-tools';

/**
 * Run the inspect_project_code tool: look up PROJECT_CODE_MAP and return GitHub links.
 * Returns both blob (view in browser) and raw (fetch source with web_fetch) URLs.
 * @param {Record<string, unknown>} input - Tool input with project key (e.g. { project: "piano" })
 * @returns {string} Formatted list with blob + raw links for the model to use
 */
function runInspectProjectCode(input) {
    const project = input?.project ?? input?.project_id;
    const refs = project ? PROJECT_CODE_MAP[String(project)] : null;
    if (!refs || refs.length === 0) {
        return `No code references found for project "${project ?? 'unknown'}".`;
    }
    const blobBase = GITHUB_REPO_BASE.replace(/\/$/, '');
    const rawBase = GITHUB_RAW_BASE.replace(/\/$/, '');
    const lines = refs.map((r) => {
        const isExternal = r.path.startsWith('http://') || r.path.startsWith('https://');
        if (isExternal) {
            return `- ${r.label}:\n  live: ${r.path} (external project)`;
        }
        const blobUrl = `${blobBase}/${r.path}`;
        const rawUrl = `${rawBase}/${r.path}`;
        return `- ${r.label}:\n  view: ${blobUrl}\n  raw (fetch for source): ${rawUrl}`;
    });
    return `Code locations for "${project}" (use raw URLs with web_fetch to get source):\n${lines.join('\n')}`;
}

/** Beta API: custom tools + web_fetch so the model can pull page content from URLs. */
const toolsWithWebFetch = [...ASSISTANT_TOOLS, WEB_FETCH_TOOL];

export async function POST(request) {
    try {
        const { message, agent = 'composer' } = await request.json();
        let messages = [{ role: 'user', content: message }];
        const systemPrompt = getSystemPrompt(agent);

        const anthropic = new Anthropic();

        // First turn: cheaper stable model with custom tools only (no web_fetch).
        const cheapModel = 'claude-3-5-haiku-20241022';
        let msg = await anthropic.messages.create({
            model: cheapModel,
            max_tokens: 1000,
            system: systemPrompt,
            messages,
            tools: ASSISTANT_TOOLS,
        });

        // If the model requested tool use, run tools then use Beta Haiku (with web_fetch) for the follow-up.
        if (msg.stop_reason === 'tool_use' && Array.isArray(msg.content)) {
            const toolResults = msg.content
                .filter((block) => block.type === 'tool_use')
                .map((block) => {
                    const result =
                        block.name === INSPECT_PROJECT_CODE
                            ? runInspectProjectCode(block.input || {})
                            : `Tool "${block.name}" is not implemented.`;
                    return {
                        type: 'tool_result',
                        tool_use_id: block.id,
                        content: result,
                    };
                });

            if (toolResults.length > 0) {
                messages = [
                    ...messages,
                    { role: 'assistant', content: msg.content },
                    { role: 'user', content: toolResults },
                ];
                msg = await anthropic.beta.messages.create({
                    model: 'claude-haiku-4-5-20251001',
                    max_tokens: 1000,
                    system: systemPrompt,
                    messages,
                    tools: toolsWithWebFetch,
                    betas: ['web-fetch-2025-09-10'],
                });
            }
        }

        const textBlocks = msg.content?.filter((block) => block.type === 'text') ?? [];
        const text = textBlocks.map((block) => block.text).join('\n\n').trim() || '';
        return Response.json({ text });
    } catch (err) {
        console.error('[api/claude]', err);
        const status = err?.status ?? 500;
        const message = err?.message ?? String(err);
        return Response.json(
            { error: message, details: err?.error ?? null },
            { status: status >= 400 && status < 600 ? status : 500 }
        );
    }
}