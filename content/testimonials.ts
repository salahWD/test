/**
 * Real customer reviews (Google, 2025–2026), provided by the owner.
 * Lightly edited for spelling/length only — meaning and voice preserved.
 * Trims: location/currency fragments specific to another context removed so
 * they don't contradict the site's Palm Desert positioning.
 */

export interface Testimonial {
  id: string;
  quote: string;
  /** Display name as it appears publicly on Google. */
  attribution: string;
  /** Where the review came from (credibility signal + schema source). */
  source?: string;
  /** When the review was posted, e.g. "March 2026". Free text; shown when set. */
  date?: string;
  /** Star rating, 1–5. Defaults to 5. */
  rating?: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "johns-garage",
    quote:
      "This shawarma wasn't just food — it was an experience. The meat was tender, juicy, and seasoned to perfection. The garlic sauce was creamy and bold without being overpowering, blending perfectly with the tangy pickles and fresh vegetables. Once you've had this, nothing else compares.",
    attribution: "John's Garage",
    source: "Google review",
    rating: 5,
  },
  {
    id: "mirel-c",
    quote:
      "Everything was freshly made — even the chips were cooked right after I placed my order — and the shawarma was unbelievably fresh and delicious. The sauces really made the difference. Honestly, it's the best shawarma I've had in years.",
    attribution: "Mirel C.",
    source: "Google review",
    rating: 5,
  },
  {
    id: "mihaela-r",
    quote:
      "Absolutely loved The Wrap Shack! My friend and I tried the shawarma and it was so fresh and delicious. The owner was super friendly and really cared about making it exactly how we liked. Such a great experience!",
    attribution: "Mihaela R.",
    source: "Google review",
    rating: 5,
  },
  {
    id: "jack-nk",
    quote:
      "Delicious shawarma wraps! Fresh veg, everything was lovely — especially the sauces and meat. Will be back to try more.",
    attribution: "Jack Newton-Kelly",
    source: "Google review",
    rating: 5,
  },
  {
    id: "ursula-s",
    quote:
      "Amazing food! Super delicious and full of flavor. The service is fast and the owner is super nice and welcoming. Highly recommend — definitely coming back soon.",
    attribution: "Ursula S.",
    source: "Google review",
    rating: 5,
  },
  {
    id: "constantin-c",
    quote: "Food is amazing, service is impeccable. Highly recommended.",
    attribution: "Constantin C.",
    source: "Google review",
    rating: 5,
  },
  {
    id: "george-k",
    quote:
      "Thanks to Yelp for finding this place, we were not aware of it. As fans of Mid-East cuisine we entered this very small unpretentious takeout-oriented place with little expectation; we exited it 20 minutes later having spent barely $50 with a laden bag of variety. The surprisingly large menu is all made in the place by the Lebanese owner. At home we spread out our Mid-East buffet and were delighted by 2 excellent schwarma wraps, 4 side-dishes, and a pile of pita. All were extremely well done, delicious - a quantity far more than we could eat. Clearly we were surprised and pleased. For an inexpensive multiple-sampled Mid-East treat this little place is not to be missed. We will surely be back.",
    attribution: "George K.",
    source: "Yelp review",
    rating: 5,
  },
  {
    id: "alex-v",
    quote:
      "Been trying to find a good Mediterranean spot out here since I moved and the Wrap Shack is about to be my new spot!! I got chicken shawarma wrap and WOWW the flavors were on point. Absolutely delicious!! Not to mention this is a small business and their service is incredible, they make you feel like your family and they're just so sweet. I will definitely be coming back here as a regular and try more of the menu. But I totally recommend giving the spot to try if you're in the mood for some delicious Mediterranean food. And try the baklava too. It's delicious!!",
    attribution: "Alex V.",
    source: "Yelp review",
    rating: 5,
  },
  {
    id: "karol-s",
    quote:
      "Delicious homemade, family owned, generous helpings! Love this place. It's my weekly staple.",
    attribution: "Karol S.",
    source: "Yelp review",
    rating: 5,
  },
  {
    id: "nadira-c",
    quote:
      "Absolutely delicious food. What looks a little like a hole in the wall restaurant at first glance provides delicious tasting food that is not too salty. Better still, the staff is charming. This place has a homey atmosphere. It's nice to still see mom and pop places surviving.",
    attribution: "Nadira C.",
    source: "Yelp review",
    rating: 5,
  },
  {
    id: "teresa-s",
    quote:
      "The food at Wrap Shack is amazing! It is authentic and delicious. Rivals homemade meals that would be too labor intensive and time consuming to make. We tried and loved both the chicken and beef shawarma, the tabbouleh and spinach samosas, snacked on fig leaf wraps and eggplant dips (can't remember the names of these dishes) plus hummus. The naan is delightful as well. Every single item we tried was fresh and delicious. We are so excited to have found this gem in the desert and can't wait to dine there again.",
    attribution: "Teresa S.",
    source: "Yelp review",
    rating: 5,
  },
];
