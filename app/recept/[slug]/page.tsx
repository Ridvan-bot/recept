import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeDetail } from "@/components/RecipeDetail";
import { getRecipe, getRecipes } from "@/lib/load";

type Params = { slug: string };

export function generateStaticParams() {
  return getRecipes().map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: "Recept saknas" };
  return {
    title: recipe.title,
    description: recipe.summary,
  };
}

export default async function RecipePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return (
    <>
      <Link className="back" href="/">
        ← Alla recept
      </Link>
      <RecipeDetail recipe={recipe} />
    </>
  );
}
