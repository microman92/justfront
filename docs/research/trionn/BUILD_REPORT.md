# Trionn — локальная реконструкция

> Этот документ описывает первый проход. Актуальные изменения, проверки и оставшиеся отличия второго прохода — в [FIDELITY_REPORT.md](FIDELITY_REPORT.md).

Дата: 6 октября 2026. Проект: `D:/Миша/MyProjects/sites/_website-cloner`.

## Запуск

Из этой папки: `npm run dev -- --hostname 127.0.0.1`. Адрес: http://127.0.0.1:3000.

## Что собрано

- Главная `/`: hero, About, Vision, Key facts, три проекта, услуги, отзывы, Design in Motion, footer.
- Fixed header, меню, контактная панель, управление звуком, carousel, меняющееся слово hero, pointer/hold-реакция 3D-сцены.
- GSAP/ScrollTrigger для desktop-рельса проектов и галереи; Lenis на desktop; нативный мобильный scroll.
- Локальные шрифты и 42 исходных ресурса: 3,768,828 байт в `public/sites/trionn`.
- Reduced motion: статическая сцена, вертикальная доступная подборка проектов, остановленные marquee, hero-word, autoplay отзывов и видео. WebGL переходит в demand mode вне hero.
- Фокус удерживается в контактной панели/меню, Escape закрывает overlay; стрелки отзывов — семантические кнопки.

## Инструменты

Использован `clone-website` из шаблона, а также доступные skills для frontend, motion и WebGL. Context7, Chrome DevTools и Playwright уже были доступны в сессии. Новые глобальные skills/MCP/plugins не устанавливались. GSAP 3.15.0, Lenis 1.3.26, Three.js 0.186.1 и React Three Fiber 9.8.1 установлены в этом репозитории.

## Проверки браузером

Финальный `npm run check` завершился успешно: lint, TypeScript и production build прошли после последних исправлений.

| Проверка | Результат |
|---|---|
| Desktop 1440×900 | Страница и Canvas работают, горизонтального overflow нет |
| Tablet 768×1024, проход страницы | Overflow нет; сломанных загруженных изображений 0 |
| Mobile 390×844, вниз и обратно | Overflow нет; сломанных загруженных изображений 0; три проекта доступны |
| Mobile header / hero font | 63 px / 45.63 px |
| Menu open/close | Работает |
| Contact open / focus / Escape | Работает, focus внутри dialog |
| Carousel next | Меняет автора и цитату |
| Reduced motion | Hero-word не изменился за 3.8 с; pin-spacers 0; projects column; video paused; marquee animation none |
| Ошибки JavaScript | 0 в проверенных состояниях |

В dev-console остаётся предупреждение зависимости React Three Fiber/Three.js о deprecated `THREE.Clock`. Это не ошибка выполнения. Новые диагностические файлы, которые Playwright автоматически сохранил в родительский workspace, удалены; исходники portfolio не менялись.

## Границы точности

Это рабочая реконструкция по исследованию, а не подтверждённое pixel-perfect воспроизведение.

- Hero-знак построен процедурно заново. Геометрия, электрические дуги и распад на фрагменты отличаются от оригинального WebGL.
- Gallery использует CSS/GSAP и исходные изображения вместо оригинального WebGL-рендера.
- Сцены услуг и дистанции scroll упрощены. Измеренная высота mobile около 8,735 px против около 19,452 px у источника; desktop около 20,071 px против около 25,497 px.
- Ссылки на кейсы, About, Services и календарь ведут на источник: эти отдельные страницы не входят в локальную сборку.
- Контактная форма использует mailto; собственного сервера отправки нет. Форма не отправлялась при проверке.
- Аудио отзывов не найдено в исследовании, поэтому соответствующая кнопка отключена. Header sound использует локальный thunder-файл; это упрощение исходной звуковой системы.
- Часть связующего текста и статичная композиция адаптированы; структуру и ключевую копию источника можно сравнить с сохранёнными source screenshots.

## Локальные ресурсы

Source origin: `https://trionn.com`.

| Источник | Локальный каталог |
|---|---|
| `/_next/static/media/*.woff2` | `public/sites/trionn/fonts` — Familjen Grotesk, Neue Haas, Martian Mono, PP Editorial |
| `/images/logo.svg`, blast/footer icons | `public/sites/trionn/brand` |
| Awards SVGs | `public/sites/trionn/awards` |
| `/images/partner1.svg` … `partner5.svg` | `public/sites/trionn/partners` |
| `/images/projects/*` | `public/sites/trionn/projects` — desktop/mobile пары |
| `/images/{zoltan,malte,stephen,doug,jean}.webp` | `public/sites/trionn/portraits` |
| `/images/orbit/orbit-01.jpg` … `orbit-09.jpg` | `public/sites/trionn/orbit` |
| `/images/stone/frame_0001.webp` | `public/sites/trionn/stone` |
| `/video/homepage-services-video*.mp4` | `public/sites/trionn/video/services*.mp4` |
| `/audio/thunder.mp3` | `public/sites/trionn/sound/thunder.mp3` |
