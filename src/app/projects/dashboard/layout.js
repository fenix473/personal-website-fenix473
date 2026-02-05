/**
 * Dashboard project layout - metadata from central site-metadata for SEO and social sharing.
 */
import { generateProjectMetadata } from "@/data/site-metadata";

export const metadata =
  generateProjectMetadata("dashboard") ?? {
    title: "Dashboard | Libero Favi",
    description: "Real-time traffic dashboard with ETL pipeline.",
  };

export default function DashboardLayout({ children }) {
  return children;
}
