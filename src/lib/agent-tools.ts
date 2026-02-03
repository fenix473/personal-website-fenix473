export const INSPECT_PROJECT_CODE = "inspect_project_code";

// MAP OF THE GITHUB CODE
/** Blob URL: for opening in browser (HTML page). */
export const GITHUB_REPO_BASE = "https://github.com/fenix473/personal-website-fenix473/blob/main/";
/** Raw URL: for fetching plain-text source (use with web_fetch). */
export const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/fenix473/personal-website-fenix473/main/";

export type CodeReference = {
    label: string;
    path: string;
}


export const PROJECT_CODE_MAP: Record<string, CodeReference[]> = {
    // Dashboard Project
    dashboard: [
      { label: "Dashboard Page", path: "src/app/projects/dashboard/page.js" },
      { label: "Dashboard API Route", path: "src/app/api/dashboard/route.js" },
      { label: "Dashboard Styles", path: "src/styles/Dashboard.css" }
    ],
  
    // Piano Project
    piano: [
      { label: "Piano Page", path: "src/app/projects/piano/page.js" },
      { label: "Piano Layout", path: "src/app/projects/piano/layout.js" },
      { label: "Piano Component", path: "src/components/Piano.jsx" },
      { label: "Piano Key Component", path: "src/components/PianoKey.jsx" },
      { label: "Melody Button Component", path: "src/components/MelodyButton.jsx" },
      { label: "Piano API - Generate", path: "src/app/api/piano/generate/route.js" },
      { label: "Piano API - Save", path: "src/app/api/piano/save/route.js" },
      { label: "Piano API - List", path: "src/app/api/piano/list/route.js" },
      { label: "Piano API - Delete", path: "src/app/api/piano/delete/route.js" },
      { label: "Audio Player Hook", path: "src/hooks/useAudioPlayer.js" },
      { label: "Key Press Hook", path: "src/hooks/useKeyPress.js" },
      { label: "Piano Styles", path: "src/styles/Piano.css" },
      { label: "Piano Page Styles", path: "src/styles/PianoPage.css" }
    ],
  
    // Assistant Project
    assistant: [
      { label: "Assistant Page", path: "src/app/projects/assistant/page.js" },
      { label: "Chat Window Component", path: "src/components/ChatWindow.js" },
      { label: "Chat Window Wrapper", path: "src/components/ChatWindowWrapper.js" },
      { label: "Claude API Route", path: "src/app/api/claude/route.js" },
      { label: "Chat API Route", path: "src/app/api/chat/route.js" },
      { label: "Agent Personas Config", path: "src/lib/agent-personas.js" },
      { label: "Chat Window Styles", path: "src/styles/ChatWindow.css" }
    ],
  
    // Main Pages
    homepage: [
      { label: "Root Page", path: "src/app/page.js" },
      { label: "Home Component", path: "src/components/Home.js" },
      { label: "Orbit Background", path: "src/components/OrbitBackground.js" },
      { label: "Orbit Calculation", path: "src/app/orbit/OrbitCalculation.js" },
      { label: "Orbit Space", path: "src/app/orbit/OrbitSpace.js" },
      { label: "Home Styles", path: "src/styles/Home.css" }
    ],
  
    projects: [
      { label: "Projects Page", path: "src/app/projects/page.js" },
      { label: "Projects Component", path: "src/components/Projects.js" },
      { label: "Projects Styles", path: "src/styles/Projects.css" }
    ],
  
    writings: [
      { label: "Writings Page", path: "src/app/writings/page.js" },
      { label: "Writings Component", path: "src/components/Writings.js" },
      { label: "Word Reader Utility", path: "src/utils/wordReader.js" },
      { label: "Infinite Scroll Hook", path: "src/utils/useInfiniteScroll.js" },
      { label: "Writings Styles", path: "src/styles/Writings.css" }
    ],
  
    // About & Resume
    about: [
      { label: "About Component", path: "src/components/About.js" }
    ],
  
    resume: [
      { label: "Resume Component", path: "src/components/Resume.js" },
      { label: "Resume Styles", path: "src/styles/Resume.css" }
    ],
  
    contact: [
      { label: "Contact Component", path: "src/components/Contact.js" }
    ],
  
    // Authentication
    auth: [
      { label: "Auth Callback Route", path: "src/app/auth/callback/route.js" },
      { label: "Auth Sign In Route", path: "src/app/auth/signin/route.js" },
      { label: "Auth Me API Route", path: "src/app/api/auth/me/route.js" },
      { label: "Nav Auth Component", path: "src/components/NavAuth.js" },
      { label: "Middleware", path: "src/middleware.js" }
    ],
  
    // Database
    database: [
      { label: "Database Config", path: "src/lib/db.js" },
      { label: "Database API Route", path: "src/app/api/db/route.js" }
    ],
  
    // Shared Components
    shared_components: [
      { label: "Cover Back Button", path: "src/components/CoverBackButton.js" },
      { label: "Cover Back Button Styles", path: "src/styles/CoverBackButton.css" }
    ],
  
    // UI Components
    ui_components: [
      { label: "Color Mode Provider", path: "src/components/ui/color-mode.jsx" },
      { label: "UI Provider", path: "src/components/ui/provider.jsx" },
      { label: "Toaster", path: "src/components/ui/toaster.jsx" },
      { label: "Tooltip", path: "src/components/ui/tooltip.jsx" }
    ],
  
    // Layout & Styles
    layout: [
      { label: "Root Layout", path: "src/app/layout.js" },
      { label: "Global Styles", path: "src/app/globals.css" },
      { label: "Page Module Styles", path: "src/app/page.module.css" },
      { label: "Nav Styles", path: "src/styles/Nav.css" }
    ]
  };
     

// Actual Tools

export const ASSISTANT_TOOLS = [
    {
        name: INSPECT_PROJECT_CODE,
        description: "Look up Github code links for a project. Use when when user asks how something was built or for code links.",
        input_schema: {
            type: "object" as const,
            properties: {
              project: {
                type: "string",
                description: "Project key: dashboard | piano | assistant | ...",
              },
            },
            required: ["project"],
          },
          
    },
    
]

export const WEB_FETCH_TOOL = {
    name: 'web_fetch',
    type: 'web_fetch_20250910',
    allowed_domains: ['github.com', 'raw.githubusercontent.com'],
}