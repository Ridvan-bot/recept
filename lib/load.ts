import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { parseDenylist, parseRecipeMarkdown } from "./parse";
import type { Denylist, Recipe } from "./types";

type PopularityFile = {
  recipes?: Record<string, { cooked?: number; liked?: number; title?: string }>;
};

const ROOT = process.cwd();

function walkMarkdown(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdown(full));
    else if (entry.name.endsWith(".md") && entry.name.toLowerCase() !== "readme.md") {
      out.push(full);
    }
  }
  return out;
}

export const getRecipes = cache((): Recipe[] => {
  const recipesDir = path.join(ROOT, "recipes");
  const popularityPath = path.join(ROOT, "state", "popularity.json");
  const popularity: PopularityFile = JSON.parse(fs.readFileSync(popularityPath, "utf8"));

  const recipes = walkMarkdown(recipesDir).map((file) => {
    const rel = path.relative(ROOT, file).split(path.sep).join("/");
    const category = rel.split("/")[1] ?? "ovrigt";
    const slug = path.basename(file, ".md");
    const stats = popularity.recipes?.[rel] ?? {};
    return parseRecipeMarkdown(fs.readFileSync(file, "utf8"), {
      slug,
      path: rel,
      category,
      cooked: stats.cooked ?? 0,
      liked: stats.liked ?? 0,
    });
  });

  return recipes.sort((a, b) => {
    if (b.liked !== a.liked) return b.liked - a.liked;
    if (b.cooked !== a.cooked) return b.cooked - a.cooked;
    return a.title.localeCompare(b.title, "sv");
  });
});

export const getDenylist = cache((): Denylist => {
  const file = path.join(ROOT, "state", "denylist.md");
  return parseDenylist(fs.readFileSync(file, "utf8"));
});

export function getRecipe(slug: string): Recipe | undefined {
  return getRecipes().find((recipe) => recipe.slug === slug);
}
