# REA: движение всей главной страницы

## Цель

Приблизить сквозную анимацию локальной копии Trionn к референсу: Hero/About/Vision, Key Facts, Selected Work, Services, Testimonials, Design in Motion и Footer должны менять состояние от тех же типов ввода и в сопоставимые моменты прокрутки.

## Текущее состояние

Все основные секции и исходные медиа уже есть, но полный аудит выявил отличия в тайминге work/services, мобильных facts, WebGL-знаке, галерее и завершающих переходах. REA ранее анализировал четыре публичных JS-чанка, в том числе код work/services. Полный runtime-сценарий ещё не исследован.

## Ограничения

Менять только `_website-cloner`. Не менять основной portfolio. Сохранить доступность, reduced motion, производительность, работающую mobile-версию и локальность зависимостей. Отделять наблюдение в браузере от статического вывода REA.

## Предлагаемое решение

Повторно использовать имеющиеся Evidence и снять runtime-состояния референса через REA/браузер. Составить карту scroll/timing для всех крупных сцен, затем исправлять крупнейшие расхождения по очереди, не переписывая рабочие секции без причины. Сравнить после каждой связанной группы изменений.

## Затрагиваемые файлы и слои

`src/components/sites/trionn/*`, локальные стили `src/app/globals.css`, исследовательские файлы `docs/research/trionn/*`, `TASKS.md`. Изменения ограничены локальной копией.

## Этапы

- [x] Исследовать публичные скрипты/сцены REA и подтвердить драйверы в браузере.
- [x] Сопоставить и исправить Desktop Selected Work → Services.
- [x] Сопоставить и исправить Mobile Key Facts → Work → Services.
- [x] Сопоставить Testimonials → Gallery → Footer и выровнять CTA футера; оставшиеся отличия задокументировать.
- [x] Проверить Hero/About/Vision после интеграции и обратную прокрутку.
- [x] Выполнить lint, typecheck, build, desktop/mobile/reduced-motion QA и обновить TASKS.md.

## Проверка

REA Evidence + браузерные кадры источника; Playwright для последовательных wheel/touch действий и интерактивности; Chrome DevTools для layout/console; `npm run check`.

## Ход выполнения

Повторно использован REA Evidence и сопоставлены desktop/mobile состояния в Chrome DevTools. В коде изменены фазы Work/Services, мобильные Key Facts, галерея и переходы. Desktop Work завершает горизонтальную дорожку перед боковой передачей Services; pin снимается и восстанавливается при смене viewport или reduced motion. На мобильном обратная прокрутка возвращает прежние кадры и положение карточек. Финальная проверка перечислена в исследовательском отчёте.

## Решения

REA подтвердил отношения в опубликованном Work/Services bundle; видимые моменты подтверждены браузером. Структура локальной реализации оставлена секционной, при этом длительности и визуальные фазы согласованы с источником.

## Неожиданности и отклонения

REA MCP в текущей сессии отсутствует; использован локальный CLI. Отдельный CDP Chrome для runtime-capture не запустился из-за сбоя GPU-процесса, поэтому runtime проверялся Chrome DevTools и Playwright.

## Результат

Большие расхождения в timing Work/Services и мобильной последовательности устранены. Точный WebGL shader, glyph paths и gallery camera path остаются отличиями; пиксельного 1:1 соответствия нет.

## Дополнение 22 октября: первые четыре экрана

После скриншотов пользователя повторно сравнены Hero, About, Vision и вход в Key Facts. В Vision яркость цельного знака теперь падает вместе с отражениями, мелкие осколки About сделаны тонкими полупрозрачными пластинами, а общий canvas полностью исчезает до Key Facts при обычном и reduced motion. Проверены прямой и обратный scroll, мобильная граница, консоль и production checks. Точная геометрия и траектории референса остаются открытой задачей.

## Дополнение 22 октября: запись поведения знака

Запись пользователя длительностью 61,8 с просмотрена по кадрам. На 2-й секунде знак собран, на 14–38-й показано вращение и распад в Hero, на 45–50-й видны фазы About с чертежом и крупными тёмными частями, к 55-й идёт полосовой переход, на 60-й Key Facts уже без знака. Живой источник дополнительно проверен при scrollY 900, 1350 и 1955 на viewport 1440 × 900.

Текущий инкремент: удержать центральный чертёж фронтальным во время About, сделать вспышки и мелкие осколки менее равномерными, проявлять тёплый блик на крупной пластине позднее, повысить читаемость собранного знака в Vision. Точная геометрия и материал исходного WebGL по-прежнему недоступны; это процедурное приближение.

Проверка: desktop 1440 × 900, mobile 390 × 844, прямая и обратная прокрутка, reduced motion и исчезновение canvas до Key Facts. Playwright не показал ошибок консоли; Chrome DevTools не показал ошибок загрузки и сообщил лишь существующее предупреждение Three.Clock. `npm run check` прошёл полностью после исправления замечания линтера.

### Исправление тайминга по замечанию пользователя

Предыдущий диапазон `.07–.42` viewport и скрытие объёмных частей на 14% прогресса создавали ранний скачок к чертежу. Публичный Hero JS и REA Evidence уточнили исходную шкалу `.1–1.0` с удержанием до `1.2` и сборкой до `1.8`, покадровым сглаживанием 6% и задержкой частей до 0.25. В локальном коде этот диапазон перенесён, объёмные части сохраняются до поздней фазы, а удержание мыши получает задержку 500 мс. Проверить новый проход на реальной прокрутке, обратном ходе, mobile и production checks.

