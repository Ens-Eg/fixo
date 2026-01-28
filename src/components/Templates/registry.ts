import { TemplateInfo } from "./types";
import DefaultTemplate from "./DefaultTemplate";
import NeonTemplate from "./NeonTemplate";
import CoffeeTemplate from "./CoffeTemplate";
import SkyTemplate from "./SkyTemplate";

/**
 * Template Registry
 *
 * To add a new template:
 * 1. Create TemplateX.tsx in this folder
 * 2. Import it above
 * 3. Add it to the templates array below
 */
export const templates: TemplateInfo[] = [
  {
    id: "default",
    name: "Default Template",
    nameAr: "القالب الافتراضي",
    component: DefaultTemplate,
    description:
      "Modern bilingual menu with hero section and smooth animations",
    descriptionAr: "قائمة عصرية ثنائية اللغة مع قسم بطولي ورسوم متحركة سلسة",
  },
  {
    id: "neon",
    name: "Neon Template",
    nameAr: "قالب النيون",
    component: NeonTemplate,
    description: "Neon menu template with a modern design",
    descriptionAr: "قالب قائمة نيون مع تصميم عصري",
  },
  {
    id: "coffee",
    name: "Coffee Template",
    nameAr: "قالب القهوة",
    component: CoffeeTemplate,
    description: "Coffee menu template with a modern design",
    descriptionAr: "قالب قائمة القهوة عصري  ",
  },
  {
    id: "sky",
    name: "Sky Template",
    nameAr: "قالب السماء",
    component: SkyTemplate,
    description: "Sky menu template with a modern design and blue color",
    descriptionAr: "قالب قائمة السماء عصري ولون أزرق  ",
  },
 
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TemplateInfo | undefined {
  return templates.find((template) => template.id === id);
}

/**
 * Get default template
 */
export function getDefaultTemplate(): TemplateInfo {
  return templates[0]; // First template is default
}

/**
 * Get all template IDs
 */
export function getAllTemplateIds(): string[] {
  return templates.map((template) => template.id);
}

/**
 * Check if template exists
 */
export function templateExists(id: string): boolean {
  return templates.some((template) => template.id === id);
}
