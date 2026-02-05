/**
 * Assistant project layout - metadata from central site-metadata for SEO and social sharing.
 */
import { generateProjectMetadata } from "@/data/site-metadata";

export const metadata =
  generateProjectMetadata("assistant") ?? {
    title: "Assistant | Libero Favi",
    description: "Custom AI assistant powered by Claude API.",
  };

export default function AssistantLayout({ children }) {
  return children;
}
