export type Project = {
  name: string;
  category: string;
  task: string;
  solution: string;
  outcome: string;
  focus: string;
  href: string;
  preview: string;
};

export const projects: Project[] = [
  {
    name: "ROKACELL",
    category: "B2B · теплоизоляция",
    task: "Разработать сайт с инженерными калькуляторами по готовому дизайну.",
    solution: "Создал сайт с нуля: расчёты теплопотерь и конденсации, адаптивная вёрстка, мультиязычность и админ-панель.",
    outcome: "Подключил аналитику, оптимизировал код и настроил автоматическую сборку и обновление на сервере.",
    focus: "Каталог · калькулятор",
    href: "https://www.rokacell.com/ru",
    preview: "/sites/mk-studio/projects/rokacell.webp",
  },
  {
    name: "KIMYO",
    category: "Промышленная химия · B2B",
    task: "Упростить поиск реагентов по отраслям и путь к запросу.",
    solution: "Каталог категорий, условия поставок и связь с менеджером.",
    outcome: "Путь от выбора отрасли до обращения собран на одном сайте.",
    focus: "Каталог · поставки",
    href: "https://kimyo.uz/ru",
    preview: "/sites/mk-studio/projects/kimyo.webp",
  },
  {
    name: "GrandClean",
    category: "Клининг · услуги",
    task: "Создать адаптивный сайт клининговой компании по готовому дизайну.",
    solution: "Разработал сайт с нуля, добавил мультиязычность и формы заявок с отправкой в Telegram.",
    outcome: "Настроил SEO и индексацию страниц на разных языках, оптимизировал скорость и адаптировал сайт для мобильных устройств.",
    focus: "Формы · SEO",
    href: "https://grandclean.uz/ru/",
    preview: "/sites/mk-studio/projects/grandclean.webp",
  },
  {
    name: "Sport Center",
    category: "Спорт · презентационный сайт",
    task: "Сделать направления и услуги центра понятными онлайн.",
    solution: "Адаптивный интерфейс с анимациями на GSAP.",
    outcome: "Опубликованная адаптивная версия с анимированными разделами.",
    focus: "GSAP · адаптивность",
    href: "https://microman92.github.io/sport-center/",
    preview: "/sites/mk-studio/projects/sport-center.webp",
  },
  {
    name: "IXORA",
    category: "Бизнес-консалтинг",
    task: "Представить направления компании и помочь изучить локации.",
    solution: "Сайт на Nuxt 3 с локализацией и интерактивной картой.",
    outcome: "Услуги и географические точки доступны в одном интерфейсе.",
    focus: "Nuxt 3 · карты",
    href: "https://microman92.github.io/ixora/",
    preview: "/sites/mk-studio/projects/ixora.webp",
  },
  {
    name: "BRUT AI",
    category: "Барбершоп · учебный проект на курсе",
    task: "Создать сервис записи в барбершоп с выбором дня и времени и сохранением записи в базе данных.",
    solution: "Запись доступна на сайте и в Telegram Mini App. Напоминания приходят за день и за 30 минут до записи.",
    outcome: "Админ-панель позволяет добавлять, редактировать и удалять барберов, управлять их рабочим временем, обедами и выходными, а также смотреть общую аналитику и аналитику по каждому барберу.",
    focus: "Запись · Mini App · админ-панель",
    href: "https://brut-7lyv.vercel.app/",
    preview: "/sites/mk-studio/projects/brut.webp",
  },
];

export const services = [
  {
    title: "Сайты для бизнеса",
    kicker: "ВЕБ-РАЗРАБОТКА",
    visual: "website",
    explanation: "Структура ведёт посетителя от предложения компании к следующему действию.",
    benefit: "Клиенту проще понять услугу и отправить заявку.",
    includes: "Структура · адаптивность · формы · SEO-основа",
  },
  {
    title: "Веб-приложения",
    kicker: "ИНТЕРФЕЙСЫ И СЕРВИСЫ",
    visual: "application",
    explanation: "Объединяю данные и сценарии клиентов или команды в одном веб-интерфейсе.",
    benefit: "Рабочие процессы становятся понятнее и доступны онлайн.",
    includes: "React · Next.js · Vue · Nuxt · интеграции",
  },
  {
    title: "AI-интеграции",
    kicker: "АВТОМАТИЗАЦИЯ",
    visual: "automation",
    explanation: "Связываю AI-инструменты с задачами и системами бизнеса.",
    benefit: "Повторяющиеся операции можно выполнять с меньшим ручным участием.",
    includes: "AI-инструменты · API · автоматизация",
  },
] as const;
