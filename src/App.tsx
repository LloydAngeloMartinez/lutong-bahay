import { BookOpen, Clock, Heart, ListPlus, Search, Shuffle, Star, Trash2 } from "lucide-react";
import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { commonIngredients, Difficulty, MealType, recipes, type Recipe } from "./data/recipes";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { parseIngredients, rankRecipes, uniqueIngredients } from "./utils/match";

const mealTypes: Array<MealType | "All"> = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Fiesta"];
const difficulties: Array<Difficulty | "All"> = ["All", "Easy", "Medium", "Advanced"];
const mealTypeLabels: Record<MealType | "All", string> = {
  All: "All",
  Breakfast: "Breakfast",
  Lunch: "Lunch",
  Dinner: "Dinner",
  Snack: "Snack",
  Fiesta: "Fiesta"
};
const difficultyLabels: Record<Difficulty | "All", string> = {
  All: "All",
  Easy: "Easy",
  Medium: "Medium",
  Advanced: "Advanced"
};

const recipeImagePaths: Partial<Record<string, string>> = {
  adobo: "/recipe-images/adobo.png",
  sinigang: "/recipe-images/sinigang.png",
  "kare-kare": "/recipe-images/kare-kare.png",
  lumpia: "/recipe-images/lumpia.png",
  "bicol-express": "/recipe-images/bicol-express.png",
  "tortang-talong": "/recipe-images/tortang-talong.png",
  tinola: "/recipe-images/chicken-tinola.png",
  "pancit-bihon": "/recipe-images/pancit-bihon.png",
  "beef-tapa": "/recipe-images/beef-tapa.png",
  tocino: "/recipe-images/pork-tocino.png",
  longganisa: "/recipe-images/garlic-longganisa.png",
  champorado: "/recipe-images/champorado.png",
  "arroz-caldo": "/recipe-images/arroz-caldo.png",
  goto: "/recipe-images/goto.png",
  "daing-na-bangus": "/recipe-images/daing-na-bangu.png",
  "ginisang-munggo": "/recipe-images/ginisang-mungo.png",
  laing: "/recipe-images/laing.png",
  pinakbet: "/recipe-images/pinakbet.png",
  inabraw: "/recipe-images/inabraw.png",
  "paksiw-na-bangus": "/recipe-images/paksiw-na-bangus.png",
  "paksiw-na-lechon": "/recipe-images/lech-paksiw.png",
  "pork-binagoongan": "/recipe-images/pork-binagoongan.png",
  menudo: "/recipe-images/pork-menudo.png",
  afritada: "/recipe-images/chicken-afritada.png",
  mechado: "/recipe-images/beef-mechado.png",
  caldereta: "/recipe-images/beef-caldereta.png",
  sisig: "/recipe-images/pork-sisig.png",
  dinuguan: "/recipe-images/dinuguan.png",
  "nilagang-baka": "/recipe-images/nilagang-baka.png",
  bulalo: "/recipe-images/bulalo.png",
  batchoy: "/recipe-images/la-paz-batchoy.png",
  "pancit-canton": "/recipe-images/pancit-canton.png",
  "pancit-malabon": "/recipe-images/pancit-malabon.png",
  palabok: "/recipe-images/pancit-palabok.png",
  "chicken-inasal": "/recipe-images/chicken-inasal.png",
  kinilaw: "/recipe-images/kinilaw-na-isda.png",
  "rellenong-bangus": "/recipe-images/rellenong-bangus.png",
  escabeche: "/recipe-images/fish-escabeche.png",
  "ginataang-tilapia": "/recipe-images/ginataang-tilapia.png",
  "adobong-pusit": "/recipe-images/adobong-pusit.png",
  "gising-gising": "/recipe-images/gising-gising.png",
  "ginisang-ampalaya": "/recipe-images/ginisang-ampalaya.png",
  chopsuey: "/recipe-images/chopsuey.png",
  "ensaladang-talong": "/recipe-images/ensaladang-talong.png",
  ukoy: "/recipe-images/ukoy.png",
  "okoy-kalabasa": "/recipe-images/okay-na-kalabasa.png",
  turon: "/recipe-images/turon.png",
  "banana-cue": "/recipe-images/bananaq-cue.png",
  puto: "/recipe-images/puto.png",
  kutsinta: "/recipe-images/kutsinta.png",
  bibingka: "/recipe-images/bibingka.png"
};

