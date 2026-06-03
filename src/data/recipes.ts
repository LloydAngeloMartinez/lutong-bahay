export type Difficulty = "Easy" | "Medium" | "Advanced";
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Fiesta";

export type Recipe = {
  id: string;
  name: string;
  region: string;
  description: string;
  mealTypes: MealType[];
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  pantryStaples: string[];
  steps: string[];
  substitutes: { from: string; to: string }[];
  nutrition: {
    calories: number;
    protein: number;
  };
  colors: {
    base: string;
    accent: string;
  };
};

export const commonIngredients = [
  "pork",
  "chicken",
  "fish",
  "shrimp",
  "tofu",
  "egg",
  "rice",
  "garlic",
  "onion",
  "ginger",
  "tomato",
  "soy sauce",
  "vinegar",
  "coconut milk",
  "calamansi",
  "kangkong",
  "pechay",
  "sitaw",
  "eggplant",
  "gabi",
  "sayote",
  "bagoong",
  "peanut butter",
  "siling haba",
  "green papaya"
];

type RecipeSeed = Omit<Recipe, "pantryStaples" | "steps" | "substitutes" | "nutrition" | "colors"> & {
  pantryStaples?: string[];
  steps?: string[];
  substitutes?: { from: string; to: string }[];
  nutrition?: Recipe["nutrition"];
  colors?: Recipe["colors"];
};

const palette = [
  { base: "#8f4f25", accent: "#f0ba4f" },
  { base: "#4f8d54", accent: "#d94b37" },
  { base: "#c8892b", accent: "#5b7f45" },
  { base: "#d89536", accent: "#b73928" },
  { base: "#e05235", accent: "#f4cf74" },
  { base: "#6f5a93", accent: "#f2c84b" },
  { base: "#7cad6f", accent: "#e8b548" },
  { base: "#d2a243", accent: "#6d9a4a" }
];

function makeRecipe(seed: RecipeSeed, index: number): Recipe {
  const mainIngredient = seed.ingredients[0] ?? "main ingredient";
  const seasoning = seed.ingredients.includes("soy sauce")
    ? "soy sauce"
    : seed.ingredients.includes("fish sauce")
      ? "fish sauce"
      : "salt";

  return {
    ...seed,
    pantryStaples: seed.pantryStaples ?? ["oil", "salt", "black pepper"],
    steps: seed.steps ?? [
      `Ihanda ang ${mainIngredient} at hiwain nang pantay ang mga gulay.`,
      "Igisa ang bawang at sibuyas hanggang bumango.",
      `Ilagay ang pangunahing sangkap, timplahan ng ${seasoning}, at lutuin hanggang lumambot.`,
      "Timplahan ayon sa panlasa at ihain habang mainit kasama ng kanin."
    ],
    substitutes: seed.substitutes ?? [
      { from: mainIngredient, to: "chicken, tofu, mushroom, o ibang available na protina" },
      { from: seasoning, to: "fish sauce, soy sauce, o asin ayon sa panlasa" }
    ],
    nutrition: seed.nutrition ?? {
      calories: 260 + ((index * 17) % 260),
      protein: 10 + ((index * 5) % 28)
    },
    colors: seed.colors ?? palette[index % palette.length]
  };
}

