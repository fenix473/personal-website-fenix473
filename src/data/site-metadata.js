/**
 * Central site and person metadata. Used by layout (SEO), Home hero, Contact links, Resume, etc.
 * Populate and edit this file to keep the site in sync.
 */
export const siteMeta = {
  name: "Libero Favi",
  tagline: "Full-Stack Developer | AI Automation & Data Processing",
  shortDescription: "Journalist and Software Engineer",
  heroDescription: `Developer with a journalism background. I build web apps,
automate workflows, and work with AI—but I actually care
about whether something is useful, not just technically
impressive. In an age where ChatGPT can write anything,
imagination (knowing what to ask for) beats raw knowledge.
That's where humanities meet tech.`,
  links: {
    linkedin: "https://www.linkedin.com/in/liberofavi/",
    github: "https://github.com/fenix473",
    email: "mailto:favi.libero@gmail.com",
    phone: "tel:+17373256215",
    phoneDisplay: "(737) 325-6215",
  },
  resumePdfPath: "/documents/Resume Full Stack.pdf",
  sections: {
    projects: "Projects",
    about: "About Me",
    writings: "Writings",
    essays: "Essays",
    resume: "Resume",
    contact: "Contact Me",
  },
  cta: {
    viewProjects: "View Projects",
    getInTouch: "Get in Touch",
  },
  // SEO & Social Sharing
  seo: {
    // Open Graph (Facebook, LinkedIn, etc.)
    ogTitle: "Libero Favi – Full-Stack Developer & Portfolio",
    ogDescription: "Full-stack developer specializing in React, Next.js, AI automation with Claude API, and data processing. Portfolio featuring interactive web applications with real-time data visualization and AI integration.",
    ogImage: "/images/Profile.jpg",
    ogType: "website",
    ogSiteName: "Libero Favi Portfolio",
    ogUrl: "https://favilibero.com",

    // Twitter / X Card
    twitterCard: "summary_large_image",
    twitterTitle: "Libero Favi – Full-Stack Developer & AI Engineer",
    twitterDescription: "Building web apps with React, Next.js, AI automation (Claude API), and real-time data visualization. Journalist turned software engineer.",
    twitterImage: "/images/Profile.jpg",
    twitterCreator: "@yourhandle", // Replace with your actual Twitter handle

    // SEO Basics - Expanded with technical terms
    keywords: [
      // Core Technologies
      "Full-Stack Developer",
      "React Developer",
      "Next.js Developer",
      "TypeScript Developer",
      "Python Developer",
      "Node.js Developer",
      
      // AI & Automation
      "AI Automation",
      "Claude API",
      "Anthropic Claude",
      "LLM Integration",
      "AI Assistant Development",
      "N8N Workflow Automation",
      
      // Data & Backend
      "Data Processing",
      "ETL Pipeline",
      "PostgreSQL",
      "Neon Database",
      "REST API",
      "SoQL API",
      "Cron Jobs",
      
      // Frontend & UI
      "Web Audio API",
      "Material-UI",
      "Leaflet Maps",
      "OpenStreetMap",
      "Real-time Data Visualization",
      "Interactive Dashboard",
      
      // Professional
      "Portfolio",
      "Software Engineer",
      "Web Development",
      "Austin Developer",
      "Journalist",
      
      // Writing & Essays
      "Literary Criticism",
      "Philosophical Essays",
      "Political Analysis",
      "Cultural Criticism",
    ],
    robots: "index, follow",

    // Structured Data (Person)
    jobTitle: "Full-Stack Developer & AI Engineer",
    image: "/images/Profile.jpg",
    locale: "en_US",
    themeColor: "#000000", // Adjust to match your site's primary color
    category: "Portfolio",
  },
};