function RecipeThumb({ recipe }: { recipe: Recipe }) {
  const imageSrc = recipeImagePaths[recipe.id];

  return (
    <div
      className={`recipe-thumb${imageSrc ? " has-image" : ""}`}
      style={{
        background: `radial-gradient(circle at 28% 24%, ${recipe.colors.accent} 0 12%, transparent 13%),
          radial-gradient(circle at 62% 32%, rgba(255,255,255,.7) 0 10%, transparent 11%),
          radial-gradient(circle at 48% 58%, ${recipe.colors.base} 0 38%, #f5e0bd 39% 52%, transparent 53%),
          linear-gradient(135deg, ${recipe.colors.accent}, ${recipe.colors.base})`
      }}
      aria-hidden="true"
    >
      {imageSrc ? <img src={imageSrc} alt="" loading="lazy" /> : null}
    </div>
  );
}

function App() {
  const [pantry, setPantry] = useLocalStorage<string[]>("lutong-pantry-v1", [
    "chicken",
    "soy sauce",
    "vinegar",
    "garlic",
    "eggplant",
    "egg"
  ]);
  const [favorites, setFavorites] = useLocalStorage<string[]>("lutong-favorites-v1", ["adobo"]);
  const [shoppingList, setShoppingList] = useLocalStorage<string[]>("lutong-shopping-list-v1", []);
  const [ingredientEntry, setIngredientEntry] = useState("");
  const [query, setQuery] = useState("");
  const [mealType, setMealType] = useState<MealType | "All">("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [maxTime, setMaxTime] = useState(120);
  const [selectedId, setSelectedId] = useState("adobo");
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [randomPickName, setRandomPickName] = useState("");
  const [randomizingName, setRandomizingName] = useState("");
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("Magtanong tungkol sa pamalit, tipid na luto, o susunod na lulutuin.");
  const [assistantLoading, setAssistantLoading] = useState(false);

  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedId) ?? recipes[0];

  const rankedRecipes = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rankRecipes(recipes, pantry).filter(({ recipe }) => {
      const matchesSearch =
        !text ||
        recipe.name.toLowerCase().includes(text) ||
        recipe.region.toLowerCase().includes(text) ||
        recipe.ingredients.some((ingredient) => ingredient.includes(text));
      const matchesMeal = mealType === "All" || recipe.mealTypes.includes(mealType);
      const matchesDifficulty = difficulty === "All" || recipe.difficulty === difficulty;
      const totalTime = recipe.prepTime + recipe.cookTime;

      return matchesSearch && matchesMeal && matchesDifficulty && totalTime <= maxTime;
    });
  }, [difficulty, maxTime, mealType, pantry, query]);

  const selectedMatch = useMemo(
    () => rankRecipes([selectedRecipe], pantry)[0],
    [pantry, selectedRecipe]
  );
  const visibleRecipes = showAllMatches ? rankedRecipes : rankedRecipes.slice(0, 10);

  function addIngredients(items: string[]) {
    setPantry(uniqueIngredients([...pantry, ...items]));
  }

  function removeIngredient(item: string) {
    setPantry(pantry.filter((ingredient) => ingredient !== item));
  }

  function handleIngredientSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = parseIngredients(ingredientEntry);
    if (!parsed.length) return;
    addIngredients(parsed);
    setIngredientEntry("");
  }

  function toggleFavorite(id: string) {
    setFavorites(favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id]);
  }

  function addMissingToShoppingList(recipe = selectedRecipe) {
    const match = rankRecipes([recipe], pantry)[0];
    setShoppingList(uniqueIngredients([...shoppingList, ...match.missing]));
  }

  function pickRandomUlam() {
    if (isRandomizing) return;

    const ulamRecipes = recipes.filter((recipe) =>
      recipe.mealTypes.includes("Lunch") || recipe.mealTypes.includes("Dinner")
    );
    const nextRecipe = ulamRecipes[Math.floor(Math.random() * ulamRecipes.length)];

    if (!nextRecipe) return;
    let shuffleStep = 0;

    setIsRandomizing(true);
    setRandomPickName("");
    setQuery("");
    setMealType("All");
    setDifficulty("All");
    setMaxTime(120);
    setShowAllMatches(false);

    const shuffleTimer = window.setInterval(() => {
      const previewRecipe = ulamRecipes[Math.floor(Math.random() * ulamRecipes.length)];
      setRandomizingName(previewRecipe.name);
      shuffleStep += 1;

      if (shuffleStep >= 10) {
        window.clearInterval(shuffleTimer);
        setSelectedId(nextRecipe.id);
        setRandomPickName(nextRecipe.name);
        setRandomizingName("");
        setIsRandomizing(false);
      }
    }, 90);
  }

  async function askAssistant(event: FormEvent) {
    event.preventDefault();
    const message = assistantInput.trim();
    if (!message || assistantLoading) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);

    setAssistantLoading(true);
    setAssistantAnswer("Tinitingnan ang mga sangkap mo...");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message,
          pantry,
          selectedRecipe: selectedRecipe.name
        })
      });
      const data = (await response.json()) as { answer?: string; error?: string };
      setAssistantAnswer(data.answer ?? data.error ?? "Walang sagot mula sa assistant.");
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === "AbortError";
      setAssistantAnswer(
        isAbort
          ? "Matagal sumagot ang assistant. Subukan ulit mamaya."
          : "Run the optional Groq API server to enable the assistant. The recipe matcher still works without it."
      );
    } finally {
      window.clearTimeout(timeout);
      setAssistantLoading(false);
    }
  }

  function handleRecipeCardKey(event: KeyboardEvent<HTMLElement>, id: string) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setSelectedId(id);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <img src="/lutong-bahay-app.png" alt="" />
          </div>
          <div>
            <h1>Lutong Bahay Finder</h1>
            <p>Filipino recipes.</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="random-action" onClick={pickRandomUlam} disabled={isRandomizing}>
            <Shuffle size={16} />
            {isRandomizing ? "Randomizing..." : "Random Ulam"}
          </button>
          <div className="mini-stat">
            <Star size={16} />
            {favorites.length} paborito
          </div>
          <div className="mini-stat">
            <ListPlus size={16} />
            {shoppingList.length} bibilhin
          </div>
        </div>
      </header>

      <section className="workspace">
        <aside className="pantry-panel">
          <div className="section-heading">
            <h2>Sangkap</h2>
            <span>{pantry.length} item</span>
          </div>

          <form className="ingredient-form" onSubmit={handleIngredientSubmit}>
            <input
              value={ingredientEntry}
              onChange={(event) => setIngredientEntry(event.target.value)}
              aria-label="Magdagdag ng sangkap"
              placeholder="Magdagdag: pork, gabi, pechay"
            />
            <button type="submit">Idagdag</button>
          </form>

          <div className="chip-cloud selected">
            {pantry.map((ingredient) => (
              <button
                key={ingredient}
                className="chip removable"
                type="button"
                onClick={() => removeIngredient(ingredient)}
                aria-label={`Tanggalin ang ${ingredient}`}
              >
                {ingredient}
                <Trash2 size={13} />
              </button>
            ))}
          </div>

          <details className="subsection common-ingredients">
            <summary>Karaniwang Sangkap</summary>
            <div className="chip-cloud">
              {commonIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  className="chip"
                  type="button"
                  disabled={pantry.includes(ingredient)}
                  onClick={() => addIngredients([ingredient])}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </details>

          <div className="shopping-list">
            <div className="section-heading compact">
              <h2>Listahan ng Bibilhin</h2>
              <button type="button" onClick={() => setShoppingList([])}>Burahin</button>
            </div>
            {shoppingList.length ? (
              shoppingList.map((item) => <label key={item}><input type="checkbox" /> {item}</label>)
            ) : (
              <p>Idagdag ang kulang na sangkap mula sa recipe.</p>
            )}
          </div>
        </aside>

        <section className="matches-panel">
          <div className="filters">
            <label className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search recipes"
                placeholder="Search recipes, regions, ingredients"
              />
            </label>
            <select
              value={mealType}
              onChange={(event) => setMealType(event.target.value as MealType | "All")}
              aria-label="Meal type"
            >
              {mealTypes.map((type) => <option key={type} value={type}>{mealTypeLabels[type]}</option>)}
            </select>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty | "All")}
              aria-label="Difficulty"
            >
              {difficulties.map((level) => <option key={level} value={level}>{difficultyLabels[level]}</option>)}
            </select>
            <label className="time-filter">
              <Clock size={16} />
              <input
                type="range"
                min="20"
                max="120"
                step="10"
                value={maxTime}
                onChange={(event) => setMaxTime(Number(event.target.value))}
                aria-label="Maximum cooking time"
              />
              {maxTime}m
            </label>
          </div>

          <div className="section-heading matches-title">
            <h2>Mga Tugmang Recipe</h2>
            <span>Ipinapakita {visibleRecipes.length} sa {rankedRecipes.length}</span>
          </div>

          <div className="recipe-list">
            {visibleRecipes.map(({ recipe, matched, missing, score }) => (
              <article
                key={recipe.id}
                className={`recipe-card ${recipe.id === selectedRecipe.id ? "active" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={recipe.id === selectedRecipe.id}
                aria-label={`Tingnan ang ${recipe.name}`}
                onClick={() => setSelectedId(recipe.id)}
                onKeyDown={(event) => handleRecipeCardKey(event, recipe.id)}
              >
                <RecipeThumb recipe={recipe} />
                <div className="recipe-card-body">
                  <div className="card-row">
                    <div>
                      <h3>{recipe.name}</h3>
                      <p>{recipe.region} - {difficultyLabels[recipe.difficulty]} - {recipe.prepTime + recipe.cookTime} min</p>
                    </div>
                    <button
                      className={`icon-button ${favorites.includes(recipe.id) ? "saved" : ""}`}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(recipe.id);
                      }}
                      aria-label="I-toggle ang paborito"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                  <div className="match-meter">
                    <span style={{ width: `${score}%` }} aria-hidden="true" />
                  </div>
                  <div className="match-summary">
                    <strong>{score}% match</strong>
                    <span>{matched.length} ready</span>
                    <span>{missing.length} missing</span>
                  </div>
                  <p className="missing-line">Kulang: {missing.slice(0, 4).join(", ") || "wala"}</p>
                </div>
              </article>
            ))}
          </div>

          {rankedRecipes.length > 10 && (
            <button className="show-more" type="button" onClick={() => setShowAllMatches(!showAllMatches)}>
              {showAllMatches ? "Ipakita ang pinaka-tugma" : `Ipakita lahat ng ${rankedRecipes.length} recipe`}
            </button>
          )}
        </section>

        <aside className="detail-panel">
          <div className="detail-main">
            <div className="detail-hero">
              <RecipeThumb recipe={selectedRecipe} />
              <div>
                <p>{selectedRecipe.region}</p>
                <h2>{selectedRecipe.name}</h2>
                <span>{selectedRecipe.servings} serving - {selectedRecipe.prepTime}m prep - {selectedRecipe.cookTime}m luto</span>
              </div>
            </div>

            <p className="description">{selectedRecipe.description}</p>
            {isRandomizing && (
              <p className="random-note randomizing" aria-live="polite">
                Choosing ulam: {randomizingName || "mixing dishes..."}
              </p>
            )}
            {randomPickName === selectedRecipe.name && (
              <p className="random-note">Random ulam pick: {selectedRecipe.name}</p>
            )}

            <div className="action-row">
              <button className="primary-action" type="button" onClick={() => addMissingToShoppingList()}>
                <ListPlus size={17} />
                Add to shopping list
              </button>
              <button className="secondary-action" type="button" onClick={() => toggleFavorite(selectedRecipe.id)}>
                <Heart size={17} fill={favorites.includes(selectedRecipe.id) ? "currentColor" : "none"} />
                Paborito
              </button>
            </div>

            <div className="info-grid">
              <div><strong>{selectedMatch.score}%</strong><span>Pantry match</span></div>
              <div><strong>{selectedRecipe.nutrition.calories}</strong><span>cal est.</span></div>
              <div><strong>{selectedRecipe.nutrition.protein}g</strong><span>protein</span></div>
            </div>

            <details className="assistant-box">
              <summary>Kumare</summary>
              <p>{assistantAnswer}</p>
              <form onSubmit={askAssistant}>
                <input
                  value={assistantInput}
                  onChange={(event) => setAssistantInput(event.target.value)}
                  aria-label="Tanong para sa AI assistant"
                  placeholder="Tanong: gawing walang pork?"
                />
                <button disabled={assistantLoading}>{assistantLoading ? "..." : "Tanong"}</button>
              </form>
            </details>
          </div>

          <div className="detail-sidebar">
            <section className="detail-section">
              <h3>Mga Sangkap</h3>
              <div className="ingredient-columns">
                {selectedRecipe.ingredients.map((ingredient) => (
                  <span key={ingredient} className={pantry.includes(ingredient) ? "have" : "need"}>
                    {ingredient}
                  </span>
                ))}
              </div>
            </section>

            <details className="detail-section expandable">
              <summary>Paraan ng Pagluluto</summary>
              <ol className="steps">
                {selectedRecipe.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </details>

            <details className="detail-section expandable">
              <summary>Mga Pamalit</summary>
              <div className="substitutes">
                {selectedRecipe.substitutes.map((item) => (
                  <p key={item.from}><strong>{item.from}</strong> -&gt; {item.to}</p>
                ))}
              </div>
            </details>
          </div>
        </aside>
      </section>

      <footer className="footer-note">
        <BookOpen size={16} />
        Lokal ang recipe data para sa bersyong walang account. Ang sangkap, paborito, at listahan ng bibilhin ay naka-save lang sa browser na ito.
      </footer>
    </main>
  );
}

export default App;
