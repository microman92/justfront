# Trionn — карта движения

Driver указан по основному наблюдаемому источнику запуска. Если сцена одновременно зависит от нескольких источников, перечислены оба. Времена — измерение секундомером/снимками; там, где точное время не было доступно из DOM, указана оценка.

| Область | Эффект и состояние | Driver | Данные и заметки |
|---|---|---|---|
| Hero — слово заголовка | Последнее смысловое слово циклически меняется (`something`, `depth`, `impact`, `purpose`, `intention`); старое/новое слово проходит scramble/fade | **time** | Наблюдалось несколько состояний за ~15 с. Смена начинается примерно через 3–4 с; переход занимает около 1–1.5 с. При `prefers-reduced-motion: reduce` смена продолжилась в пятсекундном интервале. |
| Hero — знак и орбиты | Объёмная монограмма медленно поворачивается; тонкие линии и точки создают параллакс глубины | **time + pointer** | При неподвижной прокрутке знак менял ориентацию между двумя кадрами, разделёнными 2.6 с. Указатель сдвигает визуальную реакцию/свет. |
| Hero — энергетическая дуга | Яркий электрический след/искры проходят по линиям вокруг знака | **pointer** | Перемещение указателя рядом с центральным объектом вызывает локальный всплеск; canvas сам `pointer-events:none`, поэтому событие получает обёртка/контейнер сцены. |
| Hero — «Hold to blast» | При нажатии и удержании объект раскрывается на фрагменты, композиция деформируется | **pointer (press/hold)** | Проверено реальным удержанием курсора; текст-подсказка явно предлагает действие. Отдельный click без удержания не фиксировал как эквивалент. |
| About — проявление statement | Большой текст нарастает/проявляется поверх тёмной сцены | **scroll** | Этап следует сразу за первым viewport; обычная прокрутка задаёт появление и переход. |
| Vision — ticker | Повторяющаяся строка `INSPIRE + INNOVATE + IMPACT` непрерывно уходит в сторону | **time** | При неподвижной позиции около y=1955 два скриншота через 2.6 с показывают явное перемещение примерно на 130 px (визуальная оценка по кадрам). |
| Vision — центральная монограмма | Знак продолжает медленное вращение под тикером | **time** | Сравнение кадров без прокрутки: ориентация центрального знака заметно изменилась за 2.6 с. |
| Key facts — счётчики | Цифры прокручиваются к целевым значениям: 50, 1.5K+, 20+ | **scroll → time** | Появление активируется входом секции во viewport; цифры докручиваются анимацией. Точное время завершения не фиксировал. |
| Selected work | Карточки проектов смещаются горизонтально через большой закреплённый участок; их вертикальные уровни чередуются | **scroll** | Desktop pin-spacer около 13,050 px объединяет переход проектов в услуги. При обратном scroll лента разворачивается обратно. |
| Карточки проектов | Состояние изображения при наведении | **hover** | Для MyWorker AI измерено `transform:none`, `filter:none`, opacity 1 до и после наведения. Большой hover-zoom не обнаружен; CTA/курсор остаются точками взаимодействия. |
| Services — названия | Услуги появляются по очереди вокруг каменного знака | **scroll** | Последовательно читаются AI & Intelligent Automation, Web Development, Product Design, Website & Mobile Design, WordPress Development, Branding. |
| Services — камень | Объект меняет ракурс и состояние поверхности/гравировки в последовательности кадров | **scroll** | Наблюдается кадрированный image-sequence `/images/stone/frame_0001.webp` … как минимум до `frame_0371.webp`; шаг сцены связан с длинным scroll. Это не WebGL canvas. |
| Services — видео | Фоновый клип с дымом/светом и каменным предметом повторяется | **time**, пока сцена активна | `homepage-services-video.mp4` и мобильный вариант: оба muted, loop, длительность около 10 с. Удалённая от viewport копия видео при проверке была paused. |
| Testimonials | Цитата, бренд, автор и портрет циклически переходят между отзывами | **time + click** | Автопереход наблюдался примерно через 5 с; ручное нажатие по названию клиента меняет набор за около 500–650 мс. Стрелки переключают карусель. |
| Design in Motion | Галерея и крупные заголовки `DESIGN IN MOTION` перемещаются в длинной закреплённой сцене | **scroll** | Desktop pin-spacer около 6,750 px; реальный scroll переводит галерею горизонтально. На mobile сцена заменена сеткой и движется меньше. |
| Header/CTA | Буквы текста, линия и стрелка получают короткий feedback при наведении | **hover** | На кнопках видны character-layer, `will-change` и управляющие классы; в этой проверке не измерял длительность каждой hover-анимации по кадрам. |
| Menu / contact | Открытие меню или inquiry-панели и переходы формы | **click** | Панели появляются после нажатия Menu/Let's Talk/Discuss Your Project; CSS-классы у CTA указывают короткий переход. Точную длительность не замерял. |
| Footer | Декоративная фоновая canvas-сцена | **time (вероятно)** | Canvas активен на footer; отдельный неподвижный time-comparison для футера не проводился, поэтому драйвер помечен как вероятный. |