export const aboutMeta = {
  education: [
    {
      degree: "Bachelor's in Journalism, Audio/Visual and Radio Art",
      institution: "Kyiv University of Culture",
      year: null,
    },
    {
      degree: "Associate in Computer Science",
      institution: "Austin Community College",
      year: "2024-2025",
    },
  ],
  experience: [
    {
      title: "Co-founder, Marketing Startup",
      location: "Ukraine",
      period: "2020-2022",
      description: "Managed Meta Ads campaigns, designed creatives in Figma, and automated campaign workflows for political and corporate clients.",
    },
  ],
  skills: {
    fullStack: "React, Next.js, Node.js, TypeScript, Python, C++",
    aiAutomation: "Anthropic Claude SDK, N8N, REST APIs",
    dataProcessing: "Pandas, BigQuery, R, Excel",
    designMarketing: "Figma, Meta Ads, Material-UI",
  },
  languages: {
    fluent: ["English", "Italian", "Ukrainian", "Russian"],
    basic: ["Chinese", "German", "French"],
  },
  authorBio: {
    short: "Writer and critical thinker exploring power, justice, and resistance through philosophy, literature, and cultural criticism. Interested in how systems of oppression operate and how language functions as both propaganda and liberation.",
    long: "Writer, philosopher, and cultural critic examining power structures, systemic oppression, and human resistance through interdisciplinary analysis. Work spans literary criticism, political philosophy, labor studies, and environmental thought, drawing on Marx, Nietzsche, Camus, and contemporary critical theory. Particularly interested in how language and art function ideologically, how workers navigate dignity under constraint, and how we might resist tyranny while maintaining moral clarity. Writing style combines philosophical rigor with poetic intensity, academic precision with passionate engagement. Essays explore alienation in digital culture, propaganda in literature, professional identity, and the relationship between nature and human agency. Believes writing should be both intellectually rigorous and emotionally resonant—that moral conviction and artistic ambition are complementary, not opposed.",
  },
};

