import { isIP } from "node:net";

const MAX_BODY_BYTES = 8192;
const WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, { count: number; expires: number }>();

function limitRequest(request: Request) {
  const now = Date.now();
  for (const [key, bucket] of buckets) if (bucket.expires <= now) buckets.delete(key);

  // Only trust the client IP when Vercel supplies and overwrites this header.
  const forwarded = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : undefined;
  const client = forwarded && isIP(forwarded) ? forwarded : "shared";
  const limits = [{ key: "all", max: 200 }, { key: `client:${client}`, max: client === "shared" ? 30 : 5 }];
  for (const { key, max } of limits) {
    const bucket = buckets.get(key);
    if (bucket && bucket.count >= max) return Math.max(1, Math.ceil((bucket.expires - now) / 1000));
  }
  for (const { key } of limits) {
    const bucket = buckets.get(key);
    if (bucket) bucket.count += 1;
    else buckets.set(key, { count: 1, expires: now + WINDOW_MS });
  }
  return 0;
}

async function readBody(request: Request): Promise<string | null> {
  const length = request.headers.get("content-length");
  if (length && /^\d+$/.test(length) && Number(length) > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return Response.json({ error: "Некорректный формат заявки" }, { status: 415 });
  }
  let data: unknown;
  try {
    const body = await readBody(request);
    if (body === null) return Response.json({ error: "Заявка слишком большая" }, { status: 413 });
    data = JSON.parse(body);
  } catch {
    return Response.json({ error: "Некорректная заявка" }, { status: 400 });
  }

  if (!data || typeof data !== "object") return Response.json({ error: "Некорректная заявка" }, { status: 400 });
  const input = data as Record<string, unknown>;
  if (typeof input.website === "string" && input.website.trim()) return Response.json({ ok: true });
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

  const retryAfter = limitRequest(request);
  if (retryAfter) return Response.json({ error: "Слишком много заявок" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });

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
