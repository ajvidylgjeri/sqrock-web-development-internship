"use strict";
/* VendorHub - Multi-Vendor Marketplace (vanilla JS SPA with hash routing and localStorage). */
const $ = (s, el = document) => el.querySelector(s);
const money = n => "$" + n.toFixed(2);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SHIPPING = 3.99, FREE_SHIP_OVER = 75;

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("vh_" + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("vh_" + k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
};
let cart = store.get("cart", {});      // { productId: qty }
let orders = store.get("orders", []);
let f = { q: "", cat: "All", min: "", max: "", sort: "popular", stock: false };

const prod = id => PRODUCTS.find(p => p.id === +id);
const vend = id => VENDORS.find(v => v.id === +id);
const stars = r => `<span class="stars" aria-label="${r} out of 5">${"★".repeat(Math.round(r))}${"☆".repeat(5 - Math.round(r))}</span> <span class="muted small">${r.toFixed(1)}</span>`;
const stockInfo = p => p.stock === 0 ? `<span class="stock out">Out of stock</span>` : p.stock <= 8 ? `<span class="stock low">Only ${p.stock} left</span>` : `<span class="stock in">In stock</span>`;

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1800); }
function saveCart() { store.set("cart", cart); $("#cartCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0); }

// ---------- cart ----------
function addToCart(id, qty = 1) {
  const p = prod(id), have = cart[id] || 0;
  if (p.stock === 0) return toast("Sorry, this item is out of stock");
  if (have + qty > p.stock) return toast("Only " + p.stock + " available in stock");
  cart[id] = have + qty; saveCart(); toast(p.name + " added to cart");
}
function setQty(id, q) { const p = prod(id); if (q <= 0) delete cart[id]; else if (q > p.stock) { toast("Only " + p.stock + " available"); return; } else cart[id] = q; saveCart(); render(); }
function totals() {
  const sub = Object.entries(cart).reduce((s, [id, q]) => s + prod(id).price * q, 0);
  const ship = sub === 0 || sub >= FREE_SHIP_OVER ? 0 : SHIPPING;
  return { sub, ship, total: sub + ship };
}

// ---------- components ----------
function productCard(p) {
  const v = vend(p.vid);
  return `<article class="card"><a href="#/product/${p.id}" class="thumb" style="display:block;color:inherit;background:${v.color}18" aria-label="${esc(p.name)}">${p.icon}</a>
    <div class="card-body"><span class="tag">${esc(p.cat)}</span><h3><a href="#/product/${p.id}" style="color:inherit">${esc(p.name)}</a></h3>
    <p class="muted small">by <a href="#/vendor/${v.id}">${esc(v.name)}</a></p><p>${stars(p.rating)}</p>
    <p class="row"><strong class="price">${money(p.price)}${p.old ? `<span class="old">${money(p.old)}</span>` : ""}</strong>${stockInfo(p)}</p>
    <button class="btn small block" data-add="${p.id}" ${p.stock ? "" : "disabled"}>${p.stock ? "Add to Cart" : "Unavailable"}</button></div></article>`;
}
function vendorCard(v) {
  const n = PRODUCTS.filter(p => p.vid === v.id).length;
  return `<article class="card"><div class="thumb big" style="background:${v.color}18">${v.logo}</div><div class="card-body"><h3>${esc(v.name)}</h3>
    <p class="muted">${esc(v.desc)}</p><p>${stars(v.rating)} <span class="muted small">(${v.reviews} reviews)</span></p>
    <div class="chips">${v.cats.map(c => `<span class="tag">${esc(c)}</span>`).join("")}</div>
    <p class="muted small">${n} products · ${esc(v.city)}</p><a class="btn small" href="#/vendor/${v.id}">Visit store</a></div></article>`;
}

// ---------- views ----------
const views = {
  home() {
    const featured = [...PRODUCTS].sort((a, b) => b.pop - a.pop).slice(0, 4);
    const deals = PRODUCTS.filter(p => p.old);
    return `<section class="hero"><div><h1>Everything you need, from vendors you can trust.</h1>
      <p>Browse ${PRODUCTS.length}+ products from ${VENDORS.length} independent stores in a single checkout.</p>
      <a class="btn" href="#/products">Shop now</a> <a class="btn ghost" href="#/vendors">Meet the vendors</a></div><div class="hero-art" aria-hidden="true">🛍️</div></section>
    <section><h2>Shop by category</h2><div class="cats">${CATEGORIES.map(c => `<a class="cat" href="#/products?cat=${encodeURIComponent(c)}"><span>${CAT_ICON[c]}</span>${c}</a>`).join("")}</div></section>
    <section><h2>Top vendors</h2><div class="grid">${[...VENDORS].sort((a, b) => b.rating - a.rating).slice(0, 3).map(vendorCard).join("")}</div></section>
    <section><h2>Featured products</h2><div class="grid">${featured.map(productCard).join("")}</div></section>
    <section><h2>Special offers</h2><div class="offers">${deals.map(p => `<a class="offer" href="#/product/${p.id}"><b>${Math.round((1 - p.price / p.old) * 100)}% OFF</b><span>${p.icon} ${esc(p.name)} now ${money(p.price)}</span></a>`).join("")}
      <div class="offer"><b>FREE SHIPPING</b><span>On orders over ${money(FREE_SHIP_OVER)}</span></div></div>
      <p class="center"><a class="btn" href="#/products">View all products</a></p></section>`;
  },

  vendors(params) {
    const q = (params.get("q") || "").toLowerCase();
    const list = VENDORS.filter(v => v.name.toLowerCase().includes(q));
    return `<h1>Vendors</h1><div class="toolbar"><input id="vq" type="search" placeholder="Search vendors by name…" value="${esc(q)}" aria-label="Search vendors"></div>
      <div class="grid" id="vendorGrid">${list.map(vendorCard).join("") || `<p class="empty">No vendors match “${esc(q)}”.</p>`}</div>`;
  },

  vendor(params, id) {
    const v = vend(id); if (!v) return notFound();
    const list = PRODUCTS.filter(p => p.vid === v.id);
    return `<p class="crumbs"><a href="#/vendors">Vendors</a> › ${esc(v.name)}</p>
      <div class="vendor-head"><div class="logo-big" style="background:${v.color}18;border-radius:16px;padding:6px 14px">${v.logo}</div>
      <div class="grow"><h1 style="margin:0">${esc(v.name)}</h1><p class="muted">${esc(v.desc)}</p><p>${stars(v.rating)} <span class="muted small">(${v.reviews} reviews)</span></p></div>
      <div class="small"><b>Contact</b><br>📍 ${esc(v.city)}<br>✉️ ${esc(v.email)}<br>📞 ${esc(v.phone)}</div></div>
      <h2>Products (${list.length})</h2><div class="grid">${list.map(productCard).join("")}</div>
      <h2>Customer reviews</h2><div class="card" style="padding:6px 18px">${REVIEWS.map(r => `<div class="review"><b>${esc(r.who)}</b> ${stars(r.stars)}<p style="margin:.2em 0">${esc(r.text)}</p></div>`).join("")}</div>`;
  },

  products(params) {
    if (params.get("cat")) f.cat = params.get("cat");
    return `<h1>All products</h1><div class="toolbar">
      <input id="pq" type="search" placeholder="Search products…" value="${esc(f.q)}" aria-label="Search products">
      <select id="pcat" aria-label="Category"><option>All</option>${CATEGORIES.map(c => `<option ${f.cat === c ? "selected" : ""}>${c}</option>`).join("")}</select>
      <input id="pmin" type="number" min="0" placeholder="Min $" value="${f.min}" aria-label="Minimum price"><input id="pmax" type="number" min="0" placeholder="Max $" value="${f.max}" aria-label="Maximum price">
      <select id="psort" aria-label="Sort"><option value="popular" ${f.sort === "popular" ? "selected" : ""}>Most popular</option><option value="rating" ${f.sort === "rating" ? "selected" : ""}>Best rated</option>
        <option value="low" ${f.sort === "low" ? "selected" : ""}>Price: low to high</option><option value="high" ${f.sort === "high" ? "selected" : ""}>Price: high to low</option></select>
      <label class="inline small"><input id="pstock" type="checkbox" ${f.stock ? "checked" : ""}> In stock only</label>
      <button class="btn ghost small" id="preset">Reset</button></div>
      <p class="muted" id="count"></p><div class="grid" id="productGrid"></div>`;
  },

  product(params, id) {
    const p = prod(id); if (!p) return notFound();
    const v = vend(p.vid), more = PRODUCTS.filter(x => x.vid === p.vid && x.id !== p.id).slice(0, 3);
    return `<p class="crumbs"><a href="#/products">Products</a> › ${esc(p.cat)} › ${esc(p.name)}</p>
      <div class="detail"><div class="gallery"><div class="main" id="mainImg" style="background:${v.color}18">${p.icon}</div>
        <div class="thumbs">${[p.icon, "📦", "🚚"].map((ic, i) => `<button class="${i ? "" : "on"}" data-img="${ic}" aria-label="Image ${i + 1}">${ic}</button>`).join("")}</div></div>
      <div><h1 style="margin-top:0">${esc(p.name)}</h1><p>${stars(p.rating)} · ${stockInfo(p)}</p>
        <p class="price" style="font-size:1.8rem"><b>${money(p.price)}</b>${p.old ? `<span class="old">${money(p.old)}</span>` : ""}</p>
        <p>${esc(p.desc)}</p>
        <div class="row" style="justify-content:flex-start"><div class="qty"><button id="qMinus" aria-label="Decrease quantity">−</button><span id="qVal">1</span><button id="qPlus" aria-label="Increase quantity">+</button></div>
          <button class="btn" id="addDetail" data-id="${p.id}" ${p.stock ? "" : "disabled"}>${p.stock ? "Add to Cart" : "Out of stock"}</button></div>
        <h3>Specifications</h3><table class="specs">${Object.entries(p.specs).map(([k, val]) => `<tr><td>${esc(k)}</td><td>${esc(val)}</td></tr>`).join("")}<tr><td>Category</td><td>${esc(p.cat)}</td></tr></table>
        <h3>Sold by</h3><div class="card" style="padding:14px 18px"><b><a href="#/vendor/${v.id}">${v.logo} ${esc(v.name)}</a></b> ${stars(v.rating)}<p class="muted small" style="margin:.3em 0">${esc(v.desc)}</p></div></div></div>
      <h2>Reviews</h2><div class="card" style="padding:6px 18px">${REVIEWS.map(r => `<div class="review"><b>${esc(r.who)}</b> ${stars(r.stars)}<p style="margin:.2em 0">${esc(r.text)}</p></div>`).join("")}</div>
      ${more.length ? `<h2>More from ${esc(v.name)}</h2><div class="grid">${more.map(productCard).join("")}</div>` : ""}`;
  },

  cart() {
    const ids = Object.keys(cart);
    if (!ids.length) return `<h1>Shopping cart</h1><p class="empty">Your cart is empty. <a href="#/products">Continue shopping</a></p>`;
    const t = totals();
    const byVendor = {}; ids.forEach(id => (byVendor[prod(id).vid] ||= []).push(id));
    return `<h1>Shopping cart</h1><div class="cart-layout"><div>${Object.entries(byVendor).map(([vid, list]) => `<h3>${vend(vid).logo} ${esc(vend(vid).name)}</h3>` +
      list.map(id => { const p = prod(id); return `<div class="cart-row"><span class="ci">${p.icon}</span><div class="grow"><a href="#/product/${p.id}"><b>${esc(p.name)}</b></a><div class="muted small">${money(p.price)} each</div></div>
        <div class="qty"><button data-dec="${id}" aria-label="Decrease">−</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Increase">+</button></div>
        <b class="line">${money(p.price * cart[id])}</b><button class="icon-btn" data-rm="${id}" aria-label="Remove ${esc(p.name)}">✕</button></div>`; }).join("")).join("")}
      <button class="btn ghost small" id="clearCart">Clear cart</button></div>
      <aside class="card summary"><h3>Order summary</h3><p class="row"><span>Subtotal</span><span>${money(t.sub)}</span></p>
      <p class="row"><span>Shipping</span><span>${t.ship ? money(t.ship) : "Free"}</span></p>${t.ship ? `<p class="muted small">Add ${money(FREE_SHIP_OVER - t.sub)} more for free shipping.</p>` : ""}
      <p class="row total"><span>Total</span><span>${money(t.total)}</span></p><a class="btn block" href="#/checkout">Checkout</a></aside></div>`;
  },

  checkout() {
    if (!Object.keys(cart).length) return `<h1>Checkout</h1><p class="empty">Your cart is empty. <a href="#/products">Continue shopping</a></p>`;
    const t = totals();
    return `<h1>Checkout</h1><div class="cart-layout"><form id="orderForm" class="card form" novalidate><h3>Customer & delivery</h3>
      <label>Full name<input name="name" autocomplete="name"><small class="err" data-for="name"></small></label>
      <label>Email<input name="email" type="email" autocomplete="email"><small class="err" data-for="email"></small></label>
      <label>Phone<input name="phone" type="tel" autocomplete="tel"><small class="err" data-for="phone"></small></label>
      <label>Street address<input name="address" autocomplete="street-address"><small class="err" data-for="address"></small></label>
      <label>City<input name="city" autocomplete="address-level2"><small class="err" data-for="city"></small></label>
      <label class="inline"><input type="checkbox" name="terms"> I confirm the order details are correct</label><small class="err" data-for="terms"></small>
      <button class="btn block" type="submit" style="margin-top:12px">Confirm order · ${money(t.total)}</button></form>
      <aside class="card summary"><h3>Review order</h3>${Object.entries(cart).map(([id, q]) => `<p class="row"><span>${q} × ${esc(prod(id).name)}<br><span class="muted small">${esc(vend(prod(id).vid).name)}</span></span><span>${money(prod(id).price * q)}</span></p>`).join("")}
      <hr><p class="row"><span>Shipping</span><span>${t.ship ? money(t.ship) : "Free"}</span></p><p class="row total"><span>Total</span><span>${money(t.total)}</span></p></aside></div>`;
  },

  order(params, id) {
    const o = orders.find(x => x.id === id); if (!o) return notFound();
    return `<div class="confirm"><div class="check">✓</div><h1>Order confirmed!</h1><p>Thank you, ${esc(o.customer.name)}. Your order <b>#${o.id}</b> was placed.</p><p class="muted">A confirmation would be sent to ${esc(o.customer.email)}.</p></div>
      <div class="cart-layout"><div class="card"><h3>Items</h3>${o.items.map(i => `<p class="row"><span>${i.qty} × ${esc(i.name)} <span class="muted small">(${esc(i.vendor)})</span></span><span>${money(i.qty * i.price)}</span></p>`).join("")}
      <hr><p class="row"><span>Shipping</span><span>${o.ship ? money(o.ship) : "Free"}</span></p><p class="row total"><span>Total</span><span>${money(o.total)}</span></p></div>
      <aside class="card"><h3>Delivery</h3><p>${esc(o.customer.name)}<br>${esc(o.customer.address)}, ${esc(o.customer.city)}<br>${esc(o.customer.phone)}</p></aside></div>
      <p class="center"><a class="btn" href="#/products">Continue shopping</a></p>`;
  }
};
const notFound = () => `<h1>Not found</h1><p class="empty"><a href="#/">Back to home</a></p>`;

// ---------- product list (re-rendered on filter change without losing input focus) ----------
function applyFilters() {
  let list = PRODUCTS.filter(p => p.name.toLowerCase().includes(f.q.toLowerCase()) && (f.cat === "All" || p.cat === f.cat) &&
    (f.min === "" || p.price >= +f.min) && (f.max === "" || p.price <= +f.max) && (!f.stock || p.stock > 0));
  const s = { popular: (a, b) => b.pop - a.pop, rating: (a, b) => b.rating - a.rating, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price }[f.sort];
  list.sort(s);
  $("#productGrid").innerHTML = list.map(productCard).join("") || `<p class="empty">No products match your filters.</p>`;
  $("#count").textContent = list.length + " product(s)";
}

// ---------- router ----------
function render() {
  const raw = location.hash.slice(1) || "/", [path, qs] = raw.split("?"), parts = path.split("/").filter(Boolean);
  const name = parts[0] || "home", params = new URLSearchParams(qs || "");
  $("#app").innerHTML = (views[name] || notFound)(params, parts[1]);
  if (name === "products") applyFilters();
  document.querySelectorAll("nav a[data-route]").forEach(a => a.classList.toggle("active", a.dataset.route === name));
  $("#mainNav").classList.remove("open"); window.scrollTo(0, 0);
}

document.addEventListener("click", e => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-rm],[data-img],#clearCart,#preset,#qPlus,#qMinus,#addDetail");
  if (!t) return;
  if (t.dataset.add) addToCart(t.dataset.add);
  else if (t.dataset.inc) setQty(t.dataset.inc, cart[t.dataset.inc] + 1);
  else if (t.dataset.dec) setQty(t.dataset.dec, cart[t.dataset.dec] - 1);
  else if (t.dataset.rm) setQty(t.dataset.rm, 0);
  else if (t.dataset.img) { $("#mainImg").textContent = t.dataset.img; document.querySelectorAll(".thumbs button").forEach(b => b.classList.toggle("on", b === t)); }
  else if (t.id === "clearCart") { cart = {}; saveCart(); render(); }
  else if (t.id === "preset") { f = { q: "", cat: "All", min: "", max: "", sort: "popular", stock: false }; render(); }
  else if (t.id === "qPlus") { const p = prod($("#addDetail").dataset.id), v = +$("#qVal").textContent; if (v < p.stock) $("#qVal").textContent = v + 1; else toast("Only " + p.stock + " in stock"); }
  else if (t.id === "qMinus") { const v = +$("#qVal").textContent; if (v > 1) $("#qVal").textContent = v - 1; }
  else if (t.id === "addDetail") addToCart(t.dataset.id, +$("#qVal").textContent);
});
document.addEventListener("input", e => {
  if (e.target.id === "vq") { const list = VENDORS.filter(v => v.name.toLowerCase().includes(e.target.value.toLowerCase())); $("#vendorGrid").innerHTML = list.map(vendorCard).join("") || `<p class="empty">No vendors match.</p>`; }
  if (["pq", "pcat", "pmin", "pmax", "psort", "pstock"].includes(e.target.id)) {
    f = { q: $("#pq").value, cat: $("#pcat").value, min: $("#pmin").value, max: $("#pmax").value, sort: $("#psort").value, stock: $("#pstock").checked }; applyFilters();
  }
});
document.addEventListener("submit", e => {
  if (e.target.id !== "orderForm") return;
  e.preventDefault();
  const form = e.target, d = Object.fromEntries(new FormData(form)), err = {};
  if (!d.name || d.name.trim().length < 3) err.name = "Enter your full name (min 3 characters).";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email || "")) err.email = "Enter a valid email address.";
  if (!/^\+?[0-9 ()-]{8,16}$/.test(d.phone || "")) err.phone = "Enter a valid phone number.";
  if (!d.address || d.address.trim().length < 5) err.address = "Enter your street address.";
  if (!d.city || d.city.trim().length < 2) err.city = "Enter your city.";
  if (!d.terms) err.terms = "Please confirm the order details.";
  form.querySelectorAll(".err").forEach(s => s.textContent = err[s.dataset.for] || "");
  if (Object.keys(err).length) { form.elements[Object.keys(err)[0]].focus(); return; }
  const bad = Object.keys(cart).find(id => cart[id] > prod(id).stock);
  if (bad) { toast("Not enough stock for " + prod(bad).name); return; }
  const t = totals();
  const order = { id: Date.now().toString(36).toUpperCase(), time: Date.now(), ship: t.ship, total: t.total,
    items: Object.entries(cart).map(([id, qty]) => ({ name: prod(id).name, price: prod(id).price, qty, vendor: vend(prod(id).vid).name })),
    customer: { name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim(), address: d.address.trim(), city: d.city.trim() } };
  orders.push(order); store.set("orders", orders); cart = {}; saveCart(); location.hash = "#/order/" + order.id;
});
$("#menuToggle").addEventListener("click", () => { const o = $("#mainNav").classList.toggle("open"); $("#menuToggle").setAttribute("aria-expanded", o); });
$("#themeToggle").addEventListener("click", () => { const d = document.documentElement.classList.toggle("dark"); store.set("dark", d); $("#themeToggle").textContent = d ? "☀️" : "🌙"; });
if (store.get("dark", false)) { document.documentElement.classList.add("dark"); $("#themeToggle").textContent = "☀️"; }
window.addEventListener("hashchange", render);
saveCart(); render();