export const projectsMeta = [
  {
    id: "trader",
    title: "Trader Module",
    shortTitle: "Trader Module",
    description: "Market data, tracked companies, AI signal analysis, price charts, and news. Built with N8N integration.",
    fullDescription: "A trading-focused web application featuring real-time market data, company tracking, AI-powered signal analysis (BUY/SELL/HOLD with reasoning via N8N), price charts with MA Crossover and RSI indicators, and enriched news. Deployed on Vercel.",
    link: "https://trader-module-frontend.vercel.app/",
    liveUrl: "https://trader-module-frontend.vercel.app/",
    external: true,
    tags: ["Market Data", "AI Analysis", "N8N", "Trading", "Charts", "React"],
    techStack: [
      "React",
      "N8N Workflow",
      "Market Data APIs",
      "Price Charts",
      "AI Signal Analysis",
    ],
    features: [
      "Market data and latest prices",
      "Tracked companies management",
      "AI signal analysis (BUY/SELL/HOLD) via N8N",
      "Price charts with MA Crossover and RSI",
      "Enriched news feed",
    ],
    seo: {
      title: "Trader Module - Market Data & AI Signal Analysis | Libero Favi",
      description: "Trading app with market data, AI signal analysis, price charts, and news. Built with N8N integration.",
      keywords: ["Trader Module", "Market Data", "AI Signal Analysis", "N8N", "Trading", "Price Charts"],
    },
    ogImage: "/images/trader_background.jpg",
  },
  // Legacy Piano project (kept for future repairs; currently not used in navigation)
  // {
  //   id: "piano",
  //   title: "AI-Powered Interactive Piano",
  //   shortTitle: "Piano",
  //   description: "Interactive 49-key digital piano with AI melody generation using Claude API and N8N workflow automation.",
  //   fullDescription:
  //     "An interactive 49-key digital piano, built with React and the Web Audio API. The application integrates an N8N workflow via webhook that interfaces with a large language model to generate original melodies based on user prompts, returning structured JSON containing note sequences, tempo, and duration data. Generated melodies are persisted in a Neon database through Next.js API Routes, enabling users to save, list, and replay their AI-created compositions.",
  //   link: "/projects/piano",
  //   liveUrl: "https://favilibero.com/projects/piano",
  //   tags: ["Web Audio API", "React", "AI Integration", "N8N", "Claude API", "Neon Database"],
  //   techStack: [
  //     "React",
  //     "Next.js",
  //     "Web Audio API",
  //     "N8N Workflow Automation",
  //     "Claude API / LLM",
  //     "Neon PostgreSQL",
  //     "Next.js API Routes",
  //     "JSON Data Processing",
  //   ],
  //   features: [
  //     "49-key interactive digital piano interface",
  //     "AI melody generation via Claude API",
  //     "N8N webhook integration for workflow automation",
  //     "Structured JSON response with note sequences, tempo, duration",
  //     "Database persistence with Neon PostgreSQL",
  //     "Save, list, and replay AI-generated compositions",
  //     "Real-time audio playback with Web Audio API",
  //   ],
  //   seo: {
  //     title: "AI Piano - Interactive Web Audio Piano with Claude API | Libero Favi",
  //     description:
  //       "Interactive 49-key digital piano built with React and Web Audio API. Features AI melody generation using Claude API, N8N workflow automation, and Neon database for saving compositions.",
  //     keywords: [
  //       "Web Audio API",
  //       "React Piano",
  //       "AI Music Generation",
  //       "Claude API",
  //       "N8N Automation",
  //       "Interactive Piano",
  //       "Digital Piano Web App",
  //     ],
  //   },
  //   ogImage: "/images/piano_background_v2.jpg",
  // },
  {
    id: "assistant",
    title: "Custom Website AI Assistant",
    shortTitle: "Assistant",
    description: "Conversational AI assistant powered by Anthropic Claude API with custom code inspection tools and multiple personas.",
    fullDescription: "A conversational AI assistant integrated throughout the portfolio website, powered by the Anthropic Claude API with a two-tier model strategy for cost efficiency and capability. The assistant features a custom inspect_project_code tool that references a detailed code map, allowing it to retrieve file paths and generate GitHub URLs to provide accurate technical explanations about the website's implementations. Offering both an embedded floating chat window and a full-screen mode, with three selectable personas.",
    link: "/projects/assistant",
    liveUrl: "https://favilibero.com/projects/assistant",
    tags: ["AI Assistant", "Claude API", "Conversational AI", "Custom Tools", "React"],
    techStack: [
      "Anthropic Claude API",
      "React",
      "Next.js",
      "Custom AI Tools",
      "Two-tier Model Strategy",
      "GitHub API Integration",
      "Real-time Chat Interface",
    ],
    features: [
      "Conversational AI powered by Claude API",
      "Two-tier model strategy for cost efficiency",
      "Custom inspect_project_code tool",
      "Code map reference system",
      "GitHub URL generation for code explanations",
      "Embedded floating chat window",
      "Full-screen chat mode",
      "Three selectable AI personas",
      "Context-aware technical assistance",
    ],
    seo: {
      title: "AI Assistant - Custom Claude API Chatbot with Code Inspection | Libero Favi",
      description: "Custom AI assistant powered by Anthropic Claude API featuring code inspection tools, GitHub integration, and multiple personas. Built with React and Next.js.",
      keywords: ["Claude API", "AI Assistant", "Anthropic Claude", "Conversational AI", "Custom AI Tools", "Code Assistant", "React Chatbot"],
    },
    ogImage: "/images/assistant_background_v8.jpg",
  },
  {
    id: "dashboard",
    title: "Real-Time Traffic Dashboard",
    shortTitle: "Dashboard",
    description: "Interactive dashboard visualizing real-time Austin traffic data with automated ETL pipeline and map integration.",
    fullDescription: "An interactive dashboard that visualizes real-time traffic incident data from the City of Austin's public safety dataset using Leaflet and OpenStreetMap. The application implements a daily ETL pipeline using Cron Jobs to get incident data from the Austin Open Data Portal via their SoQL API, process it server-side, and store it in a Neon serverless Postgres database. Built with React, Next.js, and Material-UI, the frontend features a modular component architecture with map visualization, data tables, statistics displays, and form inputs for incident management.",
    link: "/projects/dashboard",
    liveUrl: "https://favilibero.com/projects/dashboard",
    tags: ["Data Visualization", "ETL Pipeline", "React", "Leaflet", "Cron Jobs", "PostgreSQL"],
    techStack: [
      "React",
      "Next.js",
      "Material-UI",
      "Leaflet",
      "OpenStreetMap",
      "Neon PostgreSQL",
      "Cron Jobs",
      "SoQL API",
      "Austin Open Data Portal API",
      "Server-side Data Processing",
    ],
    features: [
      "Real-time traffic incident visualization",
      "Leaflet map integration with OpenStreetMap",
      "Automated daily ETL pipeline with Cron Jobs",
      "SoQL API integration for Austin Open Data Portal",
      "Server-side data processing and storage",
      "Neon serverless PostgreSQL database",
      "Modular component architecture",
      "Interactive data tables and statistics",
      "Incident management forms",
      "Material-UI design system",
    ],
    seo: {
      title: "Traffic Dashboard - Real-Time Austin Data Visualization with ETL Pipeline | Libero Favi",
      description: "Interactive dashboard visualizing real-time Austin traffic incidents using Leaflet, OpenStreetMap, and automated ETL pipeline. Built with React, Next.js, and Material-UI.",
      keywords: ["Data Visualization", "ETL Pipeline", "Leaflet Maps", "React Dashboard", "Cron Jobs", "PostgreSQL", "Austin Open Data", "SoQL API", "Real-time Data"],
    },
    ogImage: "/images/dashboard_background_v3.jpg",
  },
];

