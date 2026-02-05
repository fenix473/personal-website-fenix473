/**
 * Contact form API: accepts email + description and forwards to Telegram.
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local.
 */
const TELEGRAM_API_BASE = 'https://api.telegram.org';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!description) {
      return Response.json({ error: 'Description of enquiry is required' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token) {
      return Response.json({ error: 'Telegram bot not configured' }, { status: 500 });
    }
    if (!chatId) {
      return Response.json(
        { error: 'Telegram chat_id not set. Add TELEGRAM_CHAT_ID to .env.local (get it via getUpdates after messaging the bot).' },
        { status: 500 }
      );
    }

    const text = `📬 *Contact form*\n\n*Email:* ${email}\n*Enquiry:*\n${description}`;
    const url = `${TELEGRAM_API_BASE}/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return Response.json(
        { error: data.description || 'Failed to send to Telegram' },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
