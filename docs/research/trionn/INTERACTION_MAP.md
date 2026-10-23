# Trionn — карта взаимодействий

| Элемент / действие | Driver | Наблюдаемое поведение |
|---|---|---|
| Фиксированная шапка | scroll + click | Логотип остаётся у левого края; справа расположены звук, `Let's Talk` и `Menu`. Высота примерно 102 px при desktop 1440 и 63 px при mobile 390. |
| Menu, desktop | click | Открывает отдельную светлую панель в верхней/правой части: Work, Services, About, Contact, объяснение имени TRIONN, деловой контакт и соцсети. Hero остаётся видимым за панелью. |
| Menu, mobile | click | Открывает тёмное полноэкранное меню с крупными центрированными Work / Services / About / Contact. Высота ссылок использует экран целиком. |
| Sound | click | Кнопка меняет доступное имя с `Enable sound` на `Mute sound`; повторное нажатие возвращает начальное состояние. По завершении проверки звук выключен. Загружены отдельные sound-effects для hero и hover; не каждое действие воспроизводит звук. |
| Let's Talk | click | Открывает inquiry-form в светлой панели поверх страницы. На desktop панель справа занимает примерно 490×871 px в viewport 1440×900; на mobile — около 353×379 px внутри 390×844. |
| Discuss Your Project / Become a client | click | Ведут к той же форме контакта. Форма имеет Close; Escape закрыл открытую контактную панель. |
| Форма контакта | click / type | Имя, Email, Company/Website, Service, короткое описание проекта, Budget, Send Inquiry; рядом есть Book a 30-minute call и email. Форму не отправлял. |
| Service dropdown | click | Список: Website Design & Development; UI/UX Design; Web Development; Mobile App Design; Branding & Identity; AI-Powered Digital Product; Something Else. |
| Budget dropdown | click | Список: `$5K - $15K`, `$15K - $30K`, `$30K - $60K`, `$60K+`, `Not sure yet`. |
| Ссылка проекта | click | Карточки MyWorker AI, Pulse Studio и Loftloom имеют `Explore project`; адреса ведут на соответствующие work-страницы. Сами страницы кейсов не открывались в рамках исследования главной. |
| Book a 30-minute call | click | Внешнее бронирование; ссылку зафиксировал, переход на календарь не выполнял. |
| Testimonials desktop | click | Пять названий клиентов — Luxury Presence, Credible, Fast Resume, Technis, Ventigence — вручную меняют цитату, клиента и портрет. Неактивные названия примерно на 30% opacity. |
| Testimonials mobile | click | Список названий скрыт; доступны стрелки внизу карточки. Переход ручной стрелкой переставляет отзыв в цикле. В DOM стрелки реализованы как `div` с `cursor:pointer`, без `role=button`/`tabindex`; клавиатурную активацию для них не удалось подтвердить. |
| Listen to him! | click | Кнопка присутствует у трёх отзывов. Результат клика не был подтверждён из-за перекрытия pinned-сцены/сложного расположения карточки на странице в момент проверки; не делать вывод о типе воспроизводимого медиа. |
| Project card hover | hover | Изображение MyWorker AI не показало заметного scale/filter: computed transform был `none`, opacity 1. Переход курсора/CTA может быть отдельным от изображения. |
| Hero pointer | pointer | Движение по активной области вызывает световую дугу/искры на орбитальных линиях. При удержании — эффект blast и распад монограммы на фрагменты. |
| Hero sound toggle | click | Доступное имя состояния явно меняется `Enable sound` ↔ `Mute sound`. В момент проверки звуковой loop был приостановлен; toggle был возвращён в выключенное состояние. |

## Клавиатура и доступность

- Модальная форма закрывается Escape; форма обозначена `role=dialog`.
- Основные ссылки/CTA представлены кнопками или ссылками. Названия aria присутствуют у toggle звука и CTA `Become a client`.
- У мобильных стрелок отзывов семантический узел в snapshot не определён как кнопка и клавиатурная фокусируемость не подтверждена — это фактическое наблюдение по DOM/a11y snapshot.
- Проверено только одно состояние reduced motion: при эмуляции `prefers-reduced-motion: reduce` hero-word продолжал меняться. Это не полный аудит доступности.
- Canvas у hero и галереи помечен `pointer-events:none`, поэтому сам canvas не перехватывает клики по DOM-контролам.

## Снимки состояний

- `screenshots/desktop-menu-open.png`, `screenshots/mobile-menu-open.png`
- `screenshots/desktop-contact-open.png`, `screenshots/desktop-contact-service-options.png`, `screenshots/desktop-contact-budget-options.png`, `screenshots/mobile-contact-settled.png`
- `screenshots/desktop-testimonials-default.png`, `screenshots/desktop-testimonials-fastresume.png`, `screenshots/mobile-testimonials-section.png`
