/**
 * REAL MENU — transcribed from `public/brand/Wrap shack menu.pdf` (July 2026).
 * Descriptions lightly edited into the site voice; items and prices are verbatim.
 * TODO(owner): confirm prices on next menu revision.
 */

export type Dietary = "vegan" | "vegetarian" | "gluten-free" | "contains-nuts";

export type CategoryId =
  | "wraps"
  | "bowls"
  | "plates"
  | "grill"
  | "bakery"
  | "mezza"
  | "salads"
  | "sides"
  | "sweets"
  | "drinks";

export interface MenuCategory {
  id: CategoryId;
  label: string;
  /** Small print shown under the category heading. */
  note?: string;
}

export interface MenuItem {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  /** Dollars. `null` = ask in store (e.g. assorted drinks). */
  price: number | null;
  /** Qualifier printed before the price, e.g. "3 for". */
  priceNote?: string;
  /** Paid add-on offer for THIS item, rendered as a highlighted chip on the card. */
  addOn?: string;
  image?: string;
  dietary: Dietary[];
  featured?: boolean;
}

export const categories: MenuCategory[] = [
  { id: "wraps", label: "Wraps", note: "Add extra protein to any wrap · $4.99" },
  { id: "bowls", label: "Bowls", note: "Add extra protein to any bowl · $4.99" },
  { id: "plates", label: "Plates", note: "Add extra protein to any plate · $4.99" },
  { id: "grill", label: "From the Grill" },
  { id: "bakery", label: "Bakery & Flatbread", note: "Add toppings $1.50 each — sliced tomato, onion, olives, or cucumber" },
  { id: "mezza", label: "Dips & Mezza", note: "Every dip arrives with warm pita" },
  { id: "salads", label: "Salads", note: "Add chicken shawarma or gyro · $6.99" },
  { id: "sides", label: "Sides & Extras" },
  { id: "sweets", label: "Sweets" },
  { id: "drinks", label: "Drinks" },
];

