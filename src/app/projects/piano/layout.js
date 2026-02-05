/**
 * Piano project layout - metadata from central site-metadata for SEO and social sharing.
 */
import { generateProjectMetadata } from "@/data/site-metadata";

export const metadata =
  generateProjectMetadata("piano") ?? {
    title: "Piano | Libero Favi",
    description: "Interactive web piano with AI melody generation.",
  };

export default function PianoLayout({ children }) {
  return children;
}
