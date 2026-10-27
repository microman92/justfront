export type ReviewSlot = {
  id: string;
  category: string;
  title: string;
  quote?: string;
  author?: string;
  screenshot?: string;
  source?: string;
  sourceUrl?: string;
};

// Fill these slots with the supplied reviews and screenshots.
export const reviewSlots: ReviewSlot[] = [
  { id: "client", category: "О РАЗРАБОТКЕ", title: "Работа над сайтом" },
  { id: "student-1", category: "О ПРЕПОДАВАНИИ", title: "Опыт обучения" },
  { id: "student-2", category: "О ПРЕПОДАВАНИИ", title: "Опыт обучения" },
  { id: "student-3", category: "О ПРЕПОДАВАНИИ", title: "Опыт обучения" },
];
