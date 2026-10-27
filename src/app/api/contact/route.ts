export async function POST(request: Request) {
  let data: unknown;
  try {
    const body = await request.text();
    if (body.length > 8192) return Response.json({ error: "Заявка слишком большая" }, { status: 413 });
    data = JSON.parse(body);
  } catch {
    return Response.json({ error: "Некорректная заявка" }, { status: 400 });
  }

  if (!data || typeof data !== "object") return Response.json({ error: "Некорректная заявка" }, { status: 400 });
  const input = data as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const contact = typeof input.contact === "string" ? input.contact.trim() : "";
  const service = typeof input.service === "string" ? input.service.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (!name || name.length > 100 || !contact || contact.length > 160 || service.length > 100 || !message || message.length > 1500) {
    return Response.json({ error: "Проверьте поля заявки" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return Response.json({ error: "Форма пока не настроена" }, { status: 503 });

  const text = ["Новая заявка с JustFront", `Имя: ${name}`, `Контакт: ${contact}`, `Направление: ${service || "Не указано"}`, `Задача:\n${message}`].join("\n\n");
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const result: unknown = await response.json();
    if (!response.ok || !result || typeof result !== "object" || !("ok" in result) || result.ok !== true) {
      return Response.json({ error: "Не удалось отправить заявку" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Не удалось отправить заявку" }, { status: 502 });
  }
}
