export type Effort = "easy" | "medium" | "hard";

export type Recipe = {
  slug: string;
  path: string;
  category: string;
  title: string;
  tags: string[];
  effort: Effort;
  servings: number;
  minutes: number;
  allergens: string[];
  summary: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  cooked: number;
  liked: number;
};

export type Denylist = {
  allergies: string[];
  neverAgain: string[];
  extra: string[];
};
