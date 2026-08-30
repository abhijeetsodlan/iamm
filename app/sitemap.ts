import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = ["/", "/services", "/about", "/assessment", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/assessment" || route === "/contact" ? 0.9 : 0.7,
  }));
}
