export type Category = 'all' | 'web' | 'ai' | 'quant' | 'cyber';

export interface ProjectLinks {
  live?: string;
  source?: string;
}

export interface Project {
  id: string;
  number: string;
  categories: Exclude<Category, 'all'>[];
  name: string;
  year: string;
  headline: string;
  summary: string;
  role: string;
  tags: string[];
  problem: string;
  decision: string;
  challenges: string;
  architecture: string[];
  result: string;
  next: string;
  context: string;
  demoHint: string;
  fingerprint: [string, string][];
  status: 'live' | 'building';
  links: ProjectLinks;
  shot?: string;
}

export const site = {
  name: 'Japhet Nyangaresi',
  roman: 'JAPHET NYANGARESI',
  role: 'Software Engineer | AI Engineer | Emerging Quantitative Finance Specialist',
  shortRole: 'Software Engineer, AI & Quantitative Finance',
  location: 'Nairobi, Kenya · Remote-friendly',
  availability: 'Open to collaboration, product work and research conversations',
  email: 'japhetkevingtone@gmail.com',
  emailNote: 'Provisional email — confirm before deployment.',
  github: 'https://github.com/kevingtonee',
  linkedin: 'https://www.linkedin.com/in/japhet-nyangaresi-2185762aa/',
  whatsappNumber: '0701616751',
  whatsappInternational: '254701616751',
  whatsappUrl: 'https://wa.me/254701616751',
  formspree: 'https://formspree.io/f/xgokqedp',
  canonical: 'https://japhet-dev-portfolio-chi.vercel.app/',
} as const;

export const social = {
  github: site.github,
  linkedin: site.linkedin,
  whatsapp: site.whatsappUrl,
};

