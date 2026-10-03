export type Locale = 'cn' | 'en';
export type Category = 'all' | 'product' | 'system' | 'experiment';
export interface ProjectLinks { live?: string; source?: string }
export interface Project {
 id: string; number: string; category: Exclude<Category,'all'>; name: string; year: string; headline: string;
 summary: string; role: string; tags: string[]; problem: string; decision: string; architecture: string[];
 result: string; next: string; context: string; demoHint: string;
 status: 'live' | 'building'; links: ProjectLinks; shot?: string;
}
export const social = {
 github: 'https://github.com/kevingtonee',
 linkedin: 'https://www.linkedin.com/in/japhet-nyangaresi-2185762aa/',
};
export const copy = {
 cn: {
  name:'Japhet Nyangaresi', roman:'JAPHET NYANGARESI', role:'全栈开发 & AI 工程师', resumeLabel:'个人简历 / 作品集',
  location:'肯尼亚 · 接受远程协作', available:'开放全职、合同与自由职业机会',
  statusNote:'真实的客户项目与产品 —— 每个案例都附有线上链接',
  nav:['作品','履历','联系'], eyebrow:'FULL-STACK ENGINEERING. APPLIED AI. REAL PAYMENTS.',
  statement:['为真实业务写软件','从数据库到界面，完整交付'],
  intro:'我设计并构建网站、业务系统、电商平台和 AI 应用 —— 从数据库与 API 设计，到用户真正使用的界面。',
  viewWork:'查看精选作品', download:'下载简历', downloaded:'简历文本已准备下载', downloadFailed:'下载未完成，请使用页面下方的打印简历',
  selected:'精选作品', selectedSub:'电商、二手市场、社交与学生工具',
  projectHint:'内含可操作的交互切片 · 每个案例附线上链接', all:'全部', product:'产品', system:'平台', experiment:'开发中',
  resultCount:'个项目', caseStudy:'查看案例', close:'关闭案例', challenge:'问题', approach:'我的取舍',
  architecture:'实现结构', outcome:'已交付的部分', next:'下一步', responsibility:'负责范围',
  demoLabel:'交互切片 / 本地示例数据', linksLabel:'项目链接', liveLabel:'线上项目', sourceLabel:'源代码', buildingLabel:'开发中', shotCaption:'上线产品的真实截图',
  aboutLabel:'关于我', aboutTitle:['业务的问题','工程的答案'],
  aboutBody:'我是 Japhet Nyangaresi，一名全栈与 AI 工程师，把产品从头到尾完整交付 —— 从数据库建模、API 设计到用户真正使用的界面。我的工作覆盖现代 Web 应用（React、Next.js、Node.js、PostgreSQL）与应用型 AI：接入 LLM API、构建 agent 与工具调用工作流，并用 Python 做经典机器学习。我在意安全、性能，以及下一个人能读懂的代码。',
  principles:[['01','业务优先','我不只是写代码 —— 我做的是解决业务问题的软件，从 M-Pesa 支付到市场托管流程。'],['02','端到端交付','数据库、API、认证、支付、界面 —— 我负责完整链路，并部署给真实用户。'],['03','可读胜过炫技','安全、性能与测试很重要；下一位工程师能独立接手的代码同样重要。']],
  experience:'经历', experienceNote:'客户项目、独立产品与学业',
  history:[
   {date:'2025 — 现在',company:'独立与客户项目',role:'全栈 & AI 工程师',body:'为真实企业设计并交付生产级软件 —— 最近的是 ILANA：一个珠宝电商平台，接入真实的 Safaricom M-Pesa Daraja STK Push 支付、后台管理与 WhatsApp 询单，部署在 Vercel 与 Neon Postgres 上。'},
   {date:'2024 — 2025',company:'独立产品',role:'产品工程师',body:'构建并上线了 ReMarket（二手市场：发现、上架、站内信与出价）和 VibeMeet（实时 messaging 的社交平台），两者均基于 Next.js / React 与 Supabase。'},
   {date:'2023 — 现在',company:'软件工程学位',role:'在读 · 持续交付',body:'一边完成软件工程学位，一边持续交付真实项目 —— 把数据结构、安全与机器学习的课程知识直接用在客户与产品工作中。'}
  ],
  toolkit:'日常工具箱', toolNote:'从草图到上线，选择合适的工具',
  skillGroups:[['前端','React · Next.js · TypeScript · Tailwind CSS'],['后端与数据','Node.js · REST API · PostgreSQL · Prisma · Supabase · Firebase'],['支付','M-Pesa Daraja · STK Push · NextAuth v5 · Webhooks'],['AI 工程','OpenAI · Claude · Gemini · Agents 与工具调用 · Prompt 工程'],['Python 与 ML','Python · PyTorch · scikit-learn · Hugging Face'],['工程实践','Git & GitHub · Vitest · CI/CD · OWASP Top 10 · Linux']],
  education:'教育与持续学习', educationText:'软件工程本科 · 在读 · 肯尼亚', educationExtra:'持续深入分布式系统、应用型 AI 与应用安全。',
  contactTitle:['有项目想法？','一起把它做出来'],
  contactBody:'告诉我你在构建什么、想解决什么问题，或需要自动化什么。我开放全职岗位、合同项目与自由职业合作。',
  copyEmail:'复制邮箱地址', copied:'邮箱地址已复制', copyFailed:'无法访问剪贴板，请手动复制下方邮箱',
  contactNote:'通常 24 小时内回复。',
  print:'打印简历 / 另存 PDF', footer:'以判断设计，以代码实现',
  sculpture:'交互线框雕塑', specimen:'形态研究 001', sculptureHint:'点击雕塑切换形态 · 聚焦后用 ← → 旋转',
  pause:'暂停动效', play:'继续动效', reset:'重置形态', reduced:'减少动态已开启', paused:'已暂停', running:'动态中',
  skip:'跳至作品', language:'切换语言', concept:'案例研究', printable:'履历摘要',
  socialsLabel:'更多平台',
  email:'japhetkevingtone@gmail.com',
 },
 en: {
  name:'Japhet Nyangaresi', roman:'JAPHET NYANGARESI', role:'Full-Stack Developer & AI Engineer', resumeLabel:'Resume / Portfolio',
  location:'Kenya · Remote-friendly', available:'Open for full-time, contract & freelance work',
  statusNote:'Real client work and products — every case links to the live build',
  nav:['Work','Experience','Contact'], eyebrow:'FULL-STACK ENGINEERING. APPLIED AI. REAL PAYMENTS.',
  statement:['Software for real business,','shipped end to end'],
  intro:'I design and build websites, business systems, e-commerce platforms and AI-powered applications — from database schema and API design to the interface people actually use.',
  viewWork:'View selected work', download:'Download resume', downloaded:'Your text resume is ready to download', downloadFailed:'Download failed. Please use Print resume below.',
  selected:'Selected work', selectedSub:'E-commerce, marketplaces, social & student tools',
  projectHint:'Working interaction slices inside · Live links in every case', all:'All work', product:'Products', system:'Platforms', experiment:'In the lab',
  resultCount:'projects', caseStudy:'View case study', close:'Close case study', challenge:'The challenge', approach:'The decisions',
  architecture:'How it is built', outcome:'What shipped', next:'What comes next', responsibility:'My contribution',
  demoLabel:'INTERACTION SLICE / LOCAL SAMPLE DATA', linksLabel:'Project links', liveLabel:'Live project', sourceLabel:'Source code', buildingLabel:'In development', shotCaption:'The live product, as shipped',
  aboutLabel:'A little about me', aboutTitle:['Business problems,','engineered answers'],
  aboutBody:'I ship complete products end to end — from database schema and API design to the interface people actually use. My work spans modern web apps (React, Next.js, Node.js, PostgreSQL) and applied AI: integrating LLM APIs, building agent and tool-use workflows, and using Python for classic machine learning. I care about security, performance, and code the next person can read.',
  principles:[['01','Business first','I don’t just write code — I build software that solves a business problem, from M-Pesa payments to marketplace escrow flows.'],['02','Ship end to end','Database, API, auth, payments, interface — I own the whole path and deploy it for real users.'],['03','Readable beats clever','Security, performance and tests matter; so does code the next engineer can pick up without me.']],
  experience:'Experience', experienceNote:'Client work, independent products and study',
  history:[
   {date:'2025 — Present',company:'Independent & client work',role:'Full-stack & AI Engineer',body:'Designing and shipping production software for real businesses — most recently ILANA, a jewellery e-commerce platform with real Safaricom M-Pesa Daraja STK Push payments, an admin dashboard and WhatsApp enquiries, deployed on Vercel with a Neon Postgres database.'},
   {date:'2024 — 2025',company:'Independent products',role:'Product Engineer',body:'Built and shipped ReMarket — a second-hand marketplace with discovery, listings, messaging and offers — and VibeMeet, a social platform with realtime messaging, both on Next.js / React with Supabase backends.'},
   {date:'2023 — Present',company:'Software engineering degree',role:'Student & builder',body:'Completing a software engineering degree while shipping real projects alongside — applying coursework in data structures, security and machine learning directly to client and product work.'}
  ],
  toolkit:'What I work with', toolNote:'The right tools, from first sketch to shipped product',
  skillGroups:[['Frontend','React · Next.js · TypeScript · Tailwind CSS'],['Backend & data','Node.js · REST APIs · PostgreSQL · Prisma · Supabase · Firebase'],['Payments','M-Pesa Daraja · STK Push · NextAuth v5 · Webhooks'],['AI engineering','OpenAI · Claude · Gemini · Agents & tool-use · Prompt engineering'],['Python & ML','Python · PyTorch · scikit-learn · Hugging Face'],['Practices','Git & GitHub · Vitest · CI/CD · OWASP Top 10 · Linux']],
  education:'Education & ongoing learning', educationText:'BSc Software Engineering — in progress · Kenya', educationExtra:'Deepening distributed systems, applied AI and application security.',
  contactTitle:['Have a project in mind?','Let’s build it together'],
  contactBody:'Tell me what you’re building, what problem you’re trying to solve, or what you need automated. I’m open to full-time roles, contract projects and freelance work.',
  copyEmail:'Copy email address', copied:'Email address copied', copyFailed:'Clipboard unavailable — please copy the address below manually',
  contactNote:'I usually reply within 24 hours.',
  print:'Print resume / Save PDF', footer:'Designed with judgment. Built with code.',
  sculpture:'Interactive wire sculpture', specimen:'FORM STUDY 001', sculptureHint:'Click to change form · Focus and use ← → to rotate',
  pause:'Pause motion', play:'Resume motion', reset:'Reset form', reduced:'Reduced motion enabled', paused:'Paused', running:'In motion',
  skip:'Skip to work', language:'Switch language', concept:'Case study', printable:'Resume summary',
  socialsLabel:'Elsewhere',
  email:'japhetkevingtone@gmail.com',
 }
};
export const projects: Record<Locale, Project[]> = {
 cn: [
  {id:'ilana',number:'01',category:'product',name:'ILANA',year:'2026',headline:'为真实的珠宝生意接入真实的 M-Pesa 支付',summary:'为肯尼亚珠宝零售商 Ilana 打造的生产级电商平台 —— 真实的 Safaricom M-Pesa Daraja STK Push 支付、后台管理与 WhatsApp 询单，部署于 Vercel，数据库使用 Neon Postgres。',context:'客户项目 · 已上线 · 设计 + 全栈开发',role:'全部：数据建模、支付、后台、部署',tags:['NEXT.JS 16','TYPESCRIPT','M-PESA DARAJA','POSTGRESQL','PRISMA'],problem:'珠宝零售商正在流失准备下单的顾客：手动 WhatsApp 下单加上“转账到这个号码”的支付方式。他们需要一个真正的商店：浏览、用 M-Pesa 支付，并且不找开发者也能管理订单。',decision:'以沙箱优先的方式接入 M-Pesa Daraja STK Push，订单状态机在服务端、回调幂等。法兰克福的 serverless 函数让数据库往返贴近 Neon Postgres 区域；NextAuth v5 将后台管理与店面隔离。',architecture:['Next.js 16 店面 + 管理后台','M-Pesa Daraja STK Push + 回调','Prisma + Neon Postgres','Vercel Blob 媒体 + NextAuth v5'],result:'已上线并接收真实订单。试试下面的交互切片：把首饰加入购物车，端到端跑一遍沙箱 STK Push 支付 —— 这正是生产商店使用的完整流程。',next:'会员与复购流程、更丰富的后台分析，以及在珠宝线之外扩展品类。',demoHint:'把首饰加入购物车，然后用 M-Pesa 支付 —— 观察 STK Push 流程。',status:'live',links:{live:'https://e-commerce-one-theta-84.vercel.app/',source:'https://github.com/kevingtonee/ilana-ecommerce'},shot:'/img/ilana.webp'},
  {id:'remarket',number:'02',category:'product',name:'ReMarket',year:'2025',headline:'买得聪明。卖掉不再需要的东西。',summary:'一个生产级的二手市场：发现、上架、实时站内信与出价 —— 支付、配送、托管与实名认证被设计为清晰的后续增量。',context:'独立产品 · V1 已上线 · 设计 + 全栈开发',role:'产品设计、数据模型、实时站内信',tags:['NEXT.JS 15','SUPABASE','REALTIME','SHADCN/UI','ZOD'],problem:'校园和社区里的二手交易依赖混乱的聊天群：没有搜索、没有价格记录，也没办法知道什么东西真的卖出去了。买家刷不到底；卖家每周重发同一个商品。',decision:'把商品生命周期显式建模 —— 草稿、在售、出价、已售 —— 而不是把状态硬塞在 posts 表上。Supabase Realtime 驱动出价与消息；Zod 校验的表单让商品信息结构化到可以真正搜索和筛选。',architecture:['Next.js 15 + shadcn/ui 店面','Supabase Postgres + Realtime','出价与消息状态机','Zod + React Hook Form 校验'],result:'V1 已上线，覆盖发现、上架、站内信与出价。下面的切片是出价流程：搜索商品、打开一个，和一位非常有耐心的卖家砍个价。',next:'支付、配送协同、托管与实名认证 —— 都已设计好，尚未发布。',demoHint:'搜索商品、打开一个，然后出个价 —— 卖家会回复。',status:'live',links:{live:'https://remarket-ecru.vercel.app/',source:'https://github.com/kevingtonee/remarket'},shot:'/img/remarket.webp'},
  {id:'vibemeet',number:'03',category:'system',name:'VibeMeet',year:'2025',headline:'让人真正能感觉到的实时消息',summary:'一个社交平台：实时 messaging、个人主页与内容分享 —— 前端 React，Supabase 负责认证、存储与实时订阅。',context:'独立产品 · 已上线 · 前端 + 后端',role:'实时架构、个人主页、消息体验',tags:['REACT','SUPABASE','REALTIME','TAILWIND CSS'],problem:'大多数校园社交应用给人“死气沉沉”的感觉，因为不刷新就什么都不会动。连接 —— 这类产品的全部意义 —— 需要在线状态、即时送达，和随聊随动的对话。',decision:'每个会话一条 Supabase Realtime 频道，消息乐观渲染再对账，配合在线心跳，让“在线”真的是在线。认证与存储策略在 Postgres 行级安全里强制执行，而不是只在界面上。',architecture:['React SPA + Tailwind 前端','Supabase 认证 + RLS 策略','每个会话一条 Realtime 频道','乐观发送 + 对账'],result:'已上线，包含主页、分享与实时聊天。下面的切片是消息核心：切换频道、发一条消息，看着回复无需刷新就落下来。',next:'随着社区成长，加入群组通话、通知摘要与内容治理工具。',demoHint:'切换频道并发一条消息 —— 回复会实时到达。',status:'live',links:{live:'https://mmu-vibe-meet.netlify.app/',source:'https://github.com/kevingtonee/vibeMeet-frontend'}},
  {id:'studenthub',number:'04',category:'experiment',name:'Student Hub',year:'2026',headline:'更从容地安排学生生活',summary:'一个面向学生的课程表、成绩追踪与学习小组工具 —— 正在用 Next.js 和 Supabase 构建，并先拿我自己的学位课表试用。',context:'开发中 · 自有产品 · 设计 + 全栈',role:'目前全部：数据建模、课表、成绩模型',tags:['NEXT.JS','SUPABASE','TYPESCRIPT'],problem:'课表在 PDF 里，成绩在 WhatsApp 截图里，学习小组分散在三个应用。学生凭记忆安排一周，撞课了才发现。',decision:'把一周课程建成一等数据 —— 可重复的课块，而不是手动敲进去的日历事件 —— 这样冲突检测和“今天有什么课”是查询而不是功能。成绩追踪持续计算，而不是考前恐慌时才算。',architecture:['Next.js + TypeScript 应用','Supabase Postgres + 认证','可重复的课表模型','持续成绩计算'],result:'下面的课表与成绩条就是正在运行的核心，使用真实一周的示例数据。排课与学习小组功能随后发布。',next:'学习小组匹配、截止提醒与正式的移动端外壳。上线后链接会出现在这里。',demoHint:'切换星期浏览课表；成绩条实时更新。',status:'building',links:{}}
 ],
 en: [
  {id:'ilana',number:'01',category:'product',name:'ILANA',year:'2026',headline:'Real M-Pesa payments for a real jewellery business',summary:'A production e-commerce platform for Ilana, a Kenyan jewellery retailer — live Safaricom M-Pesa Daraja STK Push payments, an admin dashboard and WhatsApp enquiries, deployed on Vercel with a Neon Postgres database.',context:'Client project · Shipped & live · Design + full-stack build',role:'Everything: schema, payments, admin, deployment',tags:['NEXT.JS 16','TYPESCRIPT','M-PESA DARAJA','POSTGRESQL','PRISMA'],problem:'A jewellery retailer was losing ready-to-buy customers to manual WhatsApp orders and “send money to this number” payments. They needed a real store: browse, pay by M-Pesa, and manage orders without calling a developer.',decision:'Sandbox-first M-Pesa Daraja integration with STK Push, a server-side order state machine and idempotent callbacks. Frankfurt-based serverless functions keep database round-trips close to the Neon Postgres region; NextAuth v5 separates the admin dashboard from the storefront.',architecture:['Next.js 16 storefront + admin','M-Pesa Daraja STK Push + callbacks','Prisma + Neon Postgres','Vercel Blob media + NextAuth v5'],result:'Live and taking real orders. Try the interaction slice below: add pieces to the cart and run a sandbox STK Push payment end to end — the full flow the production store uses.',next:'Loyalty and repeat-customer flows, richer admin analytics, and expanding the catalogue beyond jewellery lines.',demoHint:'Add pieces to the cart, then pay with M-Pesa — watch the STK Push flow.',status:'live',links:{live:'https://e-commerce-one-theta-84.vercel.app/',source:'https://github.com/kevingtonee/ilana-ecommerce'},shot:'/img/ilana.webp'},
  {id:'remarket',number:'02',category:'product',name:'ReMarket',year:'2025',headline:'Buy smart. Sell what you no longer need.',summary:'A production-ready second-hand marketplace: discovery, listings, realtime messaging and offers — with payments, delivery, escrow and verification designed as clean future additions.',context:'Independent product · V1 live · Design + full-stack build',role:'Product design, data model, realtime messaging',tags:['NEXT.JS 15','SUPABASE','REALTIME','SHADCN/UI','ZOD'],problem:'Campus and neighbourhood selling runs on chaotic chat groups: no search, no price history, no way to know what actually sold. Buyers scroll forever; sellers repost the same listing every week.',decision:'Model the listing lifecycle explicitly — draft, live, offer, sold — instead of bolting states onto a posts table. Supabase Realtime powers offers and messaging; Zod-validated forms keep listings structured enough to actually search and filter.',architecture:['Next.js 15 + shadcn/ui storefront','Supabase Postgres + Realtime','Offer & message state machine','Zod + React Hook Form validation'],result:'V1 is live with discovery, listings, messaging and offers. The slice below is the offer flow: search the listings, open one, and negotiate with a very patient seller.',next:'Payments, delivery coordination, escrow and identity verification — designed for, not shipped yet.',demoHint:'Search the listings, open one, and make an offer — the seller answers.',status:'live',links:{live:'https://remarket-ecru.vercel.app/',source:'https://github.com/kevingtonee/remarket'},shot:'/img/remarket.webp'},
  {id:'vibemeet',number:'03',category:'system',name:'VibeMeet',year:'2025',headline:'Realtime messaging people can actually feel',summary:'A social connect platform with realtime messaging, profiles and content sharing — React on the front, Supabase handling auth, storage and realtime subscriptions.',context:'Independent product · Live · Frontend + backend',role:'Realtime architecture, profiles, messaging UX',tags:['REACT','SUPABASE','REALTIME','TAILWIND CSS'],problem:'Most student social apps feel dead because nothing moves until you refresh. Connection — the whole point — needs presence, instant delivery, and conversations that update as they happen.',decision:'One Supabase Realtime channel per conversation, optimistic message rendering with reconciliation, and presence heartbeats so “online” actually means online. Auth and storage rules are enforced in Postgres row-level security, not just in the UI.',architecture:['React SPA + Tailwind frontend','Supabase auth + RLS policies','Realtime channel per conversation','Optimistic sends + reconciliation'],result:'Live with profiles, sharing and realtime chat. The slice below is the messaging core: switch channels, send a message, and watch the reply land without a refresh.',next:'Group calls, notification digests and moderation tooling as the community grows.',demoHint:'Switch channels and send a message — replies arrive in realtime.',status:'live',links:{live:'https://mmu-vibe-meet.netlify.app/',source:'https://github.com/kevingtonee/vibeMeet-frontend'}},
  {id:'studenthub',number:'04',category:'experiment',name:'Student Hub',year:'2026',headline:'A calmer way to run student life',summary:'A student hub for course scheduling, grade tracking and study groups — currently being built with Next.js and Supabase, and dogfooded on my own degree.',context:'In development · Own product · Design + full-stack',role:'Everything so far: schema, planner, grade model',tags:['NEXT.JS','SUPABASE','TYPESCRIPT'],problem:'Timetables live in PDFs, grades in WhatsApp screenshots, study groups across three different apps. Students plan the week from memory and find out about clashes the hard way.',decision:'Model the week as first-class data — recurring class blocks, not hand-typed calendar events — so clash detection and “what do I have today” are queries, not features. Grade tracking computes standing continuously, not at exam-panic time.',architecture:['Next.js + TypeScript app','Supabase Postgres + auth','Recurring schedule model','Continuous grade computation'],result:'The planner and grade tracker below are the working core, running on sample data from a real week. Scheduling and study groups ship next.',next:'Study-group matching, deadline reminders and a proper mobile shell. Links land here as it ships.',demoHint:'Switch days to browse the timetable; grade bars update live.',status:'building',links:{}}
 ]
};
