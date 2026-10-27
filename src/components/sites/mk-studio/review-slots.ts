export type ReviewSlot = {
  id: string;
  side: "site" | "teaching";
  category: string;
  title: string;
  quote: string;
  fullText?: string;
  author: string;
  source: string;
  screenshot?: string;
};

export const reviewSlots: ReviewSlot[] = [
  {
    id: "alexander", side: "site", category: "О РАЗРАБОТКЕ САЙТА", title: "Работа над сайтом",
    quote: "Работу выполняет быстро, качественно, активно предлагает привнести что-то в работу, чтобы визуально и стилистически её улучшить.",
    author: "Alexander Solovyev", source: "LINKEDIN", screenshot: "/sites/mk-studio/reviews/linkedin-alexander.png",
  },
  {
    id: "natalia", side: "site", category: "О РАЗРАБОТКЕ САЙТА", title: "Работа над сайтом",
    quote: "Вы довольно быстро во всём разобрались, исправили ошибки и добавили всё, что мы просили. В общем, результатом очень довольны.",
    author: "Наталья Кузнецова", source: "ЛИЧНАЯ ПЕРЕПИСКА · TELEGRAM", screenshot: "/sites/mk-studio/reviews/telegram-natalia.png",
  },
  {
    id: "dmitry", side: "site", category: "О РАЗРАБОТКЕ САЙТА", title: "Работа над сайтом",
    quote: "Учёл все правки и сам предлагал идеи, как сделать лучше. Сайт работает отлично, на телефоне тоже удобно.",
    author: "Дмитрий Соколов", source: "ЛИЧНАЯ ПЕРЕПИСКА · TELEGRAM", screenshot: "/sites/mk-studio/reviews/telegram-dmitry.png",
  },
  {
    id: "seva", side: "teaching", category: "О ПРЕПОДАВАНИИ", title: "Обучение в PROWEB",
    quote: "Спасибо преподавателю Михаилу, он всегда помогал если что-то было не понятно, всегда интересно объяснял тему.",
    author: "сева", source: "УЧЕНИЧЕСКАЯ ГРУППА · TELEGRAM", screenshot: "/sites/mk-studio/reviews/student-group.png",
  },
  {
    id: "marxabo", side: "teaching", category: "О ПРЕПОДАВАНИИ", title: "Обучение в PROWEB",
    quote: "Отдельное спасибо Михаилу за профессионализм, терпение и умение доступно объяснять даже сложные темы.",
    author: "Marxabo Fazilova", source: "GOOGLE", screenshot: "/sites/mk-studio/reviews/google-marxabo.png",
  },
  {
    id: "sevinch", side: "teaching", category: "О ПРЕПОДАВАНИИ", title: "Обучение в PROWEB",
    quote: "Он всегда помогал разобраться с кодом и проектами, объяснял непонятные моменты если что-то не понятно.",
    author: "Sevinch Abdullayeva", source: "GOOGLE", screenshot: "/sites/mk-studio/reviews/google-sevinch.png",
  },
  {
    id: "maryam", side: "teaching", category: "О ПРЕПОДАВАНИИ", title: "Отзыв родителя",
    quote: "Спасибо за Ваше терпение, спокойствие и за то, что смогли заинтересовать его так, что он ходил на занятия с большим удовольствием.",
    fullText: "Михаил, здравствуйте! Хотела выразить вам свою благодарность за этот увлекательный курс и за всё, чему вы научили нашего Пулата. Спасибо за ваше терпение, спокойствие и за то, что смогли заинтересовать его так, что он ходил на занятия с большим удовольствием. Для нас, родителей, очень ценно видеть, как ребёнок стал увереннее, начал больше думать, интересоваться новым и с радостью рассказывать дома о своих проектах и уроках. Это во многом ваша заслуга. Спасибо вам не только за знания, но и за отношение к детям, поддержку и внимание. Желаем вам сил, вдохновения и таких же заинтересованных учеников! До новых встреч!",
    author: "Maryam Muradova", source: "ЛИЧНАЯ ПЕРЕПИСКА · TELEGRAM", screenshot: "/sites/mk-studio/reviews/telegram-maryam-blurred.png",
  },
];
