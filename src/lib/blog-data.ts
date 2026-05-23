export type StaticBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  authorName: string;
  createdAtDate: string;
  content: string;
  isProgrammatic?: boolean;
  directAnswer?: string;
  faq?: { question: string; answer: string }[];
  tableData?: {
    title: string;
    headers: string[];
    rows: string[][];
  };
};

export const blogPosts: StaticBlogPost[] = [
  {
    slug: 'unilag-merit-admission-list-2024',
    title: 'UNIVERSITY OF LAGOS RELEASES 2024 MERIT ADMISSION LIST',
    excerpt: 'Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070',
    category: 'Admission News',
    authorName: 'John Doe',
    createdAtDate: '2024-01-01',
    content: `## UNIVERSITY OF LAGOS RELEASES 2024 MERIT ADMISSION LIST

Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.

### Check Admission Status

All candidates who sat for the post-UTME screening can now log on to the JAMB Central Admission Processing System (CAPS) to check their admission status and accept the offer.

We congratulate all successfully admitted students and welcome them to the University of Lagos community! Our admission consultants are standing by if you need assistance accepting your offer.`,
    faq: [
      { question: "How do I check my status?", answer: "Login to your JAMB CAPS portal using your registered email and password." },
      { question: "What is the acceptance deadline?", answer: "Usually within two weeks of release. Candidates are encouraged to accept promptly." }
    ]
  },
  {
    slug: 'supplementary-admission-form-2024-2025',
    title: 'SUPPLEMENTARY ADMISSION FORM FOR THE 2024/2025 ACADEMIC SESSION',
    excerpt: 'Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070',
    category: 'Admission News',
    authorName: 'Jane Smith',
    createdAtDate: '2024-02-01',
    content: `## SUPPLEMENTARY ADMISSION FORM FOR THE 2024/2025 ACADEMIC SESSION

Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.

### Application Details

Candidates who did not find their name on the merit list but met the baseline cutoff marks are eligible to purchase the supplementary form. 

Ensure to submit your forms before the deadline. Pinnacle Academia's support team is available to assist with processing and program selection advice to maximize your chances of acceptance.`,
    faq: [
      { question: "Who is eligible?", answer: "Candidates who passed the UTME and post-UTME screening but were not admitted on the merit list." }
    ]
  },
  {
    slug: 'funaab-commence-degree-library-info-science',
    title: 'FEDERAL UNIVERSITY OF AGRICULTURE ABEOKUTA (FUNAAB) Set to Commence Bachelor’s Degree in Library and Information Science',
    excerpt: 'Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070',
    category: 'Scholarship and Opportunities',
    authorName: 'Alice Johnson',
    createdAtDate: '2024-03-01',
    content: `## FEDERAL UNIVERSITY OF AGRICULTURE ABEOKUTA (FUNAAB) Set to Commence Bachelor’s Degree in Library and Information Science

Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.

### Academic Innovation

FUNAAB is expanding its academic scope by introducing this new program. The course is fully accredited and will equip students with advanced info curation and digital library management skills starting this session.`,
    faq: [
      { question: "Is the course accredited?", answer: "Yes, it is fully accredited by the National Universities Commission (NUC)." }
    ]
  },
  {
    slug: 'uniuyo-begins-uploading-admission-list-jamb-caps',
    title: 'UNIVERSITY OF UYO (UNIUYO) BEGINS UPLOADING OF ADMISSION LIST ON JAMB CAPS FOR 2024/2025 ACADEMIC SESSION',
    excerpt: 'Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070',
    category: 'Admission News',
    authorName: 'Bob Brown',
    createdAtDate: '2024-03-01',
    content: `## UNIVERSITY OF UYO (UNIUYO) BEGINS UPLOADING OF ADMISSION LIST ON JAMB CAPS FOR 2024/2025 ACADEMIC SESSION

Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.

### Upload Details

Candidates are advised to upload their O'Level results on JAMB CAPS and monitor their profile closely to accept the admission. Candidates who fail to upload their results on CAPS may lose their slots.`,
    faq: [
      { question: "How do I upload my O'Level results?", answer: "Visit an accredited JAMB CBT center to upload your results on your JAMB profile." }
    ]
  },
  {
    slug: 'jamb-caps-how-it-works',
    title: 'JAMB Central Admission Processing System (CAPS): How It Works',
    excerpt: 'Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    category: 'Waec/Jamb News',
    authorName: 'Charlie Davis',
    createdAtDate: '2024-03-01',
    content: `## JAMB Central Admission Processing System (CAPS): How It Works

Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.

### The Admission Mechanism

JAMB CAPS ensures credibility and automation in the university admissions process. Under CAPS, universities submit proposed admission lists which JAMB approves. Candidates must accept or reject the offer on their profiles before the admission is finalized.`,
    faq: [
      { question: "What is CAPS?", answer: "CAPS stands for Central Admission Processing System, introduced by JAMB to automate admission processes." }
    ]
  },
  {
    slug: 'unilag-merit-admission-list-2024-dup',
    title: 'UNIVERSITY OF LAGOS RELEASES 2024 MERIT ADMISSION LIST',
    excerpt: 'Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070',
    category: 'Admission News',
    authorName: 'Emily Evans',
    createdAtDate: '2024-03-01',
    content: `## UNIVERSITY OF LAGOS RELEASES 2024 MERIT ADMISSION LIST

Unilag has released the 2024 merit admission list on the JAMB CAP and their portal for the 2023/24 session.

### Check Status and Accept Offer

Candidates are urged to proceed to check their status on JAMB CAPS and accept immediately. Follow our admission consultation support if you encounter any difficulties.`
  }
];

export const allBlogPosts = blogPosts;

export function getRelatedPosts(currentSlug: string, count: number = 3): StaticBlogPost[] {
  const currentPost = allBlogPosts.find(p => p.slug === currentSlug);
  if (!currentPost) return [];

  const sameCategory = allBlogPosts.filter(p => p.category === currentPost.category && p.slug !== currentSlug);
  const fallback = allBlogPosts.filter(p => p.slug !== currentSlug);

  const pool = sameCategory.length > 0 ? sameCategory : fallback;
  return pool.slice(0, count);
}
