import Link from "next/link";
import { RecipeBrowser } from "@/components/RecipeBrowser";
import { toCard } from "@/lib/format";
import { getRecipes } from "@/lib/load";

export default function HomePage() {
  const recipes = getRecipes().map(toCard);

  return (
    <>
      <header className="top">
        <div>
          <p className="eyebrow">Hushållet</p>
          <h1>Recept</h1>
          <p className="lede">Sök, filtrera eller få ett middagsförslag.</p>
        </div>
        <Link className="cta" href="/forslag">
          Middag?
        </Link>
      </header>
      <RecipeBrowser recipes={recipes} />
    </>
  );
}
