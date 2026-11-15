import type { Denylist, Effort, Recipe } from "./types";

const EFFORTS = new Set<Effort>(["easy", "medium", "hard"]);

function parseBracketList(value: string): string[] {
  const inner = value.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  return inner
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function sectionItems(body: string, numbered: boolean): string[] {
  const items: string[] = [];
  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = numbered ? line.match(/^\d+\.\s+(.*)$/) : line.match(/^[-*]\s+(.*)$/);
    if (match) items.push(match[1].trim());
  }
  return items;
}

export function parseRecipeMarkdown(
  markdown: string,
  meta: Pick<Recipe, "slug" | "path" | "category" | "cooked" | "liked">,
): Recipe {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1].trim() ?? meta.slug;

  const field = (name: string) => {
    const match = markdown.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
    return match?.[1].trim() ?? "";
  };

  const effortRaw = field("effort");
  const effort: Effort = EFFORTS.has(effortRaw as Effort) ? (effortRaw as Effort) : "easy";

  const servings = Number.parseInt(field("servings"), 10) || 4;
  const minutes = Number.parseInt(field("tid_minuter"), 10) || 0;

  const grabSection = (heading: string) => {
    const regex = new RegExp(`^##\\s+${heading}\\s*$`, "im");
    const match = regex.exec(markdown);
    if (!match || match.index === undefined) return "";
    const start = match.index + match[0].length;
    const rest = markdown.slice(start);
    const next = rest.search(/^##\s+/m);
    return (next === -1 ? rest : rest.slice(0, next)).trim();
  };

  return {
    ...meta,
    title,
    tags: parseBracketList(field("tags")),
    effort,
    servings,
    minutes,
    allergens: parseBracketList(field("allergener")),
    summary: field("summary"),
    ingredients: sectionItems(grabSection("Ingredienser"), false),
    steps: sectionItems(grabSection("Gör så här"), true),
    tips: sectionItems(grabSection("Tips"), false),
  };
}

function bulletValues(markdown: string, heading: string): string[] {
  const regex = new RegExp(`^##\\s+${heading}\\s*$`, "im");
  const match = regex.exec(markdown);
  if (!match || match.index === undefined) return [];
  const rest = markdown.slice(match.index + match[0].length);
  const next = rest.search(/^##\s+/m);
  const body = (next === -1 ? rest : rest.slice(0, next)).trim();
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter((line) => line && !line.startsWith("_"));
}

export function parseDenylist(markdown: string): Denylist {
  return {
    allergies: bulletValues(markdown, "Allergier / intoleranser"),
    neverAgain: bulletValues(markdown, "Aldrig igen"),
    extra: bulletValues(markdown, "Övriga hårda regler"),
  };
}

export function isDenied(recipe: Recipe, denylist: Denylist): boolean {
  const haystack = [
    recipe.path,
    recipe.slug,
    recipe.title,
    ...recipe.tags,
    ...recipe.allergens,
    ...recipe.ingredients,
    recipe.summary,
  ]
    .join(" ")
    .toLowerCase();

  const rules = [...denylist.allergies, ...denylist.neverAgain, ...denylist.extra];
  return rules.some((rule) => haystack.includes(rule.toLowerCase()));
}
