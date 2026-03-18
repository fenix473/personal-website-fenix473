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
  // Dashboard Project - Now with modular components, map integration, and traffic reports
  dashboard: [
    { label: "Dashboard Page", path: "src/app/projects/dashboard/page.js" },
    { label: "Dashboard Header Component", path: "src/app/projects/dashboard/components/DashboardHeader.js" },
    { label: "Dashboard Table Component", path: "src/app/projects/dashboard/components/DashboardTable.js" },
    { label: "Dashboard Form Component", path: "src/app/projects/dashboard/components/DashboardForm.js" },
    { label: "Dashboard Map Component", path: "src/app/projects/dashboard/components/DashboardMap.js" },
    { label: "Dashboard Stats Component", path: "src/app/projects/dashboard/components/DashboardStats.js" },
    { label: "Dashboard Loading Component", path: "src/app/projects/dashboard/components/DashboardLoading.js" },
    { label: "Location Picker Component", path: "src/app/projects/dashboard/components/LocationPicker.js" },
    { label: "Location Picker Map Inner", path: "src/app/projects/dashboard/components/LocationPickerMapInner.js" },
    { label: "Dashboard API Route", path: "src/app/api/dashboard/route.js" },
    { label: "Traffic Reports API", path: "src/app/api/traffic-reports/route.js" },
    { label: "Traffic Reports Daily API", path: "src/app/api/traffic-reports/daily/route.js" },
    { label: "Dashboard Styles", path: "src/styles/Dashboard.css" },
    { label: "Stats Card Component", path: "src/components/StatsCard.js" },
    { label: "Stats Card Styles", path: "src/styles/StatsCard.css" }
  ],

  // Trader Module (external – live at https://trader-module-frontend.vercel.app/)
  trader: [
    { label: "Trader Module (external)", path: "https://trader-module-frontend.vercel.app/" },
  ],

  // Assistant Project
  assistant: [
    { label: "Assistant Page", path: "src/app/projects/assistant/page.js" },
    { label: "Chat Window Component", path: "src/components/chat/ChatWindow.js" },
    { label: "Chat Window Wrapper", path: "src/components/chat/ChatWindowWrapper.js" },
    { label: "Claude API Route", path: "src/app/api/claude/route.js" },
    { label: "Chat API Route", path: "src/app/api/chat/route.js" },
    { label: "Agent Personas Config", path: "src/lib/agent-personas.js" },
    { label: "Agent Tools Config", path: "src/lib/agent-tools.ts" },
    { label: "Chat Window Styles", path: "src/styles/ChatWindow.css" }
  ],

  // Main Pages
  homepage: [
    { label: "Root Page", path: "src/app/page.js" },
    { label: "Home Component", path: "src/components/home/Home.js" },
    { label: "Projects Grid Component", path: "src/components/home/ProjectsGrid.tsx" },
    { label: "Orbit Background", path: "src/components/layout/OrbitBackground.js" },
    { label: "Orbit Calculation", path: "src/app/orbit/OrbitCalculation.js" },
    { label: "Orbit Space", path: "src/app/orbit/OrbitSpace.js" },
    { label: "Home Styles", path: "src/styles/Home.css" }
  ],

  projects: [
    { label: "Projects Page", path: "src/app/projects/page.js" },
    { label: "Projects Component", path: "src/components/projects/Projects.js" },
    { label: "Projects Theme", path: "src/theme/projects-theme.ts" },
    { label: "Projects Styles", path: "src/styles/Projects.css" }
  ],

  writings: [
    { label: "Writings Page", path: "src/app/writings/page.js" },
    { label: "Writings Component", path: "src/components/home/Writings.js" },
    { label: "Word Reader Utility", path: "src/utils/wordReader.js" },
    { label: "Infinite Scroll Hook", path: "src/utils/useInfiniteScroll.js" },
    { label: "Writings Styles", path: "src/styles/Writings.css" }
  ],

  // About & Resume
  about: [
    { label: "About Component", path: "src/components/home/About.js" }
  ],

  resume: [
    { label: "Resume Component", path: "src/components/home/Resume.js" },
    { label: "Resume Styles", path: "src/styles/Resume.css" }
  ],

  contact: [
    { label: "Contact Component", path: "src/components/home/Contact.js" }
  ],

  // Authentication
  auth: [
    { label: "Auth Callback Route", path: "src/app/auth/callback/route.js" },
    { label: "Auth Sign In Route", path: "src/app/auth/signin/route.js" },
    { label: "Auth Me API Route", path: "src/app/api/auth/me/route.js" },
    { label: "Nav Auth Component", path: "src/components/layout/NavAuth.js" }
  ],

  // Database
  database: [
    { label: "Database Config", path: "src/lib/db.js" },
    { label: "Database API Route", path: "src/app/api/db/route.js" }
  ],

  // Cron Jobs & Scheduled Tasks
  cron: [
    { label: "Cron API Route", path: "src/app/api/cron/route.js" },
    { label: "Cron Daily Route", path: "src/app/api/cron/daily/route.js" }
  ],

  // Map Components
  map: [
    { label: "Map Component", path: "src/components/map.tsx" },
    { label: "Dashboard Map Component", path: "src/app/projects/dashboard/components/DashboardMap.js" },
    { label: "Location Picker Component", path: "src/app/projects/dashboard/components/LocationPicker.js" },
    { label: "Location Picker Map Inner", path: "src/app/projects/dashboard/components/LocationPickerMapInner.js" }
  ],

  // Layout Components
  layout_components: [
    { label: "Header Back Button", path: "src/components/layout/HeaderBackButton.js" },
    { label: "Layout Incidents Stats", path: "src/components/layout/LayoutIncidentsStats.js" },
    { label: "Nav Auth Component", path: "src/components/layout/NavAuth.js" },
    { label: "Orbit Background", path: "src/components/layout/OrbitBackground.js" },
    { label: "Cover Back Button", path: "src/components/CoverBackButton.js" },
    { label: "Header Styles", path: "src/styles/Header.css" },
    { label: "Footer Styles", path: "src/styles/Footer.css" },
    { label: "Cover Back Button Styles", path: "src/styles/CoverBackButton.css" }
  ],

  // UI Components
  ui_components: [
    { label: "Color Mode Provider", path: "src/components/ui/color-mode.jsx" },
    { label: "UI Provider", path: "src/components/ui/provider.jsx" },
    { label: "Toaster", path: "src/components/ui/toaster.jsx" },
    { label: "Tooltip", path: "src/components/ui/tooltip.jsx" },
    { label: "Stats Card Component", path: "src/components/StatsCard.js" },
    { label: "Stats Card Styles", path: "src/styles/StatsCard.css" }
  ],

  // Configuration & Types
  config: [
    { label: "Root Layout", path: "src/app/layout.js" },
    { label: "Global Styles", path: "src/app/globals.css" },
    { label: "Page Module Styles", path: "src/app/page.module.css" },
    { label: "Nav Styles", path: "src/styles/Nav.css" },
    { label: "Proxy Config", path: "src/proxy.js" },
    { label: "TypeScript Config", path: "tsconfig.json" },
    { label: "MUI Types", path: "src/types/mui.d.ts" },
    { label: "Vercel Config", path: "vercel.json" }
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