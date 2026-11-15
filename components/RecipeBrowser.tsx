"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categoryLabel, EFFORT_LABEL, minutesLabel, type RecipeCardData } from "@/lib/format";

const FILTERS = [
  { id: "alla", label: "Alla" },
  { id: "snabba", label: "Snabba" },
  { id: "fisk", label: "Fisk" },
  { id: "kyckling", label: "Kyckling" },
  { id: "pasta", label: "Pasta" },
  { id: "bakverk", label: "Bakverk" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function matchesFilter(recipe: RecipeCardData, filter: FilterId): boolean {
  if (filter === "alla") return true;
  if (filter === "snabba") return recipe.minutes <= 25 || recipe.tags.includes("snabb");
  if (filter === "bakverk") return recipe.category === "bakverk";
  return recipe.tags.includes(filter) || recipe.title.toLowerCase().includes(filter);
}

export function RecipeBrowser({ recipes }: { recipes: RecipeCardData[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("alla");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (!matchesFilter(recipe, filter)) return false;
      if (!needle) return true;
      return [recipe.title, recipe.summary, recipe.tags.join(" "), categoryLabel(recipe.category)]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, query, recipes]);

  return (
    <>
      <label className="eyebrow" htmlFor="sok">
        Sök
      </label>
      <input
        id="sok"
        className="search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Tacos, fisk, pasta…"
        autoComplete="off"
      />

      <div className="chips" role="toolbar" aria-label="Filter">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">Inget recept matchade. Prova ett annat ord.</p>
      ) : (
        <div className="list">
          {visible.map((recipe) => (
            <Link key={recipe.slug} className="card" href={`/recept/${recipe.slug}`}>
              <h2>{recipe.title}</h2>
              <div className="meta">
                {recipe.minutes ? <span>{minutesLabel(recipe.minutes)}</span> : null}
                <span>{EFFORT_LABEL[recipe.effort]}</span>
                <span>{categoryLabel(recipe.category)}</span>
                {recipe.liked > 0 ? <span>♥ {recipe.liked}</span> : null}
              </div>
              {recipe.summary ? <p className="summary">{recipe.summary}</p> : null}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