Проверено колесом мыши на локальной странице: при scrollY 149 знак собран, при 299 видны расходящиеся объёмные части, при 449 объёмные части остаются поверх чертежа, а к 900 сцена становится преимущественно контурной. Обратный ход, mobile 390 × 844, reduced motion и исчезновение перед Key Facts проверены. Ошибок консоли нет; `npm run check` завершился успешно. Материал и отдельные траектории по-прежнему отличаются от исходника.

### Исправление распада всей поверхности — 23 октября

Публичный Hero JS показывает, что исходная фигура уже в собранном состоянии состоит из поверхностных патчей. Треугольники экструдированного объёма группируются по округлённой нормали; каждый патч получает направление, задержку и вращение. На скролле патчи расходятся, а неподвижный контур остаётся как чертёж. Предыдущая локальная реализация сохраняла три цельных объёма и накладывала поверх них отдельные плоские осколки, поэтому визуально раскалывались лишь три крупные части.

Теперь все поверхности локальной фигуры разделены на движущиеся патчи, включая широкие передние и задние грани. В состоянии покоя они точно собирают исходную геометрию. При распаде движется сама поверхность, а отдельные декоративные осколки и три дублирующих цельных объёма удалены. Яркость отражений падает по мере разлёта. Scroll ramp 0.1–1.0/1.2–1.8 и удержание для blast оставлены прежними.

На desktop 1440 × 900 визуально сравнены источник и локальная страница при scrollY 0, 450 и 900. Локальный знак теперь действительно раскладывается целиком; размер, точная форма патчей и их освещение ещё отличаются. `npm run lint`, `npm run typecheck` и `npm run build` прошли. Повторная автоматическая mobile/reverse проверка была остановлена лимитом проверки доступа Playwright; предыдущие проверки mobile относятся к старой геометрии и не считаются подтверждением этого инкремента.

### Vision responsive correction — 23 October 2026

Measured the live reference at 580 × 757 and 390 × 844. Corrected copy/marquee/caption positions, compact scene length and bottom-first stripe closure. At 580 px stripe scale differs from reference by less than 0.005 at the sampled scroll positions; Key Facts starts 5 px later. At 390 px Key Facts starts at 2954 px, matching the measured reference. Production forward/reverse scroll and reduced-motion layout checked. Lint, typecheck and build passed. Vision reflections and diagonal threads are dimmed independently of Hero. Glyph geometry and orientation remain approximate.

### Services continuity and side-card motion — 23 October 2026

Live source and the published 0sue chunk confirm one Services scene enters horizontally and stays pinned. The local duplicate preview caused a typography jump at handoff. Replace it with the actual service-sticky panel, transitioning fixed horizontal entry to sticky at the same viewport position. Source cards use a 0.85 timeline with 0.45-duration pairs offset by 0.2: left travels bottom-to-top, right top-to-bottom, with a sine horizontal bend. Reconstruct these paths and opacity ramps. Smooth progress using a time-based RAF interpolation; prioritize current stone frames over distant pending requests. Add the missing bottom-first white stripe exit and testimonial overlap.

REA analysis completed using project-local TEMP/TMP after the Windows default temp self-test failed. Evidence: ev_437b3945c3c36ac12262607c1cf04cafff76c47ad12ecf7d7c40a49e4dd25302, retained in .rea-tools/services-analysis-2026-10-23.json. Static inference is cross-checked against .svc-card runtime transforms in Chrome; exact typography, SVG drawing and letter scattering remain approximate.

### Services pacing and entry seam — 24 October 2026

At 1880 × 832, Services was still offset 29.89 px when 20 px of handoff scroll remained. Complete horizontal entry 0.1 timeline units before pin release so the final edge closes before handoff. User requested shorter Services pacing: reduce desktop section 1100→800svh and mobile 900→650svh; preserve the 80/20 stone/exit split. Advance white backdrop fade from progress 0.12–0.20 to 0.035–0.10, shortening the initial white hold. Parent portfolio remains outside the affected files.

### Services through Footer fidelity/performance pass — 24 October 2026

Measure first: a 180-frame Services scroll on 1440×900 produced mean 47.30 ms, p95 145.70 ms and 53 frames above 50 ms. Chrome trace reported 95 ms of forced layouts. The existing Hero already pauses its R3F loop when inactive; preserve it. Prepare 960/640px stone sequences (8.22/3.85 MB), prefetch compressed frames in bounded batches, retain bounded decoded caches, cache canvas dimensions with ResizeObserver, skip identical draws and cache DOM animation targets. Cache IntroSequence geometry outside scroll handlers to avoid its repeated layout reads.

REA tail analysis: published Services, Testimonials, Gallery and Footer chunks under .rea-tools/tail-source. Retained evidence .rea-tools/tail-analysis-2026-10-24.json. Testimonials: 5000 ms autoplay, 600 ms fade, pause on hover; reconstruct opacity crossfade without changing quote height on each slide. Gallery: use the observed helix radius 12, rise 28, 116 segments, stagger 6.2 and image length 5.8; one scene transitions into a six-image tableau, followed by bottom-first dark stripes. Footer: recover horizontal strokes from its shipped SVG and add decaying pointer/click waves. Keep static/reduced-motion content and mobile fallback.

Validation outcome: lint, typecheck and production build passed. Repeated traced 180-rAF Services scroll: mean 9.61 ms / p95 14.30 ms / no intervals >50 ms / 152 distinct stone frames. Before was 47.30 ms / 145.70 ms / 53 intervals >50 ms / 50 frames. Playwright confirms constant testimonial slide height, keyboard activation, footer CTA hit-testing, mobile/tablet without horizontal overflow and gallery reverse-scroll restoration. Chrome confirms reduced-motion static gallery exposes all nine images. Remaining differences: precise text scatter, SVG draw, sound and smoke shaders. REA tail evidence: ev_79c78e4ae98d15564b209cc348a3945e1754f957d01911372bc943c538fd1fc5.
