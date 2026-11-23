# VendorHub - Multi-Vendor Marketplace

Sqrock IT Solutions - Web Development Internship, Project Phase 2, Task 3.

Responsive marketplace where several independent vendors sell through one storefront and one checkout.
Plain HTML, CSS and JavaScript (no build step, works offline).

## Features
- **Homepage**: hero, categories, top vendors, featured products, special offers, call-to-action buttons
- **Vendor listing** with logo, store description, categories, ratings, product count and live search by name
- **Vendor store pages**: profile, store info, contact, all their products, reviews
- **Product listing**: image, name, vendor, category, price (with discount), stock status (in stock / low / out), rating, Add to Cart
- **Product details**: image gallery, description, specifications, vendor info, ratings and reviews, quantity picker limited by stock, more from this vendor
- **Search & filter**: search products by name, category, price range, in-stock only, sort by popularity / rating / price
- **Cart**: add, remove, change quantity (stock-limited), clear, totals grouped by vendor, free shipping over $75
- **Checkout**: customer info and delivery address, validation with inline errors, order review, confirmation page
- Responsive layout (mobile, tablet, desktop), navigation bar with mobile menu, footer with contact and social links, dark mode, localStorage persistence
- User input is HTML-escaped before rendering

## Technologies
HTML5, CSS3 (Grid, Flexbox, custom properties), JavaScript ES2020 (hash router, localStorage). Data in `js/data.js`.

## Run
Open `index.html`, or `python3 -m http.server 8000`. Deploy with GitHub Pages.

## Testing
`python3 tools/test_marketplace.py .` runs headless Chrome checks for vendor search, product search/filter/sort, stock rules, quantity limits,
cart maths and shipping, form validation, order confirmation and the mobile layout. Screenshots are saved to `screenshots/`.
