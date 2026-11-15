import type { Metadata } from "next";
import { SuggestPanel } from "@/components/SuggestPanel";
import { getDenylist, getRecipes } from "@/lib/load";

export const metadata: Metadata = {
  title: "Middagsförslag",
};

export default function SuggestPage() {
  const recipes = getRecipes();
  const denylist = getDenylist();

  return (
    <>
      <header>
        <p className="eyebrow">Vad ska vi äta?</p>
        <h1 className="hero-title">Middagsförslag</h1>
        <p className="lede">Ett huvudförslag och två alternativ, vägt mot vad vi lagar och gillar.</p>
      </header>
      <SuggestPanel recipes={recipes} denylist={denylist} />
    </>
  );
}