export const menu: MenuItem[] = [
  // ——— WRAPS ———
  {
    id: "chicken-shawarma-wrap",
    category: "wraps",
    name: "Chicken Shawarma Wrap",
    description:
      "Vertically roasted chicken, thinly sliced, tucked in with fries and pickles, finished with our garlic dip, then double-grilled until the edges char.",
    price: 13.99,
    image: "/images/menu/chicken-shawarma-wrap.webp",
    dietary: [],
    featured: true,
  },
  {
    id: "beef-shawarma-wrap",
    category: "wraps",
    name: "Beef Shawarma Wrap",
    description:
      "Spice-blend beef shaved thin, with sautéed tomatoes, pickles, parsley, onion, and sumac. Tahini sauce, thin pita, no shortcuts.",
    price: 14.99,
    image: "/images/menu/beef-shawarma-wrap.webp",
    dietary: [],
  },
  {
    id: "gyro-wrap",
    category: "wraps",
    name: "Gyro Wrap",
    description:
      "Beef and lamb slow-roasted on the spit, sliced to order with mixed greens, fresh tomato, and onion under a spoonful of tzatziki.",
    price: 13.99,
    dietary: [],
    image: "/images/menu/gyro-wrap.webp",
  },
  {
    id: "kefta-kebab-wrap",
    category: "wraps",
    name: "Kefta Kebab Wrap",
    description:
      "Ground beef worked with onion and parsley, grilled on the skewer, then wrapped with greens, tomato, pickles, onion, and tahini.",
    price: 13.99,
    dietary: [],
    image: "/images/menu/kefta-wrap.webp",
    featured: true,
  },
  {
    id: "falafel-wrap",
    category: "wraps",
    name: "Falafel Wrap",
    description:
      "Chickpeas and fava beans ground with herbs and sesame, fried crisp, with greens, tomato, pickled turnips, and tahini in thin pita.",
    price: 12.99,
    dietary: ["vegan", "vegetarian"],
    image: "/images/menu/falafel-wrap.webp",
    featured: true,
  },

  // ——— BOWLS ———
  {
    id: "chicken-shawarma-bowl",
    category: "bowls",
    name: "Chicken Shawarma Bowl",
    description:
      "Chopped chicken shawarma over rice and dressed greens with hummus, chickpeas, black beans, kidney beans, red cabbage, carrots, olives, cucumber, tomato, pickles, and creamy garlic sauce.",
    price: 16.99,
    dietary: ["gluten-free"],
    image: "/images/menu/chicken-shawarma-bowl.webp",
    featured: true,
  },
  {
    id: "beef-shawarma-bowl",
    category: "bowls",
    name: "Beef Shawarma Bowl",
    description:
      "Chopped beef shawarma on rice and pomegranate-dressed greens with hummus, three beans, red cabbage, carrots, olives, tomato, pickles, and tahini.",
    price: 17.99,
    dietary: ["gluten-free"],
    image: "/images/menu/beef-shawarma-bowl.webp",
  },
  {
    id: "gyro-bowl",
    category: "bowls",
    name: "Gyro Bowl",
    description:
      "Chopped gyro over rice and greens with hummus, chickpeas, beans, red cabbage, carrots, cucumber, tomato, and feta, drizzled with tzatziki.",
    price: 16.99,
    dietary: [],
    image: "/images/menu/gyro-bowl.webp",
  },
  {
    id: "vegetarian-bowl",
    category: "bowls",
    name: "Vegetarian Bowl",
    description:
      "Falafel over rice and pomegranate-dressed greens with hummus, chickpeas, beans, red cabbage, carrots, onion, cucumber, olives, pickled turnips, and tomato. Vegan tahini to finish.",
    price: 15.99,
    dietary: ["vegan", "vegetarian", "gluten-free"],
    image: "/images/menu/vegetarian-bowl.webp",
  },

  // ——— PLATES ———
  {
    id: "chicken-shawarma-plate",
    category: "plates",
    name: "Chicken Shawarma Plate",
    description:
      "Grilled chicken shawarma over rice with hummus, house salad, and warm pita.",
    price: 19.99,
    dietary: [],
    image: "/images/menu/chicken-shawarma-plate-v2.webp",
    featured: true,
  },
  {
    id: "beef-gyro-plate",
    category: "plates",
    name: "Beef Gyro Plate",
    description:
      "Char-grilled beef gyro over rice with hummus, house salad, and warm pita.",
    price: 19.99,
    dietary: [],
    image: "/images/menu/beef-gyro-plate.webp",
    featured: true,
  },
  {
    id: "beef-shawarma-plate",
    category: "plates",
    name: "Beef Shawarma Plate",
    description:
      "Thin-shaved beef shawarma over rice with hummus, house salad, and warm pita.",
    price: 20.99,
    dietary: [],
  },
  {
    id: "kebab-plate",
    category: "plates",
    name: "Kebab Plate",
    description:
      "Two skewers — chicken tawook, beef kefta, or beef tenderloin — over rice with hummus, house salad, and pita.",
    addOn: "Extra skewer · $7.50",
    price: 20.99,
    dietary: [],
  },
  {
    id: "chicken-tawook-plate",
    category: "plates",
    name: "Chicken Tawook Plate",
    description:
      "Two skewers of marinated grilled chicken tawook with peppers and onion, over a bed of rice with hummus, house salad, and warm pita. Served with garlic sauce.",
    addOn: "Extra skewer · $7.50",
    price: 18.99,
    image: "/images/menu/chicken-tawook-plate.webp",
    dietary: [],
  },
  {
    id: "falafel-plate",
    category: "plates",
    name: "Falafel Plate",
    description:
      "Falafel on a bed of rice with hummus, garbanzo bean salad, and warm pita.",
    price: 17.99,
    image: "/images/menu/falafel-plate-v2.webp",
    dietary: ["vegan", "vegetarian"],
  },
  {
    id: "shawarma-fries",
    category: "plates",
    name: "Gyro Fries or Chicken Shawarma Fries",
    description:
      "Golden seasoned fries piled with gyro meat or chicken shawarma, chopped tomato, crumbled feta, and your pick of tzatziki or garlic sauce.",
    addOn: "Add extra protein · $4.99",
    price: 16.99,
    dietary: [],
    image: "/images/menu/gyro-fries.webp",
    featured: true,
  },
  {
    id: "breakfast-plate",
    category: "plates",
    name: "Breakfast Plate",
    description:
      "Hummus, foul mudamas, labneh (thick cream yogurt), olives, cheese, makdous, sliced tomato, cucumber, fresh mint, falafel, and baba ghanoush with warm pita.",
    price: 19.95,
    dietary: ["vegetarian", "contains-nuts"],
    image: "/images/menu/breakfast-plate.webp",
  },
  {
    id: "mixed-grill-platter",
    category: "plates",
    name: "Mixed Grill Platter",
    description:
      "Two skewers each of kefta, chicken tawook, and beef kebab over rice with hummus, house salad, and pita. Ideal for three.",
    price: 56.99,
    image: "/images/menu/mixed-grill-platter.webp",
    dietary: [],
  },
  {
    id: "mixed-grill-platter-extra",
    category: "plates",
    name: "Mixed Grill Platter Extra",
    description:
      "Two skewers each of kefta, chicken kebab, and beef kebab, plus sliced chicken shawarma and gyro, over rice with hummus, mixed salad, and pita. Feeds six.",
    price: 114.99,
    dietary: [],
  },

  // ——— FROM THE GRILL ———
  {
    id: "lamb-chop-plate",
    category: "grill",
    name: "Grilled Lamb Chop Plate",
    description:
      "Two bone-in chops grilled to medium, with garlic sauce or mint jelly, over rice with hummus, house salad, and pita.",
    addOn: "Extra chop · $9.99",
    price: 26.99,
    dietary: [],
    image: "/images/menu/lamb-chop-plate.webp",
    featured: true,
  },
  {
    id: "salmon-plate",
    category: "grill",
    name: "Pan-Seared Salmon Plate",
    description:
      "Salmon seared skin-side down, served over rice with baba ghanoush, house salad, pita, and tahini sauce.",
    price: 26.99,
    dietary: [],
  },
  {
    id: "surf-and-turf",
    category: "grill",
    name: "Surf & Turf Plate",
    description:
      "Pan-seared salmon and two grilled lamb chops over rice with baba ghanoush, hummus, house salad, and pita. Garlic or mint jelly, plus tahini.",
    addOn: "Extra chop · $9.99",
    price: 36.99,
    dietary: [],
  },

  // ——— BAKERY & FLATBREAD ———
  {
    id: "sfeeha",
    category: "bakery",
    name: "Lebanese Flatbread Sfeeha",
    description:
      "Baked flatbread topped with ground beef, minced tomato, bell pepper, onion, paprika, pomegranate glaze, and seven-spice.",
    price: 12.99,
    image: "/images/menu/sfeeha.webp",
    dietary: [],
  },
  {
    id: "manakesh-zaatar",
    category: "bakery",
    name: "Manakesh Za'atar",
    description:
      "Flatbread baked with za'atar, sesame seeds, and extra-virgin olive oil — the way it comes out of ovens in Middle East.",
    price: 8.99,
    image: "/images/menu/manakesh-zaatar.webp",
    dietary: ["vegan", "vegetarian"],
  },
  {
    id: "manakesh-cheese",
    category: "bakery",
    name: "Manakesh with Cheese",
    description:
      "Flatbread baked with mozzarella, feta, and sumac.",
    price: 8.99,
    image: "/images/menu/manakesh-cheese.webp",
    dietary: ["vegetarian"],
  },
  {
    id: "manakesh-labneh",
    category: "bakery",
    name: "Manakesh with Labneh & Veggies",
    description:
      "Baked flatbread spread with thick labneh, topped with sliced tomato, olives, cucumber, and mint.",
    price: 9.99,
    dietary: ["vegetarian"],
  },
  {
    id: "lahm-bi-ajeen",
    category: "bakery",
    name: "Lahm Bi-Ajeen",
    description:
      "Two puff-pastry beef pies with chopped parsley, mint, onion, pomegranate glaze, and tahini sauce.",
    price: 12.99,
    image: "/images/menu/lahm-bi-ajeen.webp",
    dietary: [],
  },
  {
    id: "sambousek",
    category: "bakery",
    name: "Sambousek / Samosas",
    description:
      "Three flaky fried dumplings, filled with beef, cheese, or vegetables.",
    price: 7.99,
    priceNote: "3 for",
    dietary: [],
  },
  {
    id: "arayes",
    category: "bakery",
    name: "Arayes",
    description:
      "Pita pockets stuffed with seasoned beef kefta and pan-seared until the bread crisps.",
    price: 12.99,
    dietary: [],
    image: "/images/menu/arayes.webp",
  },

  // ——— DIPS & MEZZA ———
  {
    id: "hummus",
    category: "mezza",
    name: "Hummus",
    description:
      "Garbanzo beans whipped with tahini, topped with herbs and a drizzle of extra-virgin olive oil.",
    price: 6.99,
    dietary: ["vegan", "vegetarian", "gluten-free"],
    image: "/images/menu/hummus.webp",
    featured: true,
  },
  {
    id: "baba-ghanoush",
    category: "mezza",
    name: "Baba Ghanoush",
    description:
      "Fire-roasted eggplant folded into tahini — smokier, silkier cousin of hummus.",
    price: 6.99,
    dietary: ["vegan", "vegetarian", "gluten-free"],
    image: "/images/menu/baba-ghanoush.webp",
    featured: true,
  },
  {
    id: "mutabal",
    category: "mezza",
    name: "Mutabal",
    description:
      "Fire-roasted eggplant blended with pomegranate molasses, tomato, lemon, garlic, and herbs, finished with olive oil.",
    price: 6.99,
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: "muhamara",
    category: "mezza",
    name: "Muhamara",
    description:
      "Fire-roasted red pepper dip with walnuts, pomegranate molasses, breadcrumbs, and olive oil.",
    price: 6.99,
    image: "/images/menu/muhamara.webp",
    dietary: ["vegan", "vegetarian", "contains-nuts"],
  },
  {
    id: "foul-mudamas",
    category: "mezza",
    name: "Foul Mudamas",
    description:
      "Slow-simmered fava beans and chickpeas with tomato, garlic, onion, and lemon.",
    price: 7.5,
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: "makdous",
    category: "mezza",
    name: "Makdous",
    description:
      "Baby eggplant cured in olive oil, stuffed with walnuts, garlic, and red pepper.",
    price: 6.5,
    dietary: ["vegan", "vegetarian", "contains-nuts", "gluten-free"],
  },
  {
    id: "kibbeh",
    category: "mezza",
    name: "Fried Kibbeh Balls",
    description:
      "Two crisp bulgur shells around spiced beef and onion.",
    price: 7.5,
    image: "/images/menu/kibbeh.webp",
    priceNote: "2 for",
    dietary: [],
  },
  {
    id: "mini-sampler-dips",
    category: "mezza",
    name: "Mini Sampler — Mixed Dips",
    description:
      "Hummus, baba ghanoush, muhamara, and mutabal with warm pita.",
    price: 10.95,
    dietary: ["vegetarian", "contains-nuts"],
    image: "/images/menu/mini-sampler-dips.webp",
  },
  {
    id: "sampler-mezza-plate",
    category: "mezza",
    name: "Sampler Mezza Plate",
    description:
      "Hummus, grape leaves, fried kibbeh, falafel, baba ghanoush, and a samosa with warm pita.",
    price: 19.95,
    dietary: [],
    image: "/images/menu/sampler-mezza-plate.webp",
  },

  // ——— SALADS ———
  {
    id: "house-salad",
    category: "salads",
    name: "House Salad",
    description:
      "Mixed greens, fresh tomato, cucumber, onion, and feta with pomegranate vinaigrette.",
    price: 7.99,
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "tabouleh",
    category: "salads",
    name: "Tabouleh",
    description:
      "Parsley and fresh mint with soaked bulgur, onion, tomato, and lemon, drizzled with olive oil. Romaine hearts on the side for scooping.",
    price: 8.5,
    dietary: ["vegan", "vegetarian"],
    image: "/images/menu/tabbouleh.webp",
    featured: true,
  },
  {
    id: "fattoush",
    category: "salads",
    name: "Fattoush",
    description:
      "Lettuce, tomato, cucumber, parsley, mint, and onion tossed in pomegranate dressing, topped with crispy pita chips.",
    price: 7.99,
    dietary: ["vegan", "vegetarian"],
    image: "/images/menu/fattoush.webp",
    featured: true,
  },
  {
    id: "garbanzo-salad",
    category: "salads",
    name: "Garbanzo Bean Salad",
    description:
      "Garbanzo beans, onion, tomato, sumac, and parsley in olive oil and fresh lemon.",
    price: 7.99,
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },

  // ——— SIDES & EXTRAS ———
  {
    id: "fries",
    category: "sides",
    name: "Sumac Fries",
    description: "Golden and crispy, seasoned with sumac.",
    price: 5.99,
    image: "/images/menu/sumac-fries.webp",
    dietary: ["vegan", "vegetarian"],
  },
  {
    id: "grape-leaves",
    category: "sides",
    name: "Stuffed Grape Leaves / Dolma",
    description: "Hand-rolled with rice, parsley, and vegetables.",
    price: 6.99,
    image: "/images/menu/grape-leaves.webp",
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: "basmati-rice",
    category: "sides",
    name: "Basmati Rice",
    description: "A generous side of seasoned basmati.",
    price: 4.5,
    image: "/images/menu/basmati-rice.webp",
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: "falafel-side",
    category: "sides",
    name: "Falafel (2 pc)",
    description: "Two pieces, fried to order.",
    price: 3.99,
    dietary: ["vegan", "vegetarian"],
  },
  {
    id: "pita",
    category: "sides",
    name: "Warm Pita or Herb Pita Chips",
    description: "Warm pita bread, or crispy herb-dusted chips.",
    price: 1.59,
    image: "/images/menu/pita.webp",
    dietary: ["vegan", "vegetarian"],
  },
  {
    id: "pickles",
    category: "sides",
    name: "Pickles or Pickled Turnips",
    description: "Sharp, pink, essential.",
    price: 2.5,
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: "extra-sauce",
    category: "sides",
    name: "Extra Sauces",
    description: "Tzatziki, tahini, garlic dip, or harissa (spicy).",
    price: 1.5,
    dietary: ["vegetarian"],
  },

  // ——— SWEETS ———
  {
    id: "baklava",
    category: "sweets",
    name: "Baklava",
    description:
      "Layers of phyllo around chopped pistachios and walnuts, soaked in syrup.",
    price: 2.95,
    dietary: ["vegetarian", "contains-nuts"],
    image: "/images/menu/baklava.webp",
    featured: true,
  },
  {
    id: "basbousa",
    category: "sweets",
    name: "Basbousa / Namoura (2 pc)",
    description:
      "Baked semolina cake with sugar syrup, butter, almond, and coconut flakes.",
    price: 6.99,
    image: "/images/menu/basbousa.webp",
    priceNote: "2 pc",
    dietary: ["vegetarian", "contains-nuts"],
  },
  {
    id: "burma-kataifi",
    category: "sweets",
    name: "Burma Kataifi (2 pc)",
    description: "Shredded phyllo rolled around pistachios and cashews.",
    price: 7.5,
    image: "/images/menu/burma-kataifi.webp",
    priceNote: "2 pc",
    dietary: ["vegetarian", "contains-nuts"],
  },
  {
    id: "ballourie-kataifi",
    category: "sweets",
    name: "Pistachio Ballourie Kataifi (2 pc)",
    description: "Blond-baked kataifi pressed with whole pistachios.",
    price: 7.5,
    image: "/images/menu/ballourie-kataifi.webp",
    priceNote: "2 pc",
    dietary: ["vegetarian", "contains-nuts"],
  },
  {
    id: "maamoul",
    category: "sweets",
    name: "Ma'amoul",
    description:
      "Traditional semolina cookies filled with pistachios and walnuts, dusted with powdered sugar.",
    price: 2.95,
    image: "/images/menu/maamoul.webp",
    dietary: ["vegetarian", "contains-nuts"],
  },

  // ——— DRINKS ———
  {
    id: "lebanese-lemonade",
    category: "drinks",
    name: "Lebanese Lemonade",
    description: "Fresh mint and a whisper of rosewater.",
    price: 3.25,
    image: "/images/menu/lebanese-lemonade.webp",
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: "mint-tea",
    category: "drinks",
    name: "Moroccan Mint Tea",
    description: "Iced or hot.",
    price: 3.25,
    dietary: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    id: "soft-drinks",
    category: "drinks",
    name: "Soft Drinks & Bottled Water",
    description: "Assorted cans and bottles.",
    price: null,
    dietary: [],
  },
];
