"use client";

import { useEffect, useState } from "react";
import { categoryLabel, EFFORT_LABEL, minutesLabel, parseInline, servingsLabel } from "@/lib/format";
import type { Recipe } from "@/lib/types";

function useChecked(key: string, count: number) {
  const [checked, setChecked] = useState<boolean[]>(() => Array.from({ length: count }, () => false));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as boolean[];
      if (Array.isArray(parsed) && parsed.length === count) setChecked(parsed);
    } catch {
      /* ignore broken local state */
    }
  }, [count, key]);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.map((value, i) => (i === index ? !value : value));
      window.localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  return { checked, toggle };
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((part, index) =>
        part.type === "link" ? (
          <a key={`${part.href}-${index}`} href={part.href} rel="noreferrer" target="_blank">
            {part.text}
          </a>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </>
  );
}

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const ingredients = useChecked(`ing:${recipe.slug}`, recipe.ingredients.length);
  const steps = useChecked(`step:${recipe.slug}`, recipe.steps.length);
  const [cooking, setCooking] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!cooking) return;
    let lock: WakeLockSentinel | undefined;
    const request = async () => {
      try {
        lock = await navigator.wakeLock?.request("screen");
      } catch {
        /* wake lock is optional */
      }
    };
    void request();
    return () => {
      void lock?.release();
    };
  }, [cooking]);

  return (
    <>
      <p className="eyebrow">{categoryLabel(recipe.category)}</p>
      <h1 className="hero-title">{recipe.title}</h1>
      {recipe.summary ? <p className="lede">{recipe.summary}</p> : null}

      <div className="pills">
        {recipe.minutes ? <span className="pill">{minutesLabel(recipe.minutes)}</span> : null}
        <span className="pill">{EFFORT_LABEL[recipe.effort]}</span>
        <span className="pill">{servingsLabel(recipe.servings)}</span>
        {recipe.allergens.map((allergen) => (
          <span key={allergen} className="pill">
            {allergen}
          </span>
        ))}
      </div>

      <div className="actions">
        {recipe.steps.length > 0 ? (
          <button
            type="button"
            className="cta"
            onClick={() => {
              setStepIndex(0);
              setCooking(true);
            }}
          >
            Laga steg för steg
          </button>
        ) : null}
      </div>

      <h2 className="section-title">Ingredienser</h2>
      <ul className="check-list">
        {recipe.ingredients.map((item, index) => (
          <li key={`${index}-${item}`}>
            <button type="button" data-done={ingredients.checked[index]} onClick={() => ingredients.toggle(index)}>
              {item}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Gör så här</h2>
      <ol className="step-list">
        {recipe.steps.map((item, index) => (
          <li key={`${index}-${item}`}>
            <button type="button" data-done={steps.checked[index]} onClick={() => steps.toggle(index)}>
              {index + 1}. {item}
            </button>
          </li>
        ))}
      </ol>

      {recipe.tips.length > 0 ? (
        <>
          <h2 className="section-title">Tips</h2>
          <div className="tips">
            {recipe.tips.map((tip) => (
              <p key={tip}>
                <Inline text={tip} />
              </p>
            ))}
          </div>
        </>
      ) : null}

      {cooking ? (
        <div className="cook" role="dialog" aria-modal="true" aria-label="Laga steg för steg">
          <button type="button" className="cook-close" onClick={() => setCooking(false)}>
            Stäng
          </button>
          <p className="cook-progress">
            Steg {stepIndex + 1} av {recipe.steps.length}
          </p>
          <p className="cook-step">{recipe.steps[stepIndex]}</p>
          <div className="cook-nav">
            <button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((value) => value - 1)}>
              Föregående
            </button>
            {stepIndex < recipe.steps.length - 1 ? (
              <button type="button" onClick={() => setStepIndex((value) => value + 1)}>
                Nästa
              </button>
            ) : (
              <button type="button" onClick={() => setCooking(false)}>
                Klart
              </button>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
