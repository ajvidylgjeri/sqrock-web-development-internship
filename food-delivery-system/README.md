# QuickBite - Food Delivery System

Sqrock IT Solutions - Web Development Internship, Project Phase 2, Task 1.

A responsive food-ordering website built with plain HTML, CSS and JavaScript (no build step, works offline).

## Features
- **Homepage**: hero banner, categories, offers/promo codes, popular restaurants, featured food, call-to-action buttons
- **Restaurant listing**: logo, cuisine, rating, delivery time, open/closed status, restaurant search
- **Food menu**: 20 items in 6 categories (Pizza, Burgers, Fast Food, Desserts, Beverages, Healthy Meals), Add to Cart, per-restaurant menus
- **Search & filter**: search by name, filter by category and price range, sort by popularity, rating or price (live, no reload)
- **Cart**: add / remove / increase / decrease / clear, live totals, promo codes (`WELCOME10`, free delivery over $20)
- **Order form**: name, phone, email, address, notes, payment option, summary, full validation with inline errors
- **Order summary page**: items, quantities, totals, customer info, confirmation message, tracking steps
- **Responsive** (mobile, tablet, desktop), navigation bar with mobile menu, footer with contact and social links
- Bonus: dark mode, favourites, order history, order tracking UI, localStorage persistence, accessible markup (labels, aria, focus styles)
- User input is HTML-escaped before rendering (no XSS through the order form)

## Technologies
HTML5, CSS3 (Grid, Flexbox, custom properties), JavaScript ES2020 (hash router, localStorage). Data in `js/data.js`.

## Run
Open `index.html` in a browser, or serve the folder: `python3 -m http.server 8000`.
Deploy for free with GitHub Pages (Settings -> Pages -> Deploy from branch).

## Structure
```
index.html   css/style.css   js/data.js (restaurants, foods, offers)   js/app.js (views, router, cart, forms)
screenshots/ (Playwright captures)
```

## Testing
`python3 tools/test_food.py .` drives the site in headless Chrome and checks search, filters, sorting, cart maths, closed-restaurant rule,
promo codes, form validation, XSS escaping, order creation, history and the mobile layout.
