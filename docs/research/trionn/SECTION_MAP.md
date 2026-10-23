# Trionn — карта секций главной страницы

Позиции ниже — document coordinates, снятые в разных состояниях страницы. В pinned-участках видимая сцена сохраняется на протяжении намного большей дистанции, чем высота её DOM section. Поэтому числа нужны как ориентиры, а не как жёсткие границы маршрута.

| Порядок | Раздел | Desktop 1440×900 | Mobile 390×844 | Содержание и композиция |
|---:|---|---|---|---|
| 1 | Header + Hero | top 0, hero ~900 px | top 0, hero ~844 px | Знак и орбиты, `Designed to mean [word].`, Discuss Your Project, Book a 30-minute call, EST. 2012, 14+ years, короткий positioning-текст. |
| 2 | About | около y=900, около одного viewport | около y=844, около одного viewport | About-текст независимой студии, statement `WE DESIGN FOR LONGEVITY`, большая display-фраза. |
| 3 | Vision | видимый вход около y=1800; pinned-прогресс продолжается до Key Facts | около y=1688; занимает длинную сцену до фактов | `FOCUSED VISION. MEASURED EXECUTION.`, повторяющийся ticker `INSPIRE / INNOVATE / IMPACT`, монограмма и подпись `FROM IDEA TO OUTCOME.` |
| 4 | Key facts и business partners | `#keyfacts-section` top ~3600, h ~1081 px | top ~3376, h ~844 px | Заголовок Key facts; Featured & Awards — целевой счётчик 50; Projects Completed — 1.5K+; Our Team Members — 20+; пять логотипов бизнес-партнёров. |
| 5 | Selected work | вход pinned-сцены около y=4681; общая зона работ/услуг около 13,050 px | карточки встречаются около y=4500–6350 | MyWorker AI, Pulse Studio, Loftloom, описания, Explore project, View All Projects. Desktop — горизонтальный рельс; mobile — вертикальная стопка. |
| 6 | Services | вместе с work-переходом; заканчивается перед отзывами около y=17731 | `#trionn-services` около y=6358; длинная смена услуг до testimonial зоны около y=13954 | Видео и кадры каменного знака; AI & Intelligent Automation, Web Development, Product Design, Website & Mobile Design, WordPress Development, Branding, View Services. |
| 7 | Client stories | `#testimonials` top около y=17731, h ~983 px | `#testimonials` top около y=13954, h ~856 px | Вводная строка, пять клиентских отзывов, цитата и автор/портрет, Listen to him!, стрелки и Become a client. |
| 8 | Design in Motion / Dribbble | после отзывов, pinned примерно на 6,750 px | после отзывов; галерея и CTA идут компактнее | Движущаяся перспективная галерея, крупный заголовок, `Exploring ideas through daily design practice`, объяснение и View on Dribbble. На mobile — двухколоночная сетка. |
| 9 | Footer | последний блок у нижней границы страницы, около y=22k–23.7k | последние ~800 px у y=18.6k–19.45k | `Ready to build something bold?`, business email и телефон, соцсети, Discuss Your Project, Book a call, локальное время IST, copyright 2026 и canvas-фон. |

## Схема хода

```text
Hero → About → Vision (pinned / ticker + знак) → Key facts
     → Selected work + Services (длинный pinned track)
     → Client stories → Design in Motion → Footer
```

## Отдельные overlay-состояния

- Меню — поверх текущего экрана; desktop панель светлая, mobile полноэкранная тёмная.
- Контактная форма — отдельная модальная светлая панель поверх любой секции; подложка затемняется.
- Их высота и порядок не включены в document-flow страницы.

## Наблюдения о темпе

Hero и About занимают примерно по viewport. Vision начинает визуально проявляться после About и удерживает длинную сцену для ticker и монограммы. Key Facts служит спокойным информационным переходом. Дальше страница резко растягивает scroll через работы и услуги; за этим следуют подтверждения отзывами, лёгкая галерея и контактный финал.