export const copy = {
  name: site.name,
  roman: site.roman,
  role: site.role,
  resumeLabel: 'Resume / Portfolio',
  location: site.location,
  available: site.availability,
  statusNote: 'Selected work, experiments and research directions — clearly labeled by status',
  nav: ['Home', 'About', 'Projects', 'Research', 'Expertise', 'Contact'],
  eyebrow: 'SOFTWARE · AI · QUANTITATIVE FINANCE · CYBERSECURITY',
  heroTitle: ['Engineering intelligence.', 'Exploring complex systems.', 'Building what comes next.'],
  heroIntro:
    'Exploring the intersection of software engineering, artificial intelligence, quantitative finance and computational systems.',
  heroDescription:
    'I build software products and intelligent systems, explore computational approaches to complex problems, and continuously develop my understanding of financial markets, quantitative research and cybersecurity.',
  viewWork: 'Explore my work',
  contactCta: 'Get in touch',
  download: 'Download resume',
  downloaded: 'Your text resume is ready to download',
  downloadFailed: 'Download failed. Please use Print resume below.',
  selected: 'Projects',
  selectedSub: 'Software products, AI experiments, and spaces for emerging research',
  projectHint: 'Filter by discipline · Open a case study for architecture, decisions and demos',
  all: 'All Projects',
  web: 'Web & Software',
  ai: 'AI & Machine Learning',
  quant: 'Quant & Finance',
  cyber: 'Cybersecurity',
  resultCount: 'projects',
  caseStudy: 'View case study',
  close: 'Close case study',
  challenge: 'The challenge',
  approach: 'Technical decisions',
  challenges: 'Implementation challenges',
  architecture: 'Architecture',
  outcome: 'Result / current outcome',
  next: 'What comes next',
  responsibility: 'My contribution',
  demoLabel: 'INTERACTIVE DEMO / LOCAL SAMPLE DATA',
  linksLabel: 'Project links',
  liveLabel: 'Live project',
  sourceLabel: 'Source code',
  buildingLabel: 'In development',
  shotCaption: 'The live product, as shipped',
  statusLive: '● Live',
  statusBuilding: '◐ Building',
  stackLabel: 'Stack',
  fingerprintLabel: 'Technical fingerprint',
  explore: 'Explore project',
  goToProject: 'Go to project',
  prevProject: 'Previous project',
  nextProject: 'Next project',
  carouselLabel: 'Project carousel',
  aboutLabel: 'About',
  aboutTitle: ['A multidisciplinary', 'technologist at work'],
  aboutBody:
    'I am interested in how software, intelligence, markets and security intersect as systems. My work starts with building: shipping web products, designing APIs and data models, and turning ideas into usable tools. From there, I explore AI for practical automation, quantitative methods for understanding financial systems, and cybersecurity as a discipline for building resilient technology. I value careful engineering, honest experimentation, and learning that leads to real work.',
  aboutBody2:
    'The through-line is not a collection of buzzwords — it is a habit of breaking complex problems into models, testing assumptions, and building systems that can be understood, improved and trusted.',
  principles: [
    ['01', 'Systems thinking', 'I approach products and research as systems: inputs, constraints, failure modes, and the human decisions around them.'],
    ['02', 'Build to learn', 'I use prototypes, experiments and shipped products to test ideas. Practical work is where understanding becomes real.'],
    ['03', 'Honest craft', 'I prefer clear claims, readable code, and careful design over inflated language. Credibility is built through evidence.'],
  ],
  expertiseKicker: 'Expertise',
  expertiseTitle: 'Four connected disciplines',
  expertiseSub:
    'One coherent identity, expressed through software engineering, AI, quantitative finance and cybersecurity.',
  researchKicker: 'Research & Technical Notes',
  researchTitle: 'A space for questions, experiments and findings',
  researchSub:
    'Long-form notes and experiments will live here as the work develops — from market research to AI engineering and security investigations.',
  researchEmptyTitle: 'Publishing in progress',
  researchEmptyBody:
    'This journal will document technical experiments, research notes and engineering lessons as they are completed. Planned topics include quantitative market research, AI engineering, application security and system design.',
  researchTopics: [
    ['Quantitative Finance', 'Market structure, strategy research, backtesting experiments, statistical modelling.'],
    ['AI Engineering', 'LLM applications, evaluation, agent workflows, machine learning experiments.'],
    ['Cybersecurity', 'Application security, secure development, vulnerability research notes, defensive engineering.'],
    ['Software Engineering', 'Architecture decisions, system design, performance, and implementation lessons.'],
  ],
  contactKicker: 'Contact',
  contactTitle: ['Have an idea, project,', 'or research conversation?'],
  contactBody:
    'I’m open to software engineering work, AI collaborations, research conversations, and opportunities to build useful systems. If you have a project, question, or idea worth exploring, reach out.',
  contactNote: 'I usually reply within 24 hours. WhatsApp and email are the fastest options.',
  formTitle: 'Send a message',
  formName: 'Name',
  formNamePlaceholder: 'Your name',
  formNameError: 'Please enter your name.',
  formEmail: 'Email',
  formEmailPlaceholder: 'you@example.com',
  formEmailError: 'Please enter a valid email address.',
  formSubject: 'Inquiry type',
  formSubjectError: 'Please select an inquiry type.',
  formMessage: 'Message',
  formMessagePlaceholder: 'Tell me about the project, idea, or question...',
  formMessageError: 'Tell me a little more (at least 10 characters).',
  formSend: 'Send message',
  formSending: 'Sending...',
  formFix: 'Please fix the highlighted fields and try again.',
  formSuccess: "Thanks — your message is on its way. I'll reply soon.",
  formFailed: 'Something went wrong. Please email me directly.',
  formNetwork: 'Network error. Please email me directly at ',
  inquiryOptions: [
    'General inquiry',
    'Software development',
    'AI collaboration',
    'Quantitative finance',
    'Cybersecurity',
    'Research collaboration',
    'Other',
  ],
  copyEmail: 'Copy email address',
  copied: 'Email address copied',
  copyFailed: 'Clipboard unavailable — please copy the address below manually',
  print: 'Print resume / Save PDF',
  footer: 'Built with care, curiosity and code.',
  sculpture: 'Interactive stack globe',
  specimen: 'STACK GLOBE 001',
  sculptureHint: 'Live stack on the globe - drag to rotate - click a chip to pin · ← → to rotate',
  pause: 'Pause motion',
  play: 'Resume motion',
  reset: 'Reset form',
  reduced: 'Reduced motion enabled',
  paused: 'Paused',
  running: 'In motion',
  skip: 'Skip to projects',
  paletteButton: 'Commands',
  paletteTitle: 'Command palette',
  palettePlaceholder: 'Type a command or search…',
  paletteEmpty: 'No matching commands.',
  paletteHint: '↑↓ to move · Enter to run · Esc to close',
  systemStatus: 'System status',
  statusItems: [
    'Static build — served from the edge',
    'Contact endpoint — Formspree',
    'No cookies · no trackers · no analytics beacons',
  ],
  socialsLabel: 'Elsewhere',
  email: site.email,
  whatsappLabel: 'WhatsApp',
  quantEmptyTitle: 'Research in progress',
  quantEmptyBody:
    'Exploring quantitative finance, algorithmic trading, financial modelling and computational approaches to market research. New experiments and research projects will appear here as they develop.',
  cyberEmptyTitle: 'Security research in progress',
  cyberEmptyBody:
    'Developing practical knowledge in cybersecurity, application security and secure systems engineering. This space will document experiments, tools, technical investigations and future research.',
  emptyCategoryBody:
    'No public projects in this category yet. The structure is ready for future work as it develops.',
} as const;

