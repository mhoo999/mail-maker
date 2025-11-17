import { Block } from "@/types/block";
import { TemplateDefinition } from "./templates";

const STORAGE_KEY = "mail-maker-custom-templates";

export interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
  createdAt: string;
}

export function getSavedTemplates(): SavedTemplate[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load templates:", error);
    return [];
  }
}

export function saveTemplate(name: string, description: string, blocks: Block[]): SavedTemplate {
  const template: SavedTemplate = {
    id: `custom-${Date.now()}`,
    name,
    description,
    blocks,
    createdAt: new Date().toISOString(),
  };

  const templates = getSavedTemplates();
  templates.push(template);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return template;
  } catch (error) {
    console.error("Failed to save template:", error);
    throw error;
  }
}

export function deleteTemplate(id: string): void {
  const templates = getSavedTemplates();
  const filtered = templates.filter((t) => t.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete template:", error);
    throw error;
  }
}

export function savedTemplateToDefinition(saved: SavedTemplate): TemplateDefinition {
  return {
    id: saved.id,
    name: saved.name,
    description: saved.description,
    type: "custom",
    blocks: saved.blocks.map(({ id, ...rest }) => rest) as Omit<Block, "id">[],
  };
}
