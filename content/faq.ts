export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    id: "halal",
    question: "Is everything at The Wrap Shack halal?",
    answer:
      "Yes — 100% of our menu is halal, from the shawarma on the spit to the lamb chops on the grill.",
  },
  {
    id: "vegan",
    question: "Do you have vegan and vegetarian options?",
    answer:
      "Plenty. The falafel wrap, vegetarian bowl, manakesh za'atar, hummus, baba ghanoush, tabouleh, fattoush, and stuffed grape leaves are all plant-based, and most of our mezza is vegetarian.",
  },
  {
    id: "gluten-free",
    question: "What can I order if I'm gluten-free?",
    answer:
      "Our bowls are built on rice instead of bread, and dips like hummus, mutabal, and baba ghanoush are naturally gluten-free. Look for the gluten-free badge on the menu, and tell us about allergies when you order.",
  },
  {
    id: "order",
    question: "How do I order online?",
    answer:
      "We take online orders through Clover for pickup. Online ordering opens at 11:30 am and runs until 8:00 pm daily.",
  },
  {
    id: "where",
    question: "Where is The Wrap Shack located?",
    answer:
      "40100 Washington St, Suite 109, Bermuda Dunes, CA 92203 — on Washington Street at the edge of Palm Desert, a short drive from anywhere in the Coachella Valley.",
  },
  {
    id: "fresh",
    question: "Is the food made fresh?",
    answer:
      "Every day. The shawarma is stacked and roasted in-house, the falafel is fried to order, and the garlic sauce is made from a family recipe — not a jar.",
  },
  {
    id: "hours",
    question: "What are your hours?",
    answer:
      "We're open every day of the week, 11:00 am to 8:00 pm. Online ordering runs 11:30 am to 8:00 pm.",
  },
  {
    id: "reservations",
    question: "Do you take reservations?",
    answer:
      "No need — we're fast-casual counter service. Walk in any time we're open, or order ahead on Clover and pick up when it's ready.",
  },
  {
    id: "catering",
    question: "Do you handle catering or large orders?",
    answer:
      "Yes — we have a full catering menu of platters, bowls, salads, and mezza trays built for ten, from shawarma and mixed-grill skewers to baklava. Call (760) 360-8178 at least 48 hours ahead and we'll sort out the details.",
  },
  {
    id: "delivery",
    question: "Do you offer delivery?",
    answer:
      "Yes — everything is cooked to order for pickup or delivery. Order through our online ordering page and choose what works for you.",
  },
  {
    id: "shawarma",
    question: "What is shawarma?",
    answer:
      "Marinated meat — chicken or beef, in our case — stacked on a vertical spit and slow-roasted, then shaved off thin to order. Ours is built by hand every morning and served in wraps, bowls, and plates.",
  },
];
