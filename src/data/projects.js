/**
 * Projects list for the home page grid. Used by ProjectsGrid.
 * imagePosition: 'left' | 'right' (optional, defaults to 'left')
 * variant: used for CSS class project-card--{variant}
 */
export const projects = [
  {
    href: "/projects/dashboard",
    variant: "dashboard",
    title: "Dashboard",
    description: "Interactive dashboard for tracking and analyzing data.",
    imagePosition: "left",
  },
  {
    href: "/projects/piano",
    variant: "piano",
    title: "Piano",
    description:
      "Interactive one-octave piano with keyboard and touch support. Built with Web Audio API.",
    imagePosition: "right",
  },
  {
    href: "/projects/assistant",
    variant: "assistant",
    title: "Assistant",
    description:
      "Human in the loop assistant using Claude. They will help you navigating this website and answer your general curiosities.",
    imagePosition: "left",
  },
];
