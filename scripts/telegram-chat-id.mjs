const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error("Укажите TELEGRAM_BOT_TOKEN в .env.local.");
  process.exit(1);
}

try {
  const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`, { signal: AbortSignal.timeout(10000) });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error("Telegram не вернул обновления.");
  const ids = [...new Set(data.result.map((update) => update.message?.chat?.id).filter((id) => id !== undefined))];
  if (!ids.length) {
    console.log("Напишите своему боту /start в Telegram и запустите команду ещё раз.");
  } else {
    console.log("ID чатов:", ids.join(", "));
  }
} catch {
  console.error("Не удалось получить ID. Проверьте токен, соединение и отсутствие webhook у бота.");
  process.exitCode = 1;
}
