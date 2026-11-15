import { isDenied } from "./parse";
import type { Denylist, Recipe } from "./types";

export type Suggestion = {
  main: Recipe;
  alternatives: Recipe[];
};

function weightedPick(recipes: Recipe[], random: () => number): Recipe {
  const weights = recipes.map((recipe) => recipe.liked * 3 + recipe.cooked * 2 + 1);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = random() * total;
  for (let i = 0; i < recipes.length; i += 1) {
    cursor -= weights[i];
    if (cursor <= 0) return recipes[i];
  }
  return recipes[recipes.length - 1];
}

export function suggestRecipes(
  recipes: Recipe[],
  denylist: Denylist,
  random: () => number = Math.random,
): Suggestion | null {
  const pool = recipes.filter((recipe) => recipe.category !== "bakverk" && !isDenied(recipe, denylist));
  if (pool.length === 0) return null;

  const main = weightedPick(pool, random);
  const remaining = pool.filter((recipe) => recipe.slug !== main.slug);
  const alternatives: Recipe[] = [];
  const nextPool = [...remaining];
  while (alternatives.length < 2 && nextPool.length > 0) {
    const pick = weightedPick(nextPool, random);
    alternatives.push(pick);
    const index = nextPool.findIndex((recipe) => recipe.slug === pick.slug);
    nextPool.splice(index, 1);
  }

  return { main, alternatives };
}

export function whyItFits(recipe: Recipe): string {
  const bits: string[] = [];
  if (recipe.liked >= 7) bits.push("en favorit hemma");
  else if (recipe.cooked >= 6) bits.push(`lagas ofta (${recipe.cooked} gånger)`);
  if (recipe.tags.includes("barnvänlig") || recipe.tags.includes("barnvänligt")) {
    bits.push("barnvänlig");
  }
  if (recipe.minutes && recipe.minutes <= 25) bits.push("går snabbt");
  return bits.slice(0, 2).join(" · ") || recipe.summary;
}