const additionalRecipeSeeds: RecipeSeed[] = [
  {
    id: "beef-tapa",
    name: "Beef Tapa",
    region: "Tagalog",
    description: "Matamis-alat na beef tapa na karaniwang inihahain kasama ng sinangag at itlog.",
    mealTypes: ["Breakfast"],
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 15,
    servings: 3,
    ingredients: ["beef", "soy sauce", "calamansi", "garlic", "sugar"]
  },
  {
    id: "tocino",
    name: "Pork Tocino",
    region: "Kapampangan",
    description: "Matamis na cured pork para sa klasikong almusal na Pinoy.",
    mealTypes: ["Breakfast"],
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    ingredients: ["pork", "sugar", "garlic", "soy sauce", "pineapple juice"]
  },
  {
    id: "longganisa",
    name: "Garlic Longganisa",
    region: "Ilocos",
    description: "Malasang longganisang maraming bawang para sa mga silog meal.",
    mealTypes: ["Breakfast"],
    difficulty: "Medium",
    prepTime: 25,
    cookTime: 20,
    servings: 4,
    ingredients: ["ground pork", "garlic", "vinegar", "paprika", "sugar"]
  },
  {
    id: "champorado",
    name: "Champorado",
    region: "Tagalog",
    description: "Malapot na tsokolateng lugaw na madalas ipares sa tuyo.",
    mealTypes: ["Breakfast", "Snack"],
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    ingredients: ["glutinous rice", "cocoa", "sugar", "milk"]
  },
  {
    id: "arroz-caldo",
    name: "Arroz Caldo",
    region: "Tagalog",
    description: "Lugaw na may chicken at luya, tinatapos sa calamansi at pritong bawang.",
    mealTypes: ["Breakfast", "Snack"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 40,
    servings: 5,
    ingredients: ["chicken", "rice", "ginger", "garlic", "onion", "fish sauce", "calamansi"]
  },
  {
    id: "goto",
    name: "Goto",
    region: "Tagalog",
    description: "Malinamnam na lugaw na may goto, luya, at toasted garlic.",
    mealTypes: ["Breakfast", "Snack"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 60,
    servings: 5,
    ingredients: ["beef tripe", "rice", "ginger", "garlic", "onion", "fish sauce"]
  },
  {
    id: "daing-na-bangus",
    name: "Daing na Bangus",
    region: "Pangasinan",
    description: "Bangus na ibinabad sa suka, bawang, at paminta, saka pinirito.",
    mealTypes: ["Breakfast", "Lunch"],
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 15,
    servings: 3,
    ingredients: ["bangus", "vinegar", "garlic", "peppercorn"]
  },
  {
    id: "ginisang-munggo",
    name: "Ginisang Munggo",
    region: "Tagalog",
    description: "Nilagang munggo na may pork, shrimp, kamatis, at dahong gulay.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 45,
    servings: 5,
    ingredients: ["mung beans", "pork", "shrimp", "tomato", "garlic", "onion", "malunggay"]
  },
  {
    id: "laing",
    name: "Laing",
    region: "Bicol",
    description: "Tuyong dahon ng gabi na niluto sa gata, sili, at bagoong.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 55,
    servings: 5,
    ingredients: ["taro leaves", "coconut milk", "bagoong", "garlic", "onion", "ginger", "chili"]
  },
  {
    id: "pinakbet",
    name: "Pinakbet",
    region: "Ilocos",
    description: "Halo-halong gulay na niluto sa bagoong at kaunting pork.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 35,
    servings: 5,
    ingredients: ["pork", "bagoong", "eggplant", "sitaw", "okra", "ampalaya", "kalabasa", "tomato"]
  },
  {
    id: "inabraw",
    name: "Inabraw",
    region: "Ilocos",
    description: "Magaan na sabaw-gulay na tinimplahan ng bagoong at inihaw na isda.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: ["fish", "bagoong", "saluyot", "sitaw", "kalabasa", "eggplant", "tomato"]
  },
  {
    id: "paksiw-na-bangus",
    name: "Paksiw na Bangus",
    region: "Tagalog",
    description: "Bangus na pinakuluan sa suka kasama ng luya, ampalaya, at talong.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 12,
    cookTime: 25,
    servings: 4,
    ingredients: ["bangus", "vinegar", "ginger", "garlic", "ampalaya", "eggplant"]
  },
  {
    id: "paksiw-na-lechon",
    name: "Lechon Paksiw",
    region: "Visayas",
    description: "Tirang lechon na pinakuluan sa suka, liver sauce, at pampabango.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 35,
    servings: 5,
    ingredients: ["lechon", "vinegar", "liver sauce", "garlic", "onion", "bay leaf"]
  },
  {
    id: "pork-binagoongan",
    name: "Pork Binagoongan",
    region: "Tagalog",
    description: "Pork belly na niluto sa bagoong, kamatis, at sili.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    ingredients: ["pork", "bagoong", "tomato", "garlic", "onion", "chili"]
  },
  {
    id: "menudo",
    name: "Pork Menudo",
    region: "Tagalog",
    description: "Pork stew na may tomato sauce, atay, patatas, carrots, at pasas.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Medium",
    prepTime: 25,
    cookTime: 50,
    servings: 6,
    ingredients: ["pork", "pork liver", "tomato sauce", "potato", "carrot", "bell pepper", "raisins"]
  },
  {
    id: "afritada",
    name: "Chicken Afritada",
    region: "Tagalog",
    description: "Chicken stew na may tomato sauce, patatas, carrots, at bell pepper.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 40,
    servings: 5,
    ingredients: ["chicken", "tomato sauce", "potato", "carrot", "bell pepper", "garlic", "onion"]
  },
  {
    id: "mechado",
    name: "Beef Mechado",
    region: "Tagalog",
    description: "Beef stew na may tomato sauce, toyo, calamansi, at patatas.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 25,
    cookTime: 90,
    servings: 6,
    ingredients: ["beef", "tomato sauce", "soy sauce", "calamansi", "potato", "carrot", "bay leaf"]
  },
  {
    id: "caldereta",
    name: "Beef Caldereta",
    region: "Tagalog",
    description: "Malinamnam na beef stew na may tomato sauce, liver spread, cheese, at gulay.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 25,
    cookTime: 95,
    servings: 6,
    ingredients: ["beef", "tomato sauce", "liver spread", "cheese", "potato", "carrot", "bell pepper"]
  },
  {
    id: "sisig",
    name: "Pork Sisig",
    region: "Kapampangan",
    description: "Sizzling na tinadtad na pork na may calamansi, sibuyas, sili, at itlog.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 30,
    cookTime: 50,
    servings: 4,
    ingredients: ["pork", "onion", "calamansi", "chili", "egg", "mayonnaise"]
  },
  {
    id: "dinuguan",
    name: "Dinuguan",
    region: "Tagalog",
    description: "Malinamnam na pork blood stew na may suka, bawang, at sili.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Advanced",
    prepTime: 20,
    cookTime: 45,
    servings: 5,
    ingredients: ["pork", "pork blood", "vinegar", "garlic", "onion", "chili"]
  },
  {
    id: "nilagang-baka",
    name: "Nilagang Baka",
    region: "Tagalog",
    description: "Simpleng sabaw ng beef na may repolyo, patatas, mais, at pechay.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 90,
    servings: 6,
    ingredients: ["beef", "potato", "cabbage", "corn", "pechay", "onion"]
  },
  {
    id: "bulalo",
    name: "Bulalo",
    region: "Batangas",
    description: "Sabaw ng beef shank at bone marrow na may mais, repolyo, at pechay.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 20,
    cookTime: 120,
    servings: 6,
    ingredients: ["beef shank", "corn", "cabbage", "pechay", "onion", "fish sauce"]
  },
  {
    id: "batchoy",
    name: "La Paz Batchoy",
    region: "Iloilo",
    description: "Noodle soup na may pork, atay, chicharon, at malinamnam na sabaw.",
    mealTypes: ["Lunch", "Dinner", "Snack"],
    difficulty: "Advanced",
    prepTime: 25,
    cookTime: 60,
    servings: 4,
    ingredients: ["miki noodles", "pork", "pork liver", "chicharon", "garlic", "spring onion"]
  },
  {
    id: "pancit-canton",
    name: "Pancit Canton",
    region: "Filipino-Chinese",
    description: "Ginisa na egg noodles na may gulay, chicken, at shrimp.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 5,
    ingredients: ["canton noodles", "chicken", "shrimp", "carrot", "cabbage", "soy sauce", "calamansi"]
  },
  {
    id: "pancit-malabon",
    name: "Pancit Malabon",
    region: "Malabon",
    description: "Makapal na rice noodles sa seafood sauce na may shrimp, itlog, at chicharon.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 30,
    cookTime: 35,
    servings: 6,
    ingredients: ["thick rice noodles", "shrimp", "smoked fish", "egg", "chicharon", "annatto"]
  },
  {
    id: "palabok",
    name: "Pancit Palabok",
    region: "Tagalog",
    description: "Rice noodles na may shrimp gravy, itlog, chicharon, at calamansi.",
    mealTypes: ["Lunch", "Snack", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 30,
    cookTime: 35,
    servings: 6,
    ingredients: ["rice noodles", "shrimp", "annatto", "egg", "chicharon", "calamansi"]
  },
  {
    id: "chicken-inasal",
    name: "Chicken Inasal",
    region: "Bacolod",
    description: "Inihaw na chicken na ibinabad sa calamansi, suka, bawang, at annatto oil.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 25,
    cookTime: 35,
    servings: 4,
    ingredients: ["chicken", "calamansi", "vinegar", "garlic", "annatto", "lemongrass"]
  },
  {
    id: "kinilaw",
    name: "Kinilaw na Isda",
    region: "Visayas",
    description: "Sariwang isda na binabad sa suka kasama ng luya, sibuyas, sili, at calamansi.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 25,
    cookTime: 0,
    servings: 4,
    ingredients: ["fish", "vinegar", "calamansi", "ginger", "onion", "chili"]
  },
  {
    id: "rellenong-bangus",
    name: "Rellenong Bangus",
    region: "Tagalog",
    description: "Bangus na pinalamanan ng gulay, pasas, at itlog.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 45,
    cookTime: 35,
    servings: 4,
    ingredients: ["bangus", "carrot", "peas", "raisins", "egg", "garlic", "onion"]
  },
  {
    id: "escabeche",
    name: "Fish Escabeche",
    region: "Tagalog",
    description: "Pritong isda na may matamis-asim na luya, carrots, at bell pepper.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    ingredients: ["fish", "vinegar", "sugar", "ginger", "carrot", "bell pepper", "onion"]
  },
  {
    id: "ginataang-tilapia",
    name: "Ginataang Tilapia",
    region: "Bicol",
    description: "Tilapia na niluto sa gata kasama ng pechay, luya, at sili.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: ["tilapia", "coconut milk", "pechay", "ginger", "garlic", "onion", "siling haba"]
  },
  {
    id: "adobong-pusit",
    name: "Adobong Pusit",
    region: "Tagalog",
    description: "Pusit adobo na niluto sa suka, toyo, bawang, at tinta ng pusit.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    ingredients: ["squid", "vinegar", "soy sauce", "garlic", "onion", "squid ink"]
  },
  {
    id: "gising-gising",
    name: "Gising-Gising",
    region: "Nueva Ecija",
    description: "Maanghang na chopped beans sa gata na may pork at bagoong.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: ["winged beans", "pork", "coconut milk", "bagoong", "garlic", "onion", "chili"]
  },
  {
    id: "ginisang-ampalaya",
    name: "Ginisang Ampalaya",
    region: "Tagalog",
    description: "Ampalaya na ginisa kasama ng itlog, kamatis, bawang, at sibuyas.",
    mealTypes: ["Breakfast", "Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    ingredients: ["ampalaya", "egg", "tomato", "garlic", "onion"]
  },
  {
    id: "chopsuey",
    name: "Chopsuey",
    region: "Filipino-Chinese",
    description: "Ginisang halo-halong gulay na may shrimp, chicken, at magaang sarsa.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 20,
    cookTime: 20,
    servings: 5,
    ingredients: ["chicken", "shrimp", "cauliflower", "carrot", "cabbage", "bell pepper", "soy sauce"]
  },
  {
    id: "ensaladang-talong",
    name: "Ensaladang Talong",
    region: "Tagalog",
    description: "Salad na inihaw na talong na may kamatis, sibuyas, suka, at bagoong.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 10,
    servings: 3,
    ingredients: ["eggplant", "tomato", "onion", "vinegar", "bagoong"]
  },
  {
    id: "ukoy",
    name: "Ukoy",
    region: "Laguna",
    description: "Malutong na shrimp at gulay fritters na inihahain kasama ng sukang may sili.",
    mealTypes: ["Snack"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 20,
    servings: 4,
    ingredients: ["shrimp", "sweet potato", "bean sprouts", "flour", "egg", "vinegar"]
  },
  {
    id: "okoy-kalabasa",
    name: "Okoy na Kalabasa",
    region: "Tagalog",
    description: "Kalabasa fritters na may shrimp at malutong na gilid.",
    mealTypes: ["Snack"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 18,
    servings: 4,
    ingredients: ["kalabasa", "shrimp", "flour", "egg", "garlic", "vinegar"]
  },
  {
    id: "turon",
    name: "Turon",
    region: "Tagalog",
    description: "Banana spring rolls na may langka at caramelized na asukal.",
    mealTypes: ["Snack"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 15,
    servings: 6,
    ingredients: ["banana", "jackfruit", "lumpia wrapper", "sugar"]
  },
  {
    id: "banana-cue",
    name: "Banana Cue",
    region: "Tagalog",
    description: "Pritong saba na binalot sa caramelized na brown sugar.",
    mealTypes: ["Snack"],
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    ingredients: ["banana", "brown sugar", "oil"]
  },
  {
    id: "puto",
    name: "Puto",
    region: "Tagalog",
    description: "Pinasingawang puto na malambot at puwedeng lagyan ng cheese.",
    mealTypes: ["Snack", "Fiesta"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 20,
    servings: 8,
    ingredients: ["rice flour", "sugar", "milk", "baking powder", "cheese"]
  },
  {
    id: "kutsinta",
    name: "Kutsinta",
    region: "Tagalog",
    description: "Malagkit na steamed rice cakes na inihahain kasama ng niyog.",
    mealTypes: ["Snack"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 30,
    servings: 8,
    ingredients: ["rice flour", "brown sugar", "annatto", "lye water", "grated coconut"]
  },
  {
    id: "bibingka",
    name: "Bibingka",
    region: "Tagalog",
    description: "Rice cake na niluto kasama ng gata, salted egg, at cheese.",
    mealTypes: ["Breakfast", "Snack", "Fiesta"],
    difficulty: "Medium",
    prepTime: 25,
    cookTime: 30,
    servings: 6,
    ingredients: ["rice flour", "coconut milk", "egg", "salted egg", "cheese", "sugar"]
  }
];

export const recipes: Recipe[] = [
  {
    id: "adobo",
    name: "Chicken Pork Adobo",
    region: "Tagalog",
    description: "Adobong pang-araw-araw na may toyo, suka, bawang, paminta, at dahon ng laurel.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    ingredients: ["chicken", "pork", "soy sauce", "vinegar", "garlic", "bay leaf", "peppercorn", "water"],
    pantryStaples: ["oil", "salt", "black pepper"],
    steps: [
      "Ibabad ang chicken at pork sa toyo, suka, bawang, dahon ng laurel, at paminta.",
      "Igisa o i-brown ang karne sa kaunting mantika, saka ibuhos ang marinade at tubig.",
      "Pakuluan sa mahinang apoy hanggang lumambot at kumintab ang sarsa.",
      "Ihain kasama ng mainit na kanin at dagdagan ng sarsa sa ibabaw."
    ],
    substitutes: [
      { from: "pork", to: "dagdag na chicken o tofu" },
      { from: "bay leaf", to: "kaunting tuyong oregano" }
    ],
    nutrition: { calories: 430, protein: 35 },
    colors: { base: "#8f4f25", accent: "#f0ba4f" }
  },
  {
    id: "sinigang",
    name: "Pork Sinigang",
    region: "Tagalog",
    description: "Maasim na sabaw ng pork na may sampalok, gabi, kangkong, sitaw, at siling haba.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 60,
    servings: 5,
    ingredients: ["pork", "tamarind", "tomato", "onion", "gabi", "kangkong", "sitaw", "radish", "siling haba"],
    pantryStaples: ["fish sauce", "water"],
    steps: [
      "Pakuluan ang pork kasama ang sibuyas at kamatis hanggang magsimulang lumambot.",
      "Ilagay ang gabi at ipagpatuloy ang pagpapakulo hanggang bahagyang lumapot ang sabaw.",
      "Timplahan ng sampalok at patis.",
      "Ilagay ang sitaw, labanos, kangkong, at siling haba sa huling bahagi ng pagluluto."
    ],
    substitutes: [
      { from: "tamarind", to: "sinigang mix o kaunting calamansi" },
      { from: "kangkong", to: "pechay o spinach" }
    ],
    nutrition: { calories: 390, protein: 28 },
    colors: { base: "#4f8d54", accent: "#d94b37" }
  },
  {
    id: "kare-kare",
    name: "Kare-Kare",
    region: "Kapampangan",
    description: "Malapot na peanut stew na may karne, gulay, at bagoong sa tabi.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Advanced",
    prepTime: 25,
    cookTime: 90,
    servings: 6,
    ingredients: ["beef", "peanut butter", "eggplant", "sitaw", "pechay", "annatto", "garlic", "onion", "bagoong"],
    pantryStaples: ["oil", "water", "salt"],
    steps: [
      "Pakuluan ang beef hanggang lumambot at itabi ang sabaw.",
      "Igisa ang bawang at sibuyas, saka ilagay ang annatto at peanut butter.",
      "Ibalik ang beef at sabaw, saka pakuluan hanggang lumapot ang sarsa.",
      "Pakuluan nang bahagya ang gulay at ihain kasama ng bagoong."
    ],
    substitutes: [
      { from: "beef", to: "pork hock, tripe, o mushroom" },
      { from: "annatto", to: "paprika para sa kulay" }
    ],
    nutrition: { calories: 520, protein: 31 },
    colors: { base: "#c8892b", accent: "#5b7f45" }
  },
  {
    id: "lumpia",
    name: "Lumpiang Shanghai",
    region: "Filipino-Chinese",
    description: "Malutong na lumpia para sa handaan na may pork, carrots, sibuyas, at bawang.",
    mealTypes: ["Snack", "Fiesta"],
    difficulty: "Medium",
    prepTime: 35,
    cookTime: 20,
    servings: 8,
    ingredients: ["ground pork", "carrot", "onion", "garlic", "egg", "lumpia wrapper"],
    pantryStaples: ["oil", "salt", "black pepper"],
    steps: [
      "Paghaluin ang ground pork, carrot, sibuyas, bawang, itlog, asin, at paminta.",
      "Balutin nang mahigpit ang kaunting palaman sa lumpia wrapper.",
      "Iprito nang batch hanggang malutong at golden brown.",
      "Patuluin ang mantika at ihain kasama ng banana ketchup o sweet chili sauce."
    ],
    substitutes: [
      { from: "ground pork", to: "ground chicken o dinurog na tofu" },
      { from: "lumpia wrapper", to: "spring roll wrapper" }
    ],
    nutrition: { calories: 280, protein: 16 },
    colors: { base: "#d89536", accent: "#b73928" }
  },
  {
    id: "bicol-express",
    name: "Bicol Express",
    region: "Bicol",
    description: "Maanghang na pork na niluto sa gata, bagoong, at sili.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    ingredients: ["pork", "coconut milk", "bagoong", "garlic", "onion", "ginger", "siling haba", "chili"],
    pantryStaples: ["oil", "salt"],
    steps: [
      "Igisa ang bawang, sibuyas, at luya hanggang bumango.",
      "Ilagay ang pork at lutuin hanggang bahagyang mag-brown.",
      "Ibuhos ang gata at pakuluan hanggang lumambot ang pork.",
      "Ihalo ang bagoong at sili, saka pakuluan hanggang maging creamy."
    ],
    substitutes: [
      { from: "pork", to: "chicken, tofu, o mushroom" },
      { from: "coconut milk", to: "coconut cream na hinaluan ng tubig" }
    ],
    nutrition: { calories: 510, protein: 25 },
    colors: { base: "#e05235", accent: "#f4cf74" }
  },
  {
    id: "tortang-talong",
    name: "Tortang Talong",
    region: "Tagalog",
    description: "Inihaw na talong na ginawang omelet, mabilis para sa almusal o tanghalian.",
    mealTypes: ["Breakfast", "Lunch"],
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    ingredients: ["eggplant", "egg", "garlic", "onion"],
    pantryStaples: ["oil", "salt", "black pepper"],
    steps: [
      "Ihawin ang talong hanggang lumambot, saka balatan habang nakadikit pa ang tangkay.",
      "Patagin ang talong gamit ang tinidor.",
      "Isawsaw sa binating itlog na may asin at paminta.",
      "Iprito sa kawali hanggang maluto at maging golden ang magkabilang panig."
    ],
    substitutes: [
      { from: "egg", to: "chickpea batter kung walang itlog" },
      { from: "onion", to: "spring onion" }
    ],
    nutrition: { calories: 210, protein: 11 },
    colors: { base: "#6f5a93", accent: "#f2c84b" }
  },
  {
    id: "tinola",
    name: "Chicken Tinola",
    region: "Tagalog",
    description: "Sabaw na manok na may luya, green papaya, dahon ng sili, at patis.",
    mealTypes: ["Lunch", "Dinner"],
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    ingredients: ["chicken", "ginger", "garlic", "onion", "green papaya", "chili leaves", "fish sauce"],
    pantryStaples: ["oil", "water"],
    steps: [
      "Igisa ang luya, bawang, at sibuyas hanggang bumango.",
      "Ilagay ang chicken at lutuin hanggang pumuti ang ibabaw.",
      "Ibuhos ang tubig at pakuluan hanggang maluto ang chicken.",
      "Ilagay ang green papaya at dahon ng sili, saka timplahan ng patis."
    ],
    substitutes: [
      { from: "green papaya", to: "sayote" },
      { from: "chili leaves", to: "malunggay o spinach" }
    ],
    nutrition: { calories: 310, protein: 30 },
    colors: { base: "#7cad6f", accent: "#e8b548" }
  },
  {
    id: "pancit-bihon",
    name: "Pancit Bihon",
    region: "Filipino-Chinese",
    description: "Bihon na ginisa kasama ng chicken, gulay, toyo, at calamansi.",
    mealTypes: ["Lunch", "Dinner", "Fiesta"],
    difficulty: "Medium",
    prepTime: 20,
    cookTime: 25,
    servings: 5,
    ingredients: ["bihon noodles", "chicken", "carrot", "cabbage", "garlic", "onion", "soy sauce", "calamansi"],
    pantryStaples: ["oil", "water", "black pepper"],
    steps: [
      "Ibabad ang bihon hanggang lumambot, saka patuluin.",
      "Igisa ang bawang, sibuyas, chicken, carrot, at repolyo.",
      "Maglagay ng toyo at kaunting tubig o sabaw.",
      "Ihalo ang bihon hanggang masipsip ang sarsa at tapusin gamit ang calamansi."
    ],
    substitutes: [
      { from: "bihon noodles", to: "canton noodles o sotanghon" },
      { from: "chicken", to: "shrimp, pork, o tofu" }
    ],
    nutrition: { calories: 360, protein: 22 },
    colors: { base: "#d2a243", accent: "#6d9a4a" }
  },
  ...additionalRecipeSeeds.map((recipe, index) => makeRecipe(recipe, index))
];
