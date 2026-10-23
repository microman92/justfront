export type Project = {
  name: string;
  description: string;
  image: string;
  mobileImage: string;
  width: number;
  height: number;
  href: string;
};

export const projects: Project[] = [
  {
    name: "MyWorker AI",
    description: "AI platform simplifying hiring, management, and workforce scaling.",
    image: "/sites/trionn/projects/myworker/myworker.jpg",
    mobileImage: "/sites/trionn/projects/myworker/myworker-mobile.jpg",
    width: 1500,
    height: 1016,
    href: "https://trionn.com/work/myworker-ai",
  },
  {
    name: "Pulse Studio",
    description: "A motion-led studio website showcasing artists, projects, and culture.",
    image: "/sites/trionn/projects/pulse-studio/pulse-studio.jpg",
    mobileImage: "/sites/trionn/projects/pulse-studio/pulse-studio-mobile.jpg",
    width: 900,
    height: 609,
    href: "https://trionn.com/work/pulse-studio",
  },
  {
    name: "Loftloom",
    description: "Seamless real estate platform for effortless property discovery.",
    image: "/sites/trionn/projects/loftloom/loftloom.jpg",
    mobileImage: "/sites/trionn/projects/loftloom/loftloom-mobile.jpg",
    width: 1500,
    height: 1016,
    href: "https://trionn.com/work/loftloom",
  },
];

export const services = [
  "AI & Intelligent Automation",
  "Web Development",
  "Product Design",
  "Website & Mobile Design",
  "WordPress Development",
  "Branding",
];

export const testimonials = [
  {
    client: "Luxury Presence",
    quote:
      "I've worked with Sunny and his team on several projects and he's one of the best UI/UX designers and front-end developers I know. He's meticulous in his attention to detail and has a true passion for creating beautiful user interfaces.",
    name: "Malte Kramer",
    role: "Founder & CEO · USA",
    portrait: "/sites/trionn/portraits/malte.webp",
  },
  {
    client: "Credible",
    quote:
      "The Trionn team is extremely reliable, professional and talented. It has been a great pleasure collaborating with them over many",
    name: "Stephen Dash",
    role: "Founder & CEO · USA",
    portrait: "/sites/trionn/portraits/stephen.webp",
  },
  {
    client: "Fast Resume",
    quote:
      "Sunny and his award winning team are second to none when it comes to responsive web design. Their ability to take an idea and make it a work of art has always been a great experience. When you find companies like his you make sure to keep them close.",
    name: "Doug Petrie",
    role: "Founder & CEO · USA",
    portrait: "/sites/trionn/portraits/doug.webp",
  },
  {
    client: "Technis",
    quote:
      "Sunny and his team is a very professional, with whom I am used to working on different projects. listening, versatile, very smart, I recommend without hesitation.",
    name: "Jean-Baptiste Biolay",
    role: "General Manager · UAE",
    portrait: "/sites/trionn/portraits/jean.webp",
  },
  {
    client: "Ventigence",
    quote:
      "Trionn team did an amazing development work for my company. They were fast, flexible and very professional. If your organization needs website design, I guess you know who I would recommend to be the 1st on your list.",
    name: "Zoltan Csonka",
    role: "Founder & CEO · UAE",
    portrait: "/sites/trionn/portraits/zoltan.webp",
  },
];

export const awards = [
  ["Awwwards", "/sites/trionn/awards/awwwards.svg"],
  ["CSS Design Awards", "/sites/trionn/awards/ccda.svg"],
  ["The FWA", "/sites/trionn/awards/thefwa.svg"],
  ["CSS Winner", "/sites/trionn/awards/csswinner.svg"],
  ["A' Design Award", "/sites/trionn/awards/adesignaward.svg"],
  ["GSAP", "/sites/trionn/awards/gsap.svg"],
] as const;

export const partners = [
  "/sites/trionn/partners/partner1.svg",
  "/sites/trionn/partners/partner2.svg",
  "/sites/trionn/partners/partner3.svg",
  "/sites/trionn/partners/partner4.svg",
  "/sites/trionn/partners/partner5.svg",
];
