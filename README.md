# JustFront

Портфолио Михаила Кудрицкого: веб-разработка, AI-интеграции и преподавание.

## Запуск

Нужен Node.js 24 или новее.

```bash
npm ci
npm run dev
```

Откройте [localhost:3000](http://localhost:3000/). Для проверки проекта доступны `npm run lint`, `npm run typecheck` и `npm run build`.

## Заявки в Telegram

Форма использует серверный обработчик Next.js. Чтобы подключить доставку, настройте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в `.env.local`; пошаговая инструкция находится в [docs/telegram-contact.md](docs/telegram-contact.md).

## Технологии

Next.js, React, TypeScript, GSAP, Three.js, React Three Fiber и Lenis.

## Docker

Docker — необязательный способ запустить приложение в контейнере. Для обычной разработки достаточно команд выше. Конфигурация содержит production-сервис `app` и сервис `dev` для разработки.

## Лицензия

Сведения о лицензии исходного шаблона сохранены в файле [LICENSE](LICENSE).