export const writingsMeta = [
  {
    id: "orange-man",
    title: "ORANGE MAN",
    subtitle: "The Noble Sacrifice",
    author: "LIBERO FAVI",
    coverImage: "/images/writings/orange-man-cover.jpg",
  },
  {
    id: "profession",
    title: "PROFESSION",
    subtitle: "The Crucible of Talent",
    author: "LIBERO FAVI",
    coverImage: "/images/writings/profession-cover.jpg",
  },
  {
    id: "vita-serv",
    title: "VITA SERV",
    subtitle: "The Life of Service",
    author: "LIBERO FAVI",
    coverImage: "/images/writings/vita-serv-cover.jpg",
  },
];

// Comprehensive Essays Metadata with SEO
export const essaysMeta = [
  // TOP TIER ESSAYS
  {
    id: "orange-man-tennyson-propaganda-poetry",
    title: "Orange Man: Tennyson, Propaganda, and the Poetry of Blind Obedience",
    slug: "orange-man-tennyson-propaganda-poetry",
    category: ["Literary Criticism", "Political Analysis"],
    readingTime: 15,
    description: "A literary analysis exploring how Tennyson's \"Charge of the Light Brigade\" functions as propaganda, connecting Victorian poetry to modern political rhetoric and the dangers of unquestioning loyalty.",
    excerpt: "A literary analysis exploring how Tennyson's \"Charge of the Light Brigade\" functions as propaganda, connecting Victorian poetry to modern political rhetoric and the dangers of unquestioning loyalty.",
    pdfPath: "/documents/essays/OrangeManClean.pdf",
    coverImage: "/images/essays/orange-man.jpg",
    featured: true,
    publishedDate: null, // Add when published
    tags: ["#LiteraryAnalysis", "#PoliticalCritique", "#Tennyson", "#WarPoetry", "#Propaganda", "#VictorianLiterature", "#CulturalCriticism", "#IronMaiden", "#BritishLiterature"],
    seo: {
      title: "Orange Man: Tennyson, Propaganda, and the Poetry of Blind Obedience",
      description: "A literary analysis exploring how Tennyson's \"Charge of the Light Brigade\" functions as propaganda, connecting Victorian poetry to modern political rhetoric and the dangers of unquestioning loyalty.",
      keywords: ["Tennyson", "Charge of the Light Brigade", "literary analysis", "propaganda", "political poetry", "Victorian literature", "war poetry", "Iron Maiden", "Crimean War", "blind obedience", "political allegory", "literary criticism"],
    },
  },
  {
    id: "tremble-nature-power-subjugation",
    title: "TREMBLE: Nature, Power, and the Subjugation of Earth and Humanity",
    slug: "tremble-nature-power-subjugation",
    category: ["Philosophy", "Environmental Studies", "Political Theory"],
    readingTime: 18,
    description: "A philosophical essay examining humanity's relationship with nature through Byron, Jefferson, and Wollstonecraft, connecting environmental destruction to social oppression and the question of human agency.",
    excerpt: "A philosophical essay examining humanity's relationship with nature through Byron, Jefferson, and Wollstonecraft, connecting environmental destruction to social oppression and the question of human agency.",
    pdfPath: "/documents/essays/SubjugationofNature.pdf",
    coverImage: "/images/essays/tremble.jpg",
    featured: true,
    publishedDate: null,
    tags: ["#EnvironmentalPhilosophy", "#PoliticalTheory", "#Byron", "#Romanticism", "#EcologicalCritique", "#Feminism", "#HumanAgency", "#NatureAndPower", "#PhilosophicalEssay"],
    seo: {
      title: "TREMBLE: Nature, Power, and the Subjugation of Earth and Humanity",
      description: "A philosophical essay examining humanity's relationship with nature through Byron, Jefferson, and Wollstonecraft, connecting environmental destruction to social oppression and the question of human agency.",
      keywords: ["environmental philosophy", "nature and power", "Byron Darkness", "Thomas Jefferson", "Mary Wollstonecraft", "environmental destruction", "human agency", "free will", "gender oppression", "ecological critique", "political philosophy", "Romantic literature"],
    },
  },
  {
    id: "dialogue-consciousness-identity-philosophy",
    title: "Dialogue: A Philosophical Conversation on Consciousness and Identity",
    slug: "dialogue-consciousness-identity-philosophy",
    category: ["Philosophy", "Creative Nonfiction"],
    readingTime: 12,
    description: "An experimental philosophical dialogue exploring consciousness, identity, and the nature of the self through Aristotle's Four Causes, existentialism, and absurdism. A conversation with one's shadow.",
    excerpt: "An experimental philosophical dialogue exploring consciousness, identity, and the nature of the self through Aristotle's Four Causes, existentialism, and absurdism.",
    pdfPath: "/documents/essays/DialoguePhilEssay.pdf",
    coverImage: "/images/essays/dialogue.jpg",
    featured: true,
    publishedDate: null,
    tags: ["#PhilosophyOfMind", "#Consciousness", "#Identity", "#Existentialism", "#Absurdism", "#Aristotle", "#PhilosophicalDialogue", "#CreativePhilosophy", "#SelfKnowledge"],
    seo: {
      title: "Dialogue: A Philosophical Conversation on Consciousness and Identity",
      description: "An experimental philosophical dialogue exploring consciousness, identity, and the nature of the self through Aristotle's Four Causes, existentialism, and absurdism. A conversation with one's shadow.",
      keywords: ["philosophy of mind", "consciousness", "personal identity", "Aristotle Four Causes", "existentialism", "absurdism", "Nietzsche", "Camus", "philosophical dialogue", "self-knowledge", "free will", "philosophical essay"],
    },
  },
  {
    id: "evolution-alienation-marx-digital-age",
    title: "Evolution of Alienation: Marx, Digital Consumption, and Modern Life",
    slug: "evolution-alienation-marx-digital-age",
    category: ["Philosophy", "Cultural Criticism", "Political Economy"],
    readingTime: 12,
    description: "Applying Marx's theory of alienation to contemporary digital culture, exploring how alienation has evolved from industrial labor to digital consumption and its connection to ADHD and modern anxiety.",
    excerpt: "Applying Marx's theory of alienation to contemporary digital culture, exploring how alienation has evolved from industrial labor to digital consumption.",
    pdfPath: "/documents/essays/AlienationPhilEssay.pdf",
    coverImage: "/images/essays/alienation.jpg",
    featured: true,
    publishedDate: null,
    tags: ["#Marx", "#Alienation", "#DigitalCulture", "#PoliticalEconomy", "#TechnologyCritique", "#ADHD", "#ModernLife", "#PhilosophicalEssay", "#Capitalism"],
    seo: {
      title: "Evolution of Alienation: Marx, Digital Consumption, and Modern Life",
      description: "Applying Marx's theory of alienation to contemporary digital culture, exploring how alienation has evolved from industrial labor to digital consumption and its connection to ADHD and modern anxiety.",
      keywords: ["Marx alienation", "digital alienation", "Marxist theory", "digital consumption", "ADHD", "modern anxiety", "political economy", "social media", "technology critique", "contemporary philosophy", "capitalism critique"],
    },
  },
  
  // PROFESSIONALISM SERIES
  {
    id: "profession-crucible-talent-definition",
    title: "Profession: The Crucible of Talent - Defining Professional Identity",
    slug: "profession-crucible-talent-definition",
    category: ["Labor Studies", "Philosophy", "Professional Development"],
    readingTime: 10,
    description: "A historical and philosophical exploration of professionalism, tracing its evolution from medieval guilds through Weber's rationalization to contemporary debates about what makes work professional.",
    excerpt: "A historical and philosophical exploration of professionalism, tracing its evolution from medieval guilds through Weber's rationalization to contemporary debates.",
    pdfPath: "/documents/essays/EditableENGII_InitialEssay.Defineprofession..pdf",
    coverImage: "/images/essays/profession.jpg",
    series: "Professionalism",
    seriesOrder: 1,
    publishedDate: null,
    tags: ["#Professionalism", "#LaborPhilosophy", "#MaxWeber", "#WorkEthics", "#ProfessionalIdentity", "#SociologyOfWork", "#CareerDevelopment"],
    seo: {
      title: "Profession: The Crucible of Talent - Defining Professional Identity",
      description: "A historical and philosophical exploration of professionalism, tracing its evolution from medieval guilds through Weber's rationalization to contemporary debates about what makes work professional.",
      keywords: ["professionalism", "professional identity", "Max Weber", "medieval guilds", "labor philosophy", "work ethics", "professional standards", "Hannah Arendt", "sociology of work", "professional development"],
    },
  },
  {
    id: "mores-framework-fair-employment-model",
    title: "MoRes Framework: A New Model for Evaluating Fair Employment",
    slug: "mores-framework-fair-employment-model",
    category: ["Labor Studies", "Economics", "Original Research"],
    readingTime: 8,
    description: "Introducing the MoRes framework (Market value, Opportunity, Risk, Ethical impact, Societal value) - an original theoretical model for assessing labor fairness and professional compensation.",
    excerpt: "Introducing the MoRes framework - an original theoretical model for assessing labor fairness and professional compensation.",
    pdfPath: "/documents/essays/CopyofResearchEssayCOMP2.pdf",
    coverImage: "/images/essays/mores.jpg",
    series: "Professionalism",
    seriesOrder: 2,
    publishedDate: null,
    tags: ["#LaborEconomics", "#FairEmployment", "#LaborEthics", "#OriginalResearch", "#ProfessionalDevelopment", "#EconomicJustice", "#WorkplaceEthics"],
    seo: {
      title: "MoRes Framework: A New Model for Evaluating Fair Employment",
      description: "Introducing the MoRes framework (Market value, Opportunity, Risk, Ethical impact, Societal value) - an original theoretical model for assessing labor fairness and professional compensation.",
      keywords: ["labor economics", "fair employment", "compensation theory", "labor ethics", "employment framework", "professional evaluation", "work fairness", "labor studies", "economic justice", "original research"],
    },
  },
  {
    id: "vita-servitutis-dignity-service",
    title: "Vita Servitutis: Dignity and Meaning in Service and Servitude",
    slug: "vita-servitutis-dignity-service",
    category: ["Literary Analysis", "Philosophy", "Labor Studies"],
    readingTime: 11,
    description: "A comparative analysis of service and dignity through \"Remains of the Day\" and \"Live-In Maids,\" exploring how servants navigate identity, meaning, and professional pride through existentialist philosophy.",
    excerpt: "A comparative analysis of service and dignity through \"Remains of the Day\" and \"Live-In Maids,\" exploring how servants navigate identity and professional pride.",
    pdfPath: "/documents/essays/ServeAnalyticalPaper.pdf",
    coverImage: "/images/essays/vita-servitutis.jpg",
    series: "Professionalism",
    seriesOrder: 3,
    publishedDate: null,
    tags: ["#ServiceWork", "#Dignity", "#Existentialism", "#LiteraryAnalysis", "#DomesticLabor", "#PhilosophyOfWork", "#ProfessionalPride", "#Servitude"],
    seo: {
      title: "Vita Servitutis: Dignity and Meaning in Service and Servitude",
      description: "A comparative analysis of service and dignity through \"Remains of the Day\" and \"Live-In Maids,\" exploring how servants navigate identity, meaning, and professional pride through existentialist philosophy.",
      keywords: ["service and dignity", "servitude", "Remains of the Day", "existentialism", "Nietzsche", "Camus", "professional dignity", "domestic labor", "literary analysis", "philosophy of work"],
    },
  },
  {
    id: "are-maids-professionals-labor-dignity",
    title: "Are Maids Professionals? A Personal Reflection on Labor and Dignity",
    slug: "are-maids-professionals-labor-dignity",
    category: ["Personal Essay", "Labor Studies", "Philosophy"],
    readingTime: 6,
    description: "A concluding essay applying the MoRes framework to domestic labor while reflecting on personal transformation and the meaning of professional identity across all forms of work.",
    excerpt: "A concluding essay applying the MoRes framework to domestic labor while reflecting on personal transformation and the meaning of professional identity.",
    pdfPath: "/documents/essays/AreMaidsProfessional.pdf",
    coverImage: "/images/essays/maids-professionals.jpg",
    series: "Professionalism",
    seriesOrder: 4,
    publishedDate: null,
    tags: ["#DomesticLabor", "#Professionalism", "#LaborDignity", "#PersonalEssay", "#WorkEthics", "#ProfessionalIdentity", "#SelfReflection"],
    seo: {
      title: "Are Maids Professionals? A Personal Reflection on Labor and Dignity",
      description: "A concluding essay applying the MoRes framework to domestic labor while reflecting on personal transformation and the meaning of professional identity across all forms of work.",
      keywords: ["domestic labor", "professional identity", "maids and professionalism", "labor dignity", "personal essay", "work ethics", "professional development", "labor philosophy", "self-reflection"],
    },
  },
  
  // ADDITIONAL STRONG ESSAYS
  {
    id: "absurd-failure-joad-family-grapes-wrath",
    title: "The Absurd Failure of the Joad Family: Class and Systemic Oppression in Grapes of Wrath",
    slug: "absurd-failure-joad-family-grapes-wrath",
    category: ["Literary Analysis", "Social Critique"],
    readingTime: 9,
    description: "Analyzing Steinbeck's Grapes of Wrath through the lens of systemic failure and class inequality, exploring how economic structures doom the Joad family despite their efforts.",
    excerpt: "Analyzing Steinbeck's Grapes of Wrath through the lens of systemic failure and class inequality.",
    pdfPath: "/documents/essays/CopyofEng2EssayGrapesofWrath.pdf",
    coverImage: "/images/essays/grapes-wrath.jpg",
    publishedDate: null,
    tags: ["#GrapesOfWrath", "#Steinbeck", "#ClassInequality", "#SystemicOppression", "#AmericanLiterature", "#LiteraryAnalysis", "#EconomicJustice"],
    seo: {
      title: "The Absurd Failure of the Joad Family: Class and Systemic Oppression in Grapes of Wrath",
      description: "Analyzing Steinbeck's Grapes of Wrath through the lens of systemic failure and class inequality, exploring how economic structures doom the Joad family despite their efforts.",
      keywords: ["Grapes of Wrath", "Steinbeck", "class inequality", "systemic oppression", "Great Depression", "American literature", "economic justice", "literary analysis", "social critique"],
    },
  },
  {
    id: "cyber-sirens-serenade-digital-danger",
    title: "Cyber-Siren's Serenade: Technology, Seduction, and Digital Danger",
    slug: "cyber-sirens-serenade-digital-danger",
    category: ["Cultural Criticism", "Technology Studies"],
    readingTime: 5,
    description: "A mythologically-framed exploration of how digital technology seduces and endangers us, examining smartphones and social media as modern sirens luring us toward destruction.",
    excerpt: "A mythologically-framed exploration of how digital technology seduces and endangers us, examining smartphones and social media as modern sirens.",
    pdfPath: "/documents/essays/PersuasiveEssay#2.pdf",
    coverImage: "/images/essays/cyber-sirens.jpg",
    publishedDate: null,
    tags: ["#DigitalCulture", "#TechnologyCritique", "#SmartphoneAddiction", "#SocialMedia", "#TechEthics", "#DigitalWellbeing", "#CulturalCriticism"],
    seo: {
      title: "Cyber-Siren's Serenade: Technology, Seduction, and Digital Danger",
      description: "A mythologically-framed exploration of how digital technology seduces and endangers us, examining smartphones and social media as modern sirens luring us toward destruction.",
      keywords: ["digital technology", "smartphone addiction", "social media critique", "technology and mythology", "digital culture", "tech criticism", "screen time", "digital wellbeing", "technology ethics"],
    },
  },
  {
    id: "dishwasher-robot-definition-history",
    title: "Is Your Dishwasher a Robot? Defining Robots from Mythology to AI",
    slug: "dishwasher-robot-definition-history",
    category: ["Technology Studies", "Research", "History"],
    readingTime: 21,
    description: "A comprehensive research essay tracing the definition of \"robot\" from Greek mythology through the Industrial Revolution to modern artificial intelligence and automation.",
    excerpt: "A comprehensive research essay tracing the definition of \"robot\" from Greek mythology through the Industrial Revolution to modern artificial intelligence.",
    pdfPath: "/documents/essays/ResearchEssay#1.pdf",
    coverImage: "/images/essays/robot.jpg",
    publishedDate: null,
    tags: ["#Robotics", "#ArtificialIntelligence", "#Automation", "#TechnologyHistory", "#AIPhilosophy", "#ResearchEssay", "#MachineLearning"],
    seo: {
      title: "Is Your Dishwasher a Robot? Defining Robots from Mythology to AI",
      description: "A comprehensive research essay tracing the definition of \"robot\" from Greek mythology through the Industrial Revolution to modern artificial intelligence and automation.",
      keywords: ["robot definition", "artificial intelligence", "automation", "history of robotics", "AI philosophy", "technology history", "machine intelligence", "robotics research", "Greek mythology and technology"],
    },
  },
];

