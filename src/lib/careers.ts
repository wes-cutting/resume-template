import type { Site, SiteCareer } from "@/content/types";

export function getCareers(site: Site): SiteCareer[] {
  return [...site.careers].sort((a, b) => a.order - b.order);
}

export function getCareerById(site: Site, id: string): SiteCareer | undefined {
  return site.careers.find((c) => c.id === id);
}
