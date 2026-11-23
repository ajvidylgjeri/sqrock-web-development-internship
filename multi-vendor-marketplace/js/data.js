// Static data for the marketplace (the task allows static / JSON data). Images are emoji so the site works offline.
const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Books", "Sports"];
const CAT_ICON = { "Electronics": "💻", "Fashion": "👕", "Home & Living": "🏠", "Books": "📚", "Sports": "⚽" };

const VENDORS = [
  { id: 1, name: "TechNest", logo: "🔌", color: "#4263eb", rating: 4.8, reviews: 312, cats: ["Electronics"], city: "Tirana", email: "hello@technest.example", phone: "+355 69 111 1111", desc: "Gadgets, accessories and smart devices from trusted brands." },
  { id: 2, name: "Urban Threads", logo: "🧥", color: "#d6336c", rating: 4.5, reviews: 204, cats: ["Fashion", "Sports"], city: "Durres", email: "style@urbanthreads.example", phone: "+355 69 222 2222", desc: "Streetwear and everyday fashion with a modern fit." },
  { id: 3, name: "Casa Verde", logo: "🪴", color: "#2b8a3e", rating: 4.7, reviews: 158, cats: ["Home & Living"], city: "Vlore", email: "care@casaverde.example", phone: "+355 69 333 3333", desc: "Plants, decor and kitchen items to make a house a home." },
  { id: 4, name: "Page Turner", logo: "📖", color: "#e8590c", rating: 4.9, reviews: 421, cats: ["Books"], city: "Tirana", email: "books@pageturner.example", phone: "+355 69 444 4444", desc: "Programming, business and fiction books, hand-picked." }
];

const P = (id, vid, name, cat, price, stock, rating, pop, icon, desc, specs, old) => ({ id, vid, name, cat, price, stock, rating, pop, icon, desc, specs, old });
const PRODUCTS = [
  P(1, 1, "Wireless Earbuds Pro", "Electronics", 49.9, 25, 4.6, 95, "🎧", "Active noise cancelling earbuds with 24-hour battery life.", { Battery: "24 h with case", Connectivity: "Bluetooth 5.3", Warranty: "1 year" }, 69.9),
  P(2, 1, "Mechanical Keyboard", "Electronics", 89, 8, 4.8, 90, "⌨️", "Hot-swappable mechanical keyboard with tactile switches.", { Layout: "75%", Switches: "Tactile brown", Connection: "USB-C" }),
  P(3, 1, "27\" 4K Monitor", "Electronics", 329, 0, 4.7, 70, "🖥️", "Sharp 4K IPS display with USB-C charging.", { Resolution: "3840 x 2160", Panel: "IPS", Refresh: "60 Hz" }),
  P(4, 1, "Portable Power Bank 20000mAh", "Electronics", 29.5, 60, 4.4, 85, "🔋", "Fast-charging power bank, two USB ports.", { Capacity: "20000 mAh", Output: "22.5 W", Weight: "420 g" }),
  P(5, 2, "Oversized Hoodie", "Fashion", 34, 40, 4.5, 88, "🧥", "Heavyweight cotton hoodie in a relaxed fit.", { Material: "80% cotton", Fit: "Oversized", Sizes: "S-XXL" }, 45),
  P(6, 2, "Classic Sneakers", "Fashion", 59, 15, 4.3, 80, "👟", "Clean everyday sneakers with cushioned sole.", { Upper: "Synthetic leather", Sole: "Rubber", Sizes: "38-45" }),
  P(7, 2, "Running Shorts", "Sports", 19, 52, 4.2, 60, "🩳", "Lightweight quick-dry shorts with zip pocket.", { Material: "Polyester", Fit: "Regular", Sizes: "S-XL" }),
  P(8, 2, "Yoga Mat 6mm", "Sports", 22, 5, 4.6, 66, "🧘", "Non-slip mat with carrying strap.", { Thickness: "6 mm", Size: "183 x 61 cm", Material: "TPE" }),
  P(9, 3, "Monstera Plant", "Home & Living", 24, 14, 4.9, 92, "🪴", "Healthy indoor Monstera in a ceramic pot.", { Height: "~50 cm", Light: "Bright indirect", Pot: "Ceramic 18 cm" }),
  P(10, 3, "Ceramic Mug Set (4)", "Home & Living", 18.5, 30, 4.5, 75, "☕", "Handmade-look mugs, dishwasher safe.", { Capacity: "350 ml each", Material: "Stoneware", Pieces: "4" }),
  P(11, 3, "LED Desk Lamp", "Home & Living", 27, 22, 4.4, 78, "💡", "Dimmable desk lamp with wireless charging pad.", { Brightness: "5 levels", Colour: "Warm to cool", Power: "12 W" }, 35),
  P(12, 3, "Cast Iron Skillet", "Home & Living", 31, 0, 4.7, 55, "🍳", "Pre-seasoned 26 cm skillet for any hob or oven.", { Diameter: "26 cm", Material: "Cast iron", Weight: "2.6 kg" }),
  P(13, 4, "Clean Code", "Books", 35, 20, 4.9, 97, "📘", "A handbook of agile software craftsmanship.", { Author: "Robert C. Martin", Pages: "464", Language: "English" }),
  P(14, 4, "The Pragmatic Programmer", "Books", 38, 18, 4.8, 89, "📗", "Your journey to mastery, 20th anniversary edition.", { Authors: "Hunt & Thomas", Pages: "352", Language: "English" }),
  P(15, 4, "Atomic Habits", "Books", 16, 45, 4.7, 93, "📙", "An easy way to build good habits and break bad ones.", { Author: "James Clear", Pages: "320", Language: "English" }),
  P(16, 4, "Designing Data-Intensive Apps", "Books", 49, 7, 4.9, 72, "📕", "The big ideas behind reliable, scalable systems.", { Author: "Martin Kleppmann", Pages: "616", Language: "English" })
];

const REVIEWS = [
  { who: "Elira", stars: 5, text: "Arrived quickly and exactly as described." },
  { who: "Marko", stars: 4, text: "Good quality for the price, would buy again." },
  { who: "Sara", stars: 5, text: "Great seller, very helpful with my questions." }
];