export interface ExpertiseArea {
  id: Exclude<Category, 'all'>;
  title: string;
  description: string;
  items: string[];
  technologies: string[];
  note?: string;
}

export const expertiseAreas: ExpertiseArea[] = [
  {
    id: 'web',
    title: 'Software & Web Engineering',
    description:
      'Designing and building complete digital products — from interface and API design to data models, deployment and maintainable systems.',
    items: [
      'Full-stack development',
      'Frontend engineering',
      'Backend development',
      'API development',
      'Database architecture',
      'Flutter development',
      'Software architecture',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Flutter'],
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence & Machine Learning',
    description:
      'Building AI-powered applications and experimenting with machine learning workflows that are useful, inspectable and grounded in real data or clear constraints.',
    items: [
      'AI application engineering',
      'LLM integrations',
      'AI-powered applications',
      'Machine learning experimentation',
      'Intelligent automation',
      'Python-based experimentation',
    ],
    technologies: ['Python', 'OpenAI APIs', 'RAG', 'scikit-learn', 'Vector search'],
  },
  {
    id: 'quant',
    title: 'Quantitative Finance & Algorithmic Trading',
    description:
      'A developing specialization focused on understanding markets through data, models and disciplined research — with an emphasis on learning by building and testing.',
    items: [
      'Quantitative analysis',
      'Financial modelling',
      'Forex markets',
      'Algorithmic trading',
      'Strategy development',
      'Statistical research',
      'Backtesting',
    ],
    technologies: ['Python', 'Pandas', 'Statistical modelling', 'Backtesting workflows'],
    note: 'Developing specialization — presented through research direction and future experiments, not claimed professional trading experience.',
  },
  {
    id: 'cyber',
    title: 'Cybersecurity',
    description:
      'A developing area of practice centered on secure software, understanding vulnerabilities, and designing systems that are resilient by default.',
    items: [
      'Application security',
      'Security engineering',
      'Vulnerability research',
      'Secure software development',
      'Network and systems security',
    ],
    technologies: ['OWASP Top 10', 'Secure coding', 'Linux', 'Threat modelling'],
    note: 'Developing specialization — no fabricated certifications, client engagements, or vulnerability discoveries.',
  },
];

export const projects: Project[] = [
  {
    id: 'ilana',
    number: '01',
    categories: ['web'],
    name: 'ILANA',
    year: '2026',
    headline: 'Real M-Pesa payments for a real jewellery business',
    summary:
      'A production e-commerce platform for Ilana, a Kenyan jewellery retailer — live Safaricom M-Pesa Daraja STK Push payments, an admin dashboard and WhatsApp enquiries, deployed on Vercel with a Neon Postgres database.',
    context: 'Client project · Shipped & live · Design + full-stack build',
    role: 'End-to-end delivery: schema design, payments, admin dashboard, deployment and product UX',
    tags: ['NEXT.JS 16', 'TYPESCRIPT', 'M-PESA DARAJA', 'POSTGRESQL', 'PRISMA'],
    problem:
      'A jewellery retailer was losing ready-to-buy customers to manual WhatsApp orders and manual payment confirmation. They needed a real store where customers could browse, pay by M-Pesa, and where staff could manage orders without developer intervention.',
    decision:
      'Implemented a sandbox-first M-Pesa Daraja STK Push flow with server-side order state and idempotent callbacks. Kept the storefront and admin in one Next.js system, used Prisma with Neon Postgres for reliable data modelling, and separated admin access with NextAuth v5.',
    challenges:
      'Payment flows are unforgiving: callbacks can arrive late, twice, or out of order. The main challenge was making order state transitions reliable while keeping the customer experience simple and trustworthy.',
    architecture: ['Next.js 16 storefront + admin', 'M-Pesa Daraja STK Push + callbacks', 'Prisma + Neon Postgres', 'Vercel Blob media + NextAuth v5'],
    fingerprint: [
      ['Frontend', 'Next.js 16 · TypeScript'],
      ['Data', 'Prisma · Neon PostgreSQL'],
      ['Payments', 'M-Pesa Daraja · STK Push'],
      ['Platform', 'Vercel · Vercel Blob · NextAuth v5'],
    ],
    result:
      'Live and taking real orders. The interactive demo below reproduces the STK Push flow used by the production store in a sandboxed, local sample-data slice.',
    next: 'Loyalty and repeat-customer flows, richer admin analytics, and catalogue expansion.',
    demoHint: 'Add pieces to the cart, then pay with M-Pesa — watch the STK Push flow.',
    status: 'live',
    links: { live: 'https://e-commerce-one-theta-84.vercel.app/', source: 'https://github.com/kevingtonee/ilana-ecommerce' },
    shot: '/img/ilana.webp',
  },
  {
    id: 'remarket',
    number: '02',
    categories: ['web'],
    name: 'ReMarket',
    year: '2025',
    headline: 'Buy smart. Sell what you no longer need.',
    summary:
      'A production-ready second-hand marketplace: discovery, listings, realtime messaging and offers — with payments, delivery, escrow and verification designed as clean future additions.',
    context: 'Independent product · V1 live · Design + full-stack build',
    role: 'Product design, data model, realtime messaging and offer flow implementation',
    tags: ['NEXT.JS 15', 'SUPABASE', 'REALTIME', 'SHADCN/UI', 'ZOD'],
    problem:
      'Informal selling often happens in chaotic chat groups: no search, no structured listings, no price history, and no clear way to track offers. Buyers scroll endlessly; sellers repost the same item repeatedly.',
    decision:
      'Modelled the listing lifecycle explicitly — draft, live, offer, sold — instead of bolting states onto a generic posts table. Used Supabase Realtime for messaging and offers, and Zod-validated forms to keep listing data structured and searchable.',
    challenges:
      'The hardest part was balancing flexibility with structure: listings needed to feel easy to publish, but the underlying data model had to support search, offers and future transaction features without a rewrite.',
    architecture: ['Next.js 15 + shadcn/ui storefront', 'Supabase Postgres + Realtime', 'Offer & message state machine', 'Zod + React Hook Form validation'],
    fingerprint: [
      ['Frontend', 'Next.js 15 · shadcn/ui'],
      ['Data', 'Supabase Postgres · Realtime'],
      ['Validation', 'Zod · React Hook Form'],
      ['State', 'Offer & message state machine'],
    ],
    result:
      'V1 is live with discovery, listings, messaging and offers. The demo below is a local sample-data slice of the offer flow.',
    next: 'Payments, delivery coordination, escrow and identity verification — designed for, not shipped yet.',
    demoHint: 'Search the listings, open one, and make an offer — the seller answers.',
    status: 'live',
    links: { live: 'https://remarket-ecru.vercel.app/', source: 'https://github.com/kevingtonee/remarket' },
    shot: '/img/remarket.webp',
  },
  {
    id: 'vibemeet',
    number: '03',
    categories: ['web'],
    name: 'VibeMeet',
    year: '2025',
    headline: 'Realtime messaging people can actually feel',
    summary:
      'A social platform with realtime messaging, profiles and content sharing — React on the front, Supabase handling auth, storage and realtime subscriptions.',
    context: 'Independent product · Live · Frontend + backend',
    role: 'Realtime architecture, profiles, messaging UX and data rules',
    tags: ['REACT', 'SUPABASE', 'REALTIME', 'TAILWIND CSS'],
    problem:
      'Many social apps feel static because nothing moves until a refresh. Connection needs presence, instant delivery, and conversations that update as they happen.',
    decision:
      'Used one Supabase Realtime channel per conversation, optimistic message rendering with reconciliation, and presence heartbeats so online state reflects reality. Enforced auth and storage rules in Postgres row-level security, not just in the UI.',
    challenges:
      'Realtime UX can feel broken if optimistic updates, subscriptions and reconciliation disagree. The challenge was making message delivery feel immediate while keeping state consistent.',
    architecture: ['React SPA + Tailwind frontend', 'Supabase auth + RLS policies', 'Realtime channel per conversation', 'Optimistic sends + reconciliation'],
    fingerprint: [
      ['Frontend', 'React · Tailwind CSS'],
      ['Backend', 'Supabase auth · RLS policies'],
      ['Realtime', 'Channel per conversation'],
      ['UX', 'Optimistic sends · presence heartbeats'],
    ],
    result:
      'Live with profiles, sharing and realtime chat. The demo below shows the messaging core with local sample data.',
    next: 'Group calls, notification digests and moderation tooling as the community grows.',
    demoHint: 'Switch channels and send a message — replies arrive in realtime.',
    status: 'live',
    links: { live: 'https://mmu-vibe-meet.netlify.app/', source: 'https://github.com/kevingtonee/vibeMeet-frontend' },
  },
  {
    id: 'studenthub',
    number: '04',
    categories: ['web'],
    name: 'Student Hub',
    year: '2026',
    headline: 'A calmer way to manage schedules, grades and study plans',
    summary:
      'A productivity platform for course scheduling, grade tracking and study groups — currently being built with Next.js and Supabase, with a working planner and grade model.',
    context: 'In development · Independent product · Design + full-stack',
    role: 'Product design, data model, planner logic and grade computation',
    tags: ['NEXT.JS', 'SUPABASE', 'TYPESCRIPT'],
    problem:
      'Timetables, grades, deadlines and study groups often live in separate places. Planning becomes manual, and important conflicts or grade risks are discovered too late.',
    decision:
      'Modelled the week as first-class data — recurring class blocks rather than hand-typed calendar events — so clash detection and daily views are queries, not ad hoc features. Grade tracking computes standing continuously instead of only at exam time.',
    challenges:
      'The main challenge is designing a data model that feels simple in the UI but handles recurring schedules, exceptions and grade calculations correctly as the product grows.',
    architecture: ['Next.js + TypeScript app', 'Supabase Postgres + auth', 'Recurring schedule model', 'Continuous grade computation'],
    fingerprint: [
      ['Frontend', 'Next.js · TypeScript'],
      ['Data', 'Supabase Postgres · auth'],
      ['Model', 'Recurring schedule blocks'],
      ['Compute', 'Continuous grade standing'],
    ],
    result:
      'The planner and grade tracker below are the working core, running on local sample data. Scheduling and study-group features are still in development.',
    next: 'Study-group matching, deadline reminders and a refined mobile experience. Links will be added as it ships.',
    demoHint: 'Switch days to browse the timetable; grade bars update live.',
    status: 'building',
    links: {},
  },
  {
    id: 'nuru',
    number: '05',
    categories: ['ai', 'web'],
    name: 'Nuru AI',
    year: '2026',
    headline: 'Support answers from the shop’s own data, not a script',
    summary:
      'An AI support copilot for small businesses — answers customer questions from a merchant’s own catalogue and policies with retrieval-augmented generation, tool-use for order lookups, and a clean handoff when confidence is low.',
    context: 'In development · Independent product · Design + full-stack + AI',
    role: 'Retrieval pipeline, tool-use design, evaluation planning and product UX',
    tags: ['NEXT.JS', 'OPENAI', 'PGVECTOR', 'SUPABASE', 'TOOL USE'],
    problem:
      'Small businesses answer the same customer questions repeatedly — prices, materials, delivery, returns. Generic chatbots invent answers; a useful assistant needs to be grounded in the merchant’s own data and know when to hand off to a human.',
    decision:
      'Used a retrieval-first approach: responses are composed from embedded catalogue and policy chunks with auditable sources. Order-status questions go through a typed tool, not model memory. Low retrieval confidence triggers a WhatsApp handoff instead of a guess.',
    challenges:
      'The key challenge is trust. A helpful answer that is wrong is worse than no answer, so the system needs source grounding, confidence gates and clear handoff behaviour.',
    architecture: ['Next.js + TypeScript app', 'OpenAI embeddings + pgvector retrieval', 'Tool-use for catalogue & order lookup', 'Confidence gate → WhatsApp handoff'],
    fingerprint: [
      ['Frontend', 'Next.js · TypeScript'],
      ['AI', 'OpenAI · RAG · tool-use'],
      ['Data', 'Supabase pgvector'],
      ['Handoff', 'WhatsApp on low confidence'],
    ],
    result:
      'The retrieval loop, tool layer and handoff logic are working against the ILANA catalogue as a test bed. The demo below is a scripted preview of the interaction model — canned answers, no live model.',
    next: 'An evaluation set of real customer questions, merchant self-serve onboarding, and WhatsApp Business API integration.',
    demoHint: 'Ask about materials, delivery or returns — answers cite their sources.',
    status: 'building',
    links: {},
  },
  {
    id: 'gradecast',
    number: '06',
    categories: ['ai'],
    name: 'GradeCast',
    year: '2026',
    headline: 'Know your final grade before the exam, not after',
    summary:
      'A small machine-learning experiment that forecasts final course grades from coursework, attendance and study habits — a scikit-learn linear model whose exported weights run entirely in the browser.',
    context: 'In development · ML experiment · Model + web app',
    role: 'Data model, training pipeline, browser inference and explanation UX',
    tags: ['PYTHON', 'SCIKIT-LEARN', 'ML', 'NEXT.JS'],
    problem:
      'Students often discover they are at risk too late. The signals — coursework marks, attendance, study hours — exist during the semester, but they are rarely turned into an interpretable forecast.',
    decision:
      'Started with an interpretable linear model instead of a black box: the weights are the explanation, and exporting them to JSON allows the browser to run inference with zero API calls. Sliders make the model something a user can interrogate, not just read.',
    challenges:
      'The challenge is balancing simplicity and honesty. A simple model is interpretable, but it must be clearly presented as a synthetic-data experiment until real, anonymised data is collected and evaluated.',
    architecture: ['Python + scikit-learn training pipeline', 'Features: coursework · attendance · study hours', 'Weights exported to JSON', 'Client-side inference in the web app'],
    fingerprint: [
      ['Model', 'Python · scikit-learn'],
      ['Export', 'JSON weights'],
      ['Inference', 'Browser · zero API calls'],
      ['Target', 'Student Hub integration concept'],
    ],
    result:
      'The demo below runs the exported linear model live in your browser. The training set is synthetic while real, anonymised data is collected.',
    next: 'A real anonymised dataset, confidence intervals, and integration into the Student Hub grade tracker.',
    demoHint: 'Drag the sliders — the forecast updates from the exported model weights.',
    status: 'building',
    links: {},
  },
];
