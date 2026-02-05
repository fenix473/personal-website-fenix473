/**
 * Dynamic sitemap for SEO. Uses site-metadata for projects and essays.
 */
import { siteMeta, projectsMeta, essaysMeta } from "@/data/site-metadata";

const baseUrl = siteMeta.seo.ogUrl;

export default function sitemap() {
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/writings`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const projectPages = projectsMeta.map((project) => ({
    url: `${baseUrl}${project.link}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const essayPages = essaysMeta.map((essay) => ({
    url: `${baseUrl}/essays/${essay.slug}`,
    lastModified: essay.publishedDate ? new Date(essay.publishedDate) : new Date(),
    changeFrequency: "yearly",
    priority: essay.featured ? 0.7 : 0.5,
  }));

  return [...staticPages, ...projectPages, ...essayPages];
}
