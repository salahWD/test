/**
 * Catering menu (owner's July 2026 sheet) — trays and platters built for ten.
 * SEED for the CMS `catering` section; consumed via `lib/content` accessors.
 * Ordering is by phone, 48 hours in advance. Tray photos live in
 * `public/images/catering/` (owner-approved generated set styled after the
 * real kitchen's trays); the CMS can replace them via upload.
 */

export interface CateringItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface CateringSection {
  id: string;
  label: string;
  note?: string;
  items: CateringItem[];
}

export const CATERING_LEAD_TIME = "Please call 48 hours in advance.";

export const catering: CateringSection[] = [
  {
    id: "salads",
    label: "Salad Trays",
    note: "Each serves 10",
    items: [
      {
        id: "house-salad",
        name: "House Salad",
        price: 75,
        description:
          "A bed of mixed greens topped with fresh tomato, cucumber, onion, and feta. Served with pomegranate vinaigrette.",
        image: "/images/catering/house-salad.webp",
      },
      {
        id: "tabouleh-salad",
        name: "Tabouleh Salad",
        price: 85,
        description:
          "Parsley and fresh mint folded with soaked bulgur, onion, tomato, and fresh lemon juice, drizzled with extra-virgin olive oil. Garnished with hearts of romaine.",
        image: "/images/catering/tabouleh-salad.webp",
      },
      {
        id: "fattoush-salad",
        name: "Fattoush Salad",
        price: 75,
        description:
          "Lettuce, tomato, cucumber, parsley, mint, and onion tossed in pomegranate dressing, topped with crispy pita chips.",
        image: "/images/catering/fattoush-salad.webp",
      },
    ],
  },
  {
    id: "bowls",
    label: "Family-Style Bowls",
    note: "Each serves 10",
    items: [
      {
        id: "vegetarian-bowl",
        name: "Vegetarian Bowl",
        price: 155,
        description:
          "Falafel on a bed of rice and mixed greens with pomegranate vinaigrette, red cabbage, shaved carrots, hummus, chickpeas, black beans, red kidney beans, onion, cucumber, olives, pickled turnips, and tomato, drizzled with vegan tahini sauce.",
      },
      {
        id: "gyro-bowl",
        name: "Gyro Bowl",
        price: 165,
        description:
          "Chopped gyro on a bed of rice and mixed greens with pomegranate vinaigrette, red cabbage, shaved carrots, hummus, chickpeas, black beans, red kidney beans, onion, cucumber, olives, tomato, and feta, drizzled with tzatziki.",
      },
      {
        id: "beef-shawarma-bowl",
        name: "Beef Shawarma Bowl",
        price: 175,
        description:
          "Chopped beef shawarma on a bed of rice and mixed greens with pomegranate vinaigrette, red cabbage, shaved carrots, hummus, chickpeas, black beans, red kidney beans, onion, cucumber, olives, tomato, pickles, and tahini sauce.",
      },
      {
        id: "chicken-shawarma-bowl",
        name: "Chicken Shawarma Bowl",
        price: 165,
        description:
          "Chopped chicken shawarma on a bed of rice and mixed greens with pomegranate vinaigrette, red cabbage, shaved carrots, hummus, chickpeas, black beans, red kidney beans, onion, cucumber, olives, tomato, pickles, and creamy garlic sauce.",
      },
    ],
  },
  {
    id: "grill",
    label: "Grill Platters",
    note: "Each serves 10",
    items: [
      {
        id: "lamb-chop-platter",
        name: "Grilled Lamb Chop Platter",
        price: 265,
        description:
          "20 bone-in grilled lamb chops cooked medium, served over a bed of rice with hummus, house salad, and pita bread. With our garlic sauce or mint jelly.",
      },
      {
        id: "salmon-platter",
        name: "Pan-Seared Salmon Platter",
        price: 265,
        description:
          "10 pan-seared salmon filets served over a bed of rice with baba ghanoush, house salad, and pita bread. Served with tahini sauce.",
      },
      {
        id: "mini-mixed-grill-platter",
        name: "Mini Mixed Grill Platter",
        price: 89,
        description:
          "10 mixed skewers — kefta, chicken kebab, and beef kebab — served over a bed of rice with hummus, mixed salad, and pita bread. With garlic and tahini sauces.",
        image: "/images/catering/mixed-grill-platter.webp",
      },
      {
        id: "mixed-grill-platter",
        name: "Large Mixed Grill Platter",
        price: 199,
        description:
          "30 mixed skewers — 10 kefta, 10 chicken kebab, and 10 beef kebab — served over a bed of rice with hummus, mixed salad, and pita bread. With garlic and tahini sauces.",
        image: "/images/catering/mixed-grill-platter.webp",
      },
      {
        id: "shawarma-gyro-platter",
        name: "Shawarma & Gyro Platter",
        price: 199,
        description:
          "Sliced chicken shawarma and gyro served over a bed of rice with hummus, mixed green salad, and pita bread. With garlic sauce and tzatziki.",
        image: "/images/catering/shawarma-gyro-platter.webp",
      },
    ],
  },
  {
    id: "mezza",
    label: "Bakery, Dips & Mezza Trays",
    items: [
      {
        id: "lahm-bi-ajeen",
        name: "Lahm bi Ajeen · 25 beef pies",
        price: 55,
        description:
          "Mini puff-pastry pies filled with ground beef, chopped parsley, mint, and onion, finished with pomegranate glaze and tahini sauce.",
        image: "/images/catering/lahm-bi-ajeen.webp",
      },
      {
        id: "sambousek",
        name: "Sambousek & Samosas · 25 pieces",
        price: 65,
        description:
          "Flaky, crispy fried dumplings filled with beef, cheese, or vegetables.",
      },
      {
        id: "kibbeh",
        name: "Fried Kibbeh Balls · 20 pieces",
        price: 75,
        description:
          "Crisp shells of herbed bulgur-and-meat dough stuffed with ground beef, onion, sumac, and nuts.",
      },
      {
        id: "makdous",
        name: "Makdous · 20 on a tray",
        price: 55,
        description:
          "Cured eggplant marinated in olive oil, stuffed with walnuts, garlic, chili, and red pepper. Served with pita bread.",
        image: "/images/catering/makdous.webp",
      },
      {
        id: "hummus-tray",
        name: "Hummus Dip Tray",
        price: 69,
        description:
          "Garbanzo-bean dip with tahini, topped with herbs and a drizzle of extra-virgin olive oil. Served with pita bread.",
        image: "/images/catering/hummus-tray.webp",
      },
      {
        id: "baba-ghanoush-tray",
        name: "Baba Ghanoush Dip Tray",
        price: 69,
        description:
          "Fire-roasted eggplant blended with tahini, topped with herbs and a drizzle of extra-virgin olive oil. Served with pita bread.",
      },
      {
        id: "muhamara-tray",
        name: "Muhamara Dip Tray",
        price: 69,
        description:
          "Fire-roasted red bell pepper dip with walnuts, pomegranate molasses, breadcrumbs, and olive oil. Served with pita bread.",
        image: "/images/catering/muhamara-tray.webp",
      },
      {
        id: "mutabal-tray",
        name: "Mutabal Dip Tray",
        price: 69,
        description:
          "Fire-roasted eggplant blended with pomegranate molasses, tomato, fresh lemon juice, garlic, and herbs, with a drizzle of extra-virgin olive oil. Served with pita bread.",
        image: "/images/catering/mutabal-tray.webp",
      },
      {
        id: "rice-tray",
        name: "Basmati Rice Tray",
        price: 45,
        image: "/images/catering/rice-tray.webp",
      },
      {
        id: "grape-leaves",
        name: "Stuffed Grape Leaves · Dolma · 50 pieces",
        price: 69,
        description: "Stuffed with rice, parsley, and vegetables.",
        image: "/images/catering/grape-leaves.webp",
      },
      {
        id: "falafel-tray",
        name: "Falafel Tray · 25 pieces",
        price: 49.99,
        image: "/images/catering/falafel-tray.webp",
      },
      {
        id: "pickles-tray",
        name: "Mixed Pickles & Pickled Turnips",
        price: 25,
        image: "/images/catering/pickles-tray.webp",
      },
      {
        id: "dip-sauces",
        name: "Dip Sauces",
        price: 20,
        description: "Tzatziki, tahini, garlic, ranch, or harissa (spicy).",
      },
    ],
  },
  {
    id: "sweets",
    label: "Sweet Trays",
    items: [
      {
        id: "baklava-tray",
        name: "Mixed Baklava Tray · 20 pieces",
        price: 59,
        description:
          "Traditional Middle Eastern pastry — layers of phyllo filled with chopped pistachios and walnuts, soaked in syrup.",
      },
    ],
  },
];
