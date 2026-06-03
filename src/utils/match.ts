import type { Recipe } from "../data/recipes";

export type RecipeMatch = {
  recipe: Recipe;
  matched: string[];
  missing: string[];
  score: number;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function parseIngredients(value: string) {
  return value
    .split(/[,;\n]/)
    .map(normalize)
    .filter(Boolean);
}

export function uniqueIngredients(items: string[]) {
  return Array.from(new Set(items.map(normalize).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function matchRecipe(recipe: Recipe, pantry: string[]): RecipeMatch {
  const pantrySet = new Set(pantry.map(normalize));
  const required = recipe.ingredients.map(normalize);
  const matched = required.filter((ingredient) => pantrySet.has(ingredient));
  const missing = required.filter((ingredient) => !pantrySet.has(ingredient));
  const score = required.length ? Math.round((matched.length / required.length) * 100) : 0;

  return { recipe, matched, missing, score };
}

export function rankRecipes(recipes: Recipe[], pantry: string[]) {
  return recipes
    .map((recipe) => matchRecipe(recipe, pantry))
    .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length || a.recipe.name.localeCompare(b.recipe.name));
}
