# Trionn — карта ресурсов и ассетов

При локальной сборке 42 ресурса сохранены в `public/sites/trionn`. Таблица source → local и ограничения реализации приведены в [BUILD_REPORT.md](BUILD_REPORT.md). Текст ниже описывает исходное исследование до загрузки файлов.

Записи собраны из DOM, performance resource entries и Chrome DevTools Network на главной. Все адреса ниже относятся к `https://trionn.com/`; исходники не скачивались в проект.

## Шрифты

| Семейство | Ресурс | Наблюдаемая роль |
|---|---|---|
| Familjen Grotesk Variable | `/_next/static/media/FamiljenGroteskVariable_Regular-s.p.04jxz-d23sc_e.woff2` | Display-заголовки и крупные заявления |
| Neue Haas Display Roman | `/_next/static/media/NeueHaasDisplay_Roman-s.p.0ykdwddnvy5f_.woff2` | основной текст и интерфейс |
| Martian Mono Light | `/_next/static/media/MartianMono_Light-s.p.0htes.s6weu9-.woff2` | моноширинные метки, CTA и небольшая навигация |
| PP Editorial New Ultralight | `/_next/static/media/PPEditorialNew_Ultralight-s.p.0qe_2frr_fmiu.woff2` | ресурс загружался, видимую роль не подтвердил |

## Бренд и proof-points

- Логотип: `/images/logo.svg`; знак blast: `/images/blast-icon.svg`.
- Наградные/платформенные SVG: `/images/awwwards.svg`, `ccda.svg`, `thefwa.svg`, `csswinner.svg`, `adesignaward.svg`, `gsap.svg`.
- Партнёрские логотипы: `/images/partner1.svg` … `/images/partner5.svg`.
- Футерная пиктограмма звука: `/images/footer-sound.svg`.

## Проекты

| Проект | Desktop source | Mobile source | Натуральный размер в измеренном DOM |
|---|---|---|---|
| MyWorker AI | `/images/projects/myworker/myworker.jpg` | `/images/projects/myworker/myworker_m.jpg` | 1500×1016 и 700×474 px |
| Pulse Studio | `/images/projects/pulse-studio/pulse-studio.jpg` | `/images/projects/pulse-studio/pulse-studio_m.jpg` | 900×609 и 700×474 px |
| Loftloom | `/images/projects/loftloom/loftloom.jpg` | `/images/projects/loftloom/loftloom_m.jpg` | 1500×1016 и 700×474 px |

Изображения соотносятся с карточкой, заголовком, кратким описанием и отдельной ссылкой Explore project.

## Рендер-последовательности и видео

- Каменный объект услуг: `/images/stone/frame_0001.webp` и последовательность кадров как минимум до `/images/stone/frame_0371.webp`.
- Орбитальные изображения: `/images/orbit/orbit-01.jpg` … `/images/orbit/orbit-09.jpg`.
- Основное видео услуг и мобильная версия: `/video/homepage-services-video.mp4`, `/video/homepage-services-video_m.mp4`; muted, loop, около 10 с.
- Наградной клип: `/video/awards-card-video.mp4`, `/video/awards-card-video_m.mp4`; muted, loop, около 9.95 с.
- Видео блока команды: `/video/team/rushi.mp4`, `/video/team/rushi_m.mp4` (примерно 2.97 с; URL имел фрагмент `#t=0.1`).

## Отзывы и звук

- Портреты: `/images/zoltan.webp`, `/images/malte.webp`, `/images/stephen.webp`, `/images/doug.webp`, `/images/jean.webp`.
- Звуковые ресурсы: `/audio/thunder.mp3`, `/assets/hero-spark.mp3`, `/assets/hover-beep.mp3`.
- Внутри цитат есть `Listen to him!` для части отзывов; конкретный playback-ресурс/результат нажатия не удалось надёжно установить.

## Примечания

- Ресурсы для canvas и next/media могут загружаться лениво; количество реально полученных stone-frames во время одного прохода не равно общему размеру последовательности.
- Файл `frame_0371.webp` наблюдался как активный ресурс, поэтому утверждение «как минимум 371 кадр» основано на имени источника, а не подсчёте manifest.
- Ассеты дизайна и картинки работ оставлены удалёнными ссылками; здесь нет локальной копии сайта.
