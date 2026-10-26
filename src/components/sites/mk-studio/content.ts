export type Project = {
  name: string;
  category: string;
  description: string;
  focus: string;
  href: string;
};

export const projects: Project[] = [
  {
    name: "ROKACELL",
    category: "B2B · теплоизоляция",
    description: "Корпоративный сайт с каталогом продукции и интерактивными техническими калькуляторами.",
    focus: "Каталог · калькуляторы",
    href: "https://www.rokacell.com/ru",
  },
  {
    name: "KIMYO",
    category: "Промышленная химия",
    description: "Мультиязычный корпоративный сайт на Next.js и TypeScript.",
    focus: "Next.js · TypeScript",
    href: "https://kimyo.uz/ru",
  },
  {
    name: "GrandClean",
    category: "Клининг · услуги",
    description: "Сайт клининговой компании с формами заявок и SEO-разметкой.",
    focus: "Формы · SEO",
    href: "https://grandclean.uz/ru/",
  },
  {
    name: "Sport Center",
    category: "Спорт · презентационный сайт",
    description: "Адаптивный сайт с анимациями на GSAP.",
    focus: "GSAP · адаптивность",
    href: "https://microman92.github.io/sport-center/",
  },
  {
    name: "IXORA",
    category: "Бизнес-консалтинг",
    description: "Сайт на Nuxt 3 с локализацией и интерактивными картами.",
    focus: "Nuxt 3 · карты",
    href: "https://microman92.github.io/ixora/",
  },
  {
    name: "BRUT AI",
    category: "Экспериментальный проект",
    description: "Экспериментальный проект в направлении искусственного интеллекта.",
    focus: "AI · веб-интерфейс",
    href: "https://brut-7lyv.vercel.app/",
  },
];

export const services = [
  "Разработка сайтов",
  "Веб-приложения",
  "AI-интеграции и автоматизация",
];