// Essay categories for navigation
export const essayCategories = [
  { id: "all", name: "All Essays", slug: "all" },
  { id: "philosophy", name: "Philosophy", slug: "philosophy" },
  { id: "literary-criticism", name: "Literary Criticism", slug: "literary-criticism" },
  { id: "professionalism", name: "Professionalism Series", slug: "professionalism" },
  { id: "technology", name: "Technology & Culture", slug: "technology" },
  { id: "featured", name: "Featured", slug: "featured" },
];

// JSON-LD Structured Data for Person (Enhanced)
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteMeta.name,
  jobTitle: siteMeta.seo.jobTitle,
  url: siteMeta.seo.ogUrl,
  image: siteMeta.seo.image,
  email: "favi.libero@gmail.com",
  telephone: "+17373256215",
  sameAs: [
    siteMeta.links.linkedin,
    siteMeta.links.github,
  ],
  knowsAbout: [
    "Full-Stack Development",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "Node.js",
    "AI Automation",
    "Claude API",
    "Data Processing",
    "Web Audio API",
    "ETL Pipelines",
    "PostgreSQL",
    "Material-UI",
    "Leaflet Maps",
    "N8N Workflow Automation",
    "Literary Criticism",
    "Philosophy",
    "Political Theory",
  ],
  knowsLanguage: [
    { "@type": "Language", name: "English" },
    { "@type": "Language", name: "Italian" },
    { "@type": "Language", name: "Ukrainian" },
    { "@type": "Language", name: "Russian" },
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Kyiv University of Culture",
    },
    {
      "@type": "EducationalOrganization",
      name: "Austin Community College",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Austin",
    addressRegion: "TX",
    addressCountry: "US",
  },
};

