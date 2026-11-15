"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { minutesLabel } from "@/lib/format";
import { suggestRecipes, whyItFits } from "@/lib/suggest";
import type { Denylist, Recipe } from "@/lib/types";

export function SuggestPanel({ recipes, denylist }: { recipes: Recipe[]; denylist: Denylist }) {
  const [seed, setSeed] = useState(0);

  const suggestion = useMemo(() => {
    let cursor = (seed + 1) * 9301 + 49297;
    const random = () => {
      cursor = (cursor * 49297 + 12345) % 233280;
      return cursor / 233280;
    };
    return suggestRecipes(recipes, denylist, random);
  }, [denylist, recipes, seed]);

  if (!suggestion) {
    return <p className="empty">Inget middagsförslag just nu. Kolla denylist.</p>;
  }

  const { main, alternatives } = suggestion;

  return (
    <>
      <Link className="card suggest-main" href={`/recept/${main.slug}`}>
        <p className="eyebrow">Ikväll</p>
        <h2>{main.title}</h2>
        <div className="meta">
          {main.minutes ? <span>{minutesLabel(main.minutes)}</span> : null}
          <span>{whyItFits(main)}</span>
        </div>
        {main.summary ? <p className="summary">{main.summary}</p> : null}
      </Link>

      {alternatives.length > 0 ? (
        <>
          <h2 className="section-title">Alternativ</h2>
          <div className="alt-grid">
            {alternatives.map((recipe) => (
              <Link key={recipe.slug} className="card" href={`/recept/${recipe.slug}`}>
                <h3>{recipe.title}</h3>
                <div className="meta">
                  {recipe.minutes ? <span>{minutesLabel(recipe.minutes)}</span> : null}
                  <span>{whyItFits(recipe)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      <div className="actions">
        <button type="button" className="cta" onClick={() => setSeed((value) => value + 1)}>
          Ett annat förslag
        </button>
      </div>
    </>
  );
}