## Scroll в обе стороны

- Desktop прошёл от нижней точки около `y=23,697` обратно до `y=0` серией колёсных событий; при обратном ходе снова встретились Design in Motion → pinned-услуги и проекты → Key facts → Vision → Hero.
- Mobile прошёл весь путь вперёд и назад, включая длинную сцену услуг; секции и card rail вернулись в исходный порядок.
- Lenis присутствует в DOM (`html.lenis` и классы scroll-state). Поэтому визуальная позиция и `scrollY` могут немного запаздывать относительно wheel input.

См. кадры обратного desktop-scroll: `screenshots/desktop-reverse-00.png`, `desktop-reverse-08.png`, `desktop-reverse-16.png`, `desktop-reverse-24.png`, `desktop-reverse-top.png`.

### Services correction evidence — 23 October 2026

REA Evidence ev_437b3945c3c36ac12262607c1cf04cafff76c47ad12ecf7d7c40a49e4dd25302 is retained under .rea-tools/services-analysis-2026-10-23.json. Published 0sue_k2sp00no.js describes cards beginning after scrollT 0.56. Three pairs share a 0.85 timeline: pair offsets 0/0.2/0.4, duration 0.45. Left cards travel from viewport bottom to negative card height; right cards reverse this. Horizontal entry bends with sin(phase*pi) until phase 0.5. Opacity ramps over the first/last 15%. At 1440 × 900 the live source reports 605 × 288 px outer cards and the settled X coordinates 40/795 px. The reconstruction now uses these measured paths. Services itself enters horizontally and becomes sticky, eliminating the duplicate preview handoff. Stone scroll progress is smoothed and stale frame requests are deprioritized. The final 200vh closes white stripes bottom-first and raises Testimonials with -100vh overlap. SVG draw paths and exact text scatter remain approximate.

### Services → Footer pass, 24 October 2026

REA analyzed the public Services, Testimonials, Gallery and Footer bundles in .rea-tools/tail-source; full output retained in .rea-tools/tail-analysis-2026-10-24.json. Runtime verification uses Chrome and Playwright separately from static inference.

- Services performance: same 180-rAF scroll at 1440×900 with Chrome tracing enabled. Before: mean 47.30 ms, p95 145.70 ms, 53 intervals >50 ms, 50 distinct stone frames. After: mean 9.61 ms, p95 14.30 ms, zero intervals >50 ms, 152 distinct stone frames. Local desktop evidence only; no mobile FPS claim.
- Compressed stone sources are prefetched in batches; 960px desktop / 640px phone variants weigh 8.22 / 3.85 MB. Decoded memory remains bounded. Canvas dimensions update via ResizeObserver and identical frames are not repainted. Intro geometry is cached outside scroll callbacks.
- Testimonials use 5000ms cycling and 600ms crossfade, pause while hovered/focused and when offscreen. Swipe changes slides on touch. All slides share one grid cell to avoid content-height jumps.
- Gallery ribbon uses radius 12, rise 28 per two revolutions, 116 segments per image, 5.8 image length and 6.2 stagger. Images map to front/back faces without mirroring visible text. It transitions into a six-card tableau in the same WebGL scene; desktop 3×2, phone 2×3. Dark stripes close bottom-first before exposing Footer. Reduced motion uses the static DOM gallery.
- Footer strokes come from its published SVG. Hover/click apply a decaying wave with anchored endpoints. Smoke and audio remain approximate; the local footer does not reproduce the source audio synthesis.
