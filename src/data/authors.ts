export interface Author {
  slug: string;
  name: string;
  nameRu: string;
  role: string;
  roleRu: string;
  bio: string;
  bioRu: string;
  photo: string;
  linkedin: string;
  expertise: string[];
  expertiseRu: string[];
}

export const authors: Author[] = [
  {
    slug: 'samal-bekmaganbetova',
    name: 'Samal Bekmaganbetova',
    nameRu: 'Самал Бекмаганбетова',
    role: 'Privacy & Data Governance Advisor',
    roleRu: 'Советник по приватности и управлению данными',
    bio: `Samal Bekmaganbetova is a Programme Manager at the United Nations Office for Disaster Risk Reduction (UNDRR), where she leads initiatives on urban resilience and disaster risk reduction in Central Asia. With a background spanning international development, digital governance, and data protection frameworks, Samal brings a unique perspective on why privacy matters — not just as a legal requirement, but as a fundamental right in an era of pervasive digital surveillance.

Her work at the United Nations has given her firsthand insight into how sensitive meeting data, organizational communications, and confidential planning discussions can be exposed when organizations rely on cloud-based tools without understanding where their data actually goes. She holds a Master of Public Administration from Nazarbayev University and a Bachelor of Science in Telecommunication Engineering Technology from Rochester Institute of Technology.

At Siplinx AI, Samal contributes articles on data privacy, digital sovereignty, and the real-world risks of cloud-based AI tools — helping professionals understand why keeping meeting content on their own device is the only approach that truly protects confidentiality.`,
    bioRu: `Самал Бекмаганбетова — менеджер программ в Офисе ООН по снижению риска бедствий (UNDRR), где она руководит инициативами по устойчивости городов и снижению рисков стихийных бедствий в Центральной Азии. Имея опыт в международном развитии, цифровом управлении и фреймворках защиты данных, Самал привносит уникальный взгляд на то, почему приватность важна — не просто как юридическое требование, но как фундаментальное право в эпоху повсеместного цифрового наблюдения.

Её работа в ООН дала ей непосредственное понимание того, как чувствительные данные встреч, организационные коммуникации и конфиденциальные планерки могут быть раскрыты, когда организации используют облачные инструменты, не понимая, куда именно уходят их данные. Она имеет степень магистра государственного управления Назарбаев Университета и степень бакалавра по технологии телекоммуникационной инженерии Рочестерского технологического института.

В Siplinx AI Самал пишет статьи о защите данных, цифровом суверенитете и реальных рисках облачных AI-инструментов — помогая профессионалам понять, почему хранение данных встреч на собственном устройстве — единственный подход, который действительно защищает конфиденциальность.`,
    photo: '/images/authors/samal-bekmaganbetova.jpg',
    linkedin: 'https://www.linkedin.com/in/samalbek',
    expertise: ['Data Privacy', 'Digital Governance', 'International Frameworks', 'Disaster Risk Reduction', 'Urban Resilience'],
    expertiseRu: ['Защита данных', 'Цифровое управление', 'Международные стандарты', 'Снижение рисков', 'Устойчивость городов'],
  },
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}