// JSON-LD Structured Data for WebSite
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteMeta.seo.ogSiteName,
  url: siteMeta.seo.ogUrl,
  description: siteMeta.shortDescription,
  author: {
    "@type": "Person",
    name: siteMeta.name,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteMeta.seo.ogUrl}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// JSON-LD Structured Data for Projects (SoftwareApplication)
const baseUrl = siteMeta.seo.ogUrl;
export const projectsJsonLd = projectsMeta.map((project) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: project.title,
  description: project.fullDescription,
  url: project.external ? project.link : `${baseUrl}${project.link}`,
  applicationCategory: "WebApplication",
  operatingSystem: "Web Browser",
  author: {
    "@type": "Person",
    name: siteMeta.name,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  keywords: project.tags.join(", "),
  screenshot: project.ogImage ? `${baseUrl}${project.ogImage}` : `${baseUrl}/images/projects/${project.id}-screenshot.png`,
}));

// JSON-LD Structured Data for Essays (Article)
export const essaysJsonLd = (essay) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: essay.seo.title,
  description: essay.seo.description,
  author: {
    "@type": "Person",
    name: siteMeta.name,
  },
  datePublished: essay.publishedDate,
  keywords: essay.seo.keywords.join(", "),
  articleSection: essay.category.join(", "),
  wordCount: essay.readingTime * 200, // Approximate
  url: `https://favilibero.com/essays/${essay.slug}`,
  image: `https://favilibero.com${essay.coverImage}`,
});

// Helper function to generate page-specific metadata for Projects
export const generateProjectMetadata = (projectId) => {
  const project = projectsMeta.find((p) => p.id === projectId);
  if (!project) return null;

  const imageUrl = project.ogImage || `/images/projects/${projectId}-og.png`;
  return {
    title: project.seo.title,
    description: project.seo.description,
    keywords: project.seo.keywords,
    openGraph: {
      title: project.seo.title,
      description: project.seo.description,
      url: project.liveUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title,
      description: project.seo.description,
      images: [imageUrl],
    },
  };
};

// Helper function to generate page-specific metadata for Essays
export const generateEssayMetadata = (essaySlug) => {
  const essay = essaysMeta.find((e) => e.slug === essaySlug);
  if (!essay) return null;

  return {
    title: essay.seo.title,
    description: essay.seo.description,
    keywords: essay.seo.keywords,
    openGraph: {
      title: essay.seo.title,
      description: essay.seo.description,
      url: `https://favilibero.com/essays/${essay.slug}`,
      type: "article",
      images: [
        {
          url: essay.coverImage,
          width: 1200,
          height: 630,
          alt: essay.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: essay.seo.title,
      description: essay.seo.description,
      images: [essay.coverImage],
    },
  };
};

