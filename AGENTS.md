<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# JustFront

Персональное портфолио Михаила Кудрицкого на Next.js 16, React 19 и TypeScript. Анимации и сцены используют GSAP, Three.js, React Three Fiber и Lenis.

## Команды

- `npm run dev` — сервер разработки
- `npm run build` — production-сборка
- `npm run lint` — ESLint
- `npm run typecheck` — проверка TypeScript
- `npm run check` — lint, проверка типов и сборка

## Работа с проектом

- Сохраняйте существующую механику анимаций и совместимость со сниженной анимацией.
- Используйте TypeScript strict, именованные экспорты и стили, принятые в проекте.
- Проверяйте адаптацию для мобильных экранов и очищайте подписки и анимации при размонтировании.
- Не помещайте токены и другие секреты в клиентский код или Git.
- Сайт, компоненты и ресурсы находятся в `src/` и `public/sites/mk-studio/`; настройка заявок описана в `docs/telegram-contact.md`.
