import type { Effort, Recipe } from "./types";

export const EFFORT_LABEL: Record<Effort, string> = {
  easy: "Enkel",
  medium: "Medel",
  hard: "Svår",
};

export const CATEGORY_LABEL: Record<string, string> = {
  vardagsmat: "Vardagsmat",
  bakverk: "Bakverk",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? category;
}

export function minutesLabel(minutes: number): string {
  if (!minutes) return "";
  return `${minutes} min`;
}

export function servingsLabel(servings: number): string {
  return `${servings} port`;
}

export type InlinePart =
  | { type: "text"; value: string }
  | { type: "link"; text: string; href: string };

export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const regex = /\[([^\]]+)\]\((https?:[^)\s]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(regex)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ type: "text", value: text.slice(last, index) });
    parts.push({ type: "link", text: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts.length ? parts : [{ type: "text", value: text }];
}

export function toCard(recipe: Recipe) {
  return {
    slug: recipe.slug,
    title: recipe.title,
    category: recipe.category,
    tags: recipe.tags,
    effort: recipe.effort,
    servings: recipe.servings,
    minutes: recipe.minutes,
    allergens: recipe.allergens,
    summary: recipe.summary,
    cooked: recipe.cooked,
    liked: recipe.liked,
  };
}

export type RecipeCardData = ReturnType<typeof toCard>;
