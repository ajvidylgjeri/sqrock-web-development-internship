// Static JSON-style data (the task allows static data). Images are emoji so the project works offline.
const CATEGORIES = ["Pizza", "Burgers", "Fast Food", "Desserts", "Beverages", "Healthy Meals"];
const CAT_ICON = { "Pizza": "🍕", "Burgers": "🍔", "Fast Food": "🍟", "Desserts": "🍰", "Beverages": "🥤", "Healthy Meals": "🥗" };

const RESTAURANTS = [
  { id: 1, name: "Pizza Napoli", cuisine: "Italian", rating: 4.8, time: 25, open: true, logo: "🍕", color: "#e63946" },
  { id: 2, name: "Burger Barn", cuisine: "American", rating: 4.5, time: 20, open: true, logo: "🍔", color: "#f4a261" },
  { id: 3, name: "Green Bowl", cuisine: "Healthy", rating: 4.7, time: 30, open: true, logo: "🥗", color: "#2a9d8f" },
  { id: 4, name: "Sweet Tooth", cuisine: "Desserts & Cafe", rating: 4.6, time: 15, open: true, logo: "🍰", color: "#d6336c" },
  { id: 5, name: "Crispy Corner", cuisine: "Fast Food", rating: 4.2, time: 18, open: true, logo: "🍟", color: "#e9c46a" },
  { id: 6, name: "Night Owl Grill", cuisine: "Grill", rating: 4.4, time: 35, open: false, logo: "🔥", color: "#6c757d" }
];

const FOODS = [
  { id: 1, rid: 1, name: "Margherita Pizza", cat: "Pizza", price: 8.5, pop: 95, desc: "Tomato sauce, mozzarella and fresh basil.", icon: "🍕" },
  { id: 2, rid: 1, name: "Pepperoni Pizza", cat: "Pizza", price: 10.0, pop: 98, desc: "Classic pepperoni with extra cheese.", icon: "🍕" },
  { id: 3, rid: 1, name: "Four Cheese Pizza", cat: "Pizza", price: 11.5, pop: 80, desc: "Mozzarella, gorgonzola, parmesan and fontina.", icon: "🧀" },
  { id: 4, rid: 2, name: "Classic Cheeseburger", cat: "Burgers", price: 7.0, pop: 92, desc: "Beef patty, cheddar, pickles and house sauce.", icon: "🍔" },
  { id: 5, rid: 2, name: "Double Smash Burger", cat: "Burgers", price: 9.5, pop: 90, desc: "Two smashed patties, caramelised onions.", icon: "🍔" },
  { id: 6, rid: 2, name: "Chicken Burger", cat: "Burgers", price: 6.5, pop: 75, desc: "Crispy chicken, lettuce and mayo.", icon: "🐔" },
  { id: 7, rid: 5, name: "Loaded Fries", cat: "Fast Food", price: 4.5, pop: 85, desc: "Fries with cheese sauce and bacon bits.", icon: "🍟" },
  { id: 8, rid: 5, name: "Chicken Nuggets (9 pcs)", cat: "Fast Food", price: 5.5, pop: 82, desc: "Golden nuggets with two dips.", icon: "🍗" },
  { id: 9, rid: 5, name: "Hot Dog Combo", cat: "Fast Food", price: 5.0, pop: 70, desc: "Hot dog, fries and a soft drink.", icon: "🌭" },
  { id: 10, rid: 4, name: "Chocolate Lava Cake", cat: "Desserts", price: 4.8, pop: 96, desc: "Warm cake with a molten chocolate centre.", icon: "🍫" },
  { id: 11, rid: 4, name: "New York Cheesecake", cat: "Desserts", price: 4.5, pop: 84, desc: "Creamy cheesecake with berry sauce.", icon: "🍰" },
  { id: 12, rid: 4, name: "Vanilla Ice Cream Cup", cat: "Desserts", price: 3.0, pop: 66, desc: "Three scoops with caramel topping.", icon: "🍨" },
  { id: 13, rid: 4, name: "Iced Latte", cat: "Beverages", price: 2.8, pop: 88, desc: "Espresso, cold milk and ice.", icon: "🧋" },
  { id: 14, rid: 2, name: "Fresh Lemonade", cat: "Beverages", price: 2.2, pop: 72, desc: "Squeezed lemons, mint and a pinch of sugar.", icon: "🍋" },
  { id: 15, rid: 5, name: "Cola 0.5L", cat: "Beverages", price: 1.5, pop: 60, desc: "Ice-cold soft drink.", icon: "🥤" },
  { id: 16, rid: 3, name: "Quinoa Power Bowl", cat: "Healthy Meals", price: 8.9, pop: 87, desc: "Quinoa, avocado, chickpeas and tahini dressing.", icon: "🥗" },
  { id: 17, rid: 3, name: "Grilled Chicken Salad", cat: "Healthy Meals", price: 7.9, pop: 83, desc: "Grilled chicken, greens and cherry tomatoes.", icon: "🥙" },
  { id: 18, rid: 3, name: "Green Detox Smoothie", cat: "Beverages", price: 3.9, pop: 68, desc: "Spinach, apple, cucumber and ginger.", icon: "🥬" },
  { id: 19, rid: 6, name: "Mixed Grill Platter", cat: "Fast Food", price: 13.5, pop: 78, desc: "Chicken, beef kebab and sausage with rice.", icon: "🍖" },
  { id: 20, rid: 6, name: "Veggie Wrap", cat: "Healthy Meals", price: 6.0, pop: 64, desc: "Grilled vegetables and hummus in a wrap.", icon: "🌯" }
];

const OFFERS = [
  { code: "WELCOME10", text: "10% off your first order", pct: 10 },
  { code: "FREESHIP", text: "Free delivery over $20", pct: 0 }
];
