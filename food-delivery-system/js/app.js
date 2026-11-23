"use strict";
/* QuickBite - Food Delivery System (vanilla JS single-page app with hash routing and localStorage). */
const $ = (s, el = document) => el.querySelector(s);
const money = n => "$" + n.toFixed(2);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DELIVERY_FEE = 1.5, FREE_SHIP_OVER = 20;

// ---------- state (persisted) ----------
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("qb_" + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("qb_" + k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
};
let cart = store.get("cart", {});          // { foodId: qty }
let orders = store.get("orders", []);
let favs = store.get("favs", []);
let filters = { q: "", cat: "All", min: "", max: "", sort: "popular" };
let promo = null;

const saveCart = () => { store.set("cart", cart); updateBadge(); };
function updateBadge() { $("#cartCount").textContent = Object.values(cart).reduce((a, b) => a + b, 0); }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1800); }
const food = id => FOODS.find(f => f.id === +id);
const rest = id => RESTAURANTS.find(r => r.id === +id);

// ---------- cart ----------
function addToCart(id) {
  const r = rest(food(id).rid);
  if (!r.open) return toast(r.name + " is closed right now");
  cart[id] = (cart[id] || 0) + 1; saveCart(); toast(food(id).name + " added to cart");
}
function changeQty(id, d) { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; saveCart(); render(); }
function removeItem(id) { delete cart[id]; saveCart(); render(); }
function clearCart() { cart = {}; promo = null; saveCart(); render(); }
function totals() {
  const sub = Object.entries(cart).reduce((s, [id, q]) => s + food(id).price * q, 0);
  const discount = promo ? sub * promo.pct / 100 : 0;
  const delivery = sub === 0 || sub >= FREE_SHIP_OVER ? 0 : DELIVERY_FEE;   // free delivery over $20
  return { sub, discount, delivery, total: sub - discount + delivery };
}

// ---------- views ----------
function foodCard(f) {
  const r = rest(f.rid), fav = favs.includes(f.id);
  return `<article class="card food">
    <div class="thumb" style="background:${r.color}22">${f.icon}</div>
    <button class="fav ${fav ? "on" : ""}" data-fav="${f.id}" aria-label="Favourite ${esc(f.name)}">${fav ? "♥" : "♡"}</button>
    <div class="card-body"><span class="tag">${esc(f.cat)}</span>
      <h3>${esc(f.name)}</h3><p class="muted">${esc(f.desc)}</p>
      <p class="muted small">${r.logo} ${esc(r.name)} · ${r.open ? "Open" : "Closed"}</p>
      <div class="row"><strong>${money(f.price)}</strong>
      <button class="btn small" data-add="${f.id}" ${r.open ? "" : "disabled"}>Add to Cart</button></div></div></article>`;
}
function restaurantCard(r) {
  const n = FOODS.filter(f => f.rid === r.id).length;
  return `<article class="card"><div class="thumb big" style="background:${r.color}22">${r.logo}</div>
    <div class="card-body"><h3>${esc(r.name)}</h3><p class="muted">${esc(r.cuisine)} · ${n} items</p>
    <p>⭐ ${r.rating} &nbsp; 🕒 ${r.time} min &nbsp; <span class="status ${r.open ? "open" : "closed"}">${r.open ? "Open" : "Closed"}</span></p>
    <a class="btn small" href="#/menu?r=${r.id}">View menu</a></div></article>`;
}

const views = {
  home() {
    const featured = [...FOODS].sort((a, b) => b.pop - a.pop).slice(0, 4);
    const popular = [...RESTAURANTS].sort((a, b) => b.rating - a.rating).slice(0, 3);
    return `<section class="hero"><div><h1>Hungry? Get it delivered in minutes.</h1>
      <p>Order from top-rated restaurants and cafes near you. Fresh, fast and tasty.</p>
      <a class="btn" href="#/menu">Order now</a> <a class="btn ghost" href="#/restaurants">Browse restaurants</a></div>
      <div class="hero-art" aria-hidden="true">🍕🍔🍟</div></section>
    <section><h2>Categories</h2><div class="cats">${CATEGORIES.map(c => `<a class="cat" href="#/menu?cat=${encodeURIComponent(c)}"><span>${CAT_ICON[c]}</span>${c}</a>`).join("")}</div></section>
    <section><h2>Offers & discounts</h2><div class="offers">${OFFERS.map(o => `<div class="offer"><b>${o.code}</b><span>${o.text}</span></div>`).join("")}</div></section>
    <section><h2>Popular restaurants</h2><div class="grid">${popular.map(restaurantCard).join("")}</div></section>
    <section><h2>Featured food</h2><div class="grid">${featured.map(foodCard).join("")}</div>
    <p class="center"><a class="btn" href="#/menu">See full menu</a></p></section>`;
  },

  restaurants(params) {
    const q = (params.get("q") || "").toLowerCase();
    const list = RESTAURANTS.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
    return `<h1>Restaurants</h1><div class="toolbar"><input id="rq" type="search" placeholder="Search restaurants by name…" value="${esc(q)}" aria-label="Search restaurants"></div>
      <div class="grid">${list.map(restaurantCard).join("") || `<p class="empty">No restaurants match “${esc(q)}”.</p>`}</div>`;
  },

  menu(params) {
    if (params.get("cat")) filters.cat = params.get("cat");
    const rid = params.get("r") ? +params.get("r") : null;
    let list = FOODS.filter(f =>
      (!rid || f.rid === rid) &&
      f.name.toLowerCase().includes(filters.q.toLowerCase()) &&
      (filters.cat === "All" || f.cat === filters.cat) &&
      (filters.min === "" || f.price >= +filters.min) && (filters.max === "" || f.price <= +filters.max));
    const sorters = { popular: (a, b) => b.pop - a.pop, rating: (a, b) => rest(b.rid).rating - rest(a.rid).rating, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price };
    list.sort(sorters[filters.sort]);
    return `<h1>${rid ? esc(rest(rid).name) + " menu" : "Food menu"}</h1>
    <div class="toolbar">
      <input id="fq" type="search" placeholder="Search food…" value="${esc(filters.q)}" aria-label="Search food">
      <select id="fcat" aria-label="Category"><option>All</option>${CATEGORIES.map(c => `<option ${filters.cat === c ? "selected" : ""}>${c}</option>`).join("")}</select>
      <input id="fmin" type="number" min="0" step="0.5" placeholder="Min $" value="${filters.min}" aria-label="Minimum price">
      <input id="fmax" type="number" min="0" step="0.5" placeholder="Max $" value="${filters.max}" aria-label="Maximum price">
      <select id="fsort" aria-label="Sort"><option value="popular" ${filters.sort === "popular" ? "selected" : ""}>Most popular</option>
        <option value="rating" ${filters.sort === "rating" ? "selected" : ""}>Top rated restaurant</option>
        <option value="low" ${filters.sort === "low" ? "selected" : ""}>Price: low to high</option>
        <option value="high" ${filters.sort === "high" ? "selected" : ""}>Price: high to low</option></select>
      <button class="btn ghost small" id="freset">Reset</button></div>
    <p class="muted" id="count">${list.length} item(s)</p>
    <div class="grid" id="foodGrid">${list.map(foodCard).join("") || `<p class="empty">No food matches your filters.</p>`}</div>`;
  },

  cart() {
    const ids = Object.keys(cart);
    if (!ids.length) return `<h1>Your cart</h1><p class="empty">Your cart is empty. <a href="#/menu">Browse the menu</a></p>`;
    const t = totals();
    return `<h1>Your cart</h1><div class="cart-layout"><div>
      ${ids.map(id => { const f = food(id); return `<div class="cart-row"><span class="ci">${f.icon}</span><div class="grow"><b>${esc(f.name)}</b><div class="muted small">${money(f.price)} each</div></div>
        <div class="qty"><button data-dec="${id}" aria-label="Decrease">−</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Increase">+</button></div>
        <b class="line">${money(f.price * cart[id])}</b><button class="icon-btn" data-rm="${id}" aria-label="Remove ${esc(f.name)}">✕</button></div>`; }).join("")}
      <button class="btn ghost small" id="clearCart">Clear cart</button></div>
      <aside class="card summary"><h3>Order total</h3>
        <div class="promo"><input id="promoIn" placeholder="Promo code" aria-label="Promo code" value="${promo ? promo.code : ""}"><button class="btn small" id="applyPromo">Apply</button></div>
        <p class="row"><span>Subtotal</span><span>${money(t.sub)}</span></p>
        ${t.discount ? `<p class="row green"><span>Discount (${promo.code})</span><span>−${money(t.discount)}</span></p>` : ""}
        <p class="row"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "Free"}</span></p>
        <p class="row total"><span>Total</span><span>${money(t.total)}</span></p>
        <a class="btn block" href="#/checkout">Proceed to checkout</a></aside></div>`;
  },

  checkout() {
    if (!Object.keys(cart).length) return `<h1>Checkout</h1><p class="empty">Your cart is empty. <a href="#/menu">Browse the menu</a></p>`;
    const t = totals();
    return `<h1>Checkout</h1><div class="cart-layout"><form id="orderForm" class="card form" novalidate>
      <h3>Delivery details</h3>
      <label>Full name<input name="name" autocomplete="name" required minlength="3"><small class="err" data-for="name"></small></label>
      <label>Phone<input name="phone" type="tel" autocomplete="tel" placeholder="+355 69 123 4567" required><small class="err" data-for="phone"></small></label>
      <label>Email (optional)<input name="email" type="email" autocomplete="email"><small class="err" data-for="email"></small></label>
      <label>Delivery address<textarea name="address" rows="3" required minlength="8"></textarea><small class="err" data-for="address"></small></label>
      <label>Notes (optional)<input name="notes" maxlength="120"></label>
      <fieldset><legend>Payment</legend><label class="inline"><input type="radio" name="pay" value="Cash on delivery" checked> Cash on delivery</label>
      <label class="inline"><input type="radio" name="pay" value="Card on delivery"> Card on delivery</label></fieldset>
      <button class="btn block" type="submit">Place order · ${money(t.total)}</button></form>
      <aside class="card summary"><h3>Order summary</h3>${Object.entries(cart).map(([id, q]) => `<p class="row"><span>${q} × ${esc(food(id).name)}</span><span>${money(food(id).price * q)}</span></p>`).join("")}
      <hr><p class="row"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "Free"}</span></p>
      ${t.discount ? `<p class="row green"><span>Discount</span><span>−${money(t.discount)}</span></p>` : ""}
      <p class="row total"><span>Total</span><span>${money(t.total)}</span></p></aside></div>`;
  },

  order(params, id) {
    const o = orders.find(x => x.id === id);
    if (!o) return `<h1>Order not found</h1><p class="empty"><a href="#/orders">Back to orders</a></p>`;
    const steps = ["Received", "Preparing", "On the way", "Delivered"];
    const elapsed = (Date.now() - o.time) / 60000, step = Math.min(3, Math.floor(elapsed / 0.5));
    return `<div class="confirm"><div class="check">✓</div><h1>Thank you, ${esc(o.customer.name)}!</h1><p>Your order <b>#${o.id}</b> has been placed successfully.</p></div>
      <div class="cart-layout"><div class="card"><h3>Ordered items</h3>${o.items.map(i => `<p class="row"><span>${i.qty} × ${esc(i.name)} <span class="muted">(${money(i.price)} each)</span></span><span>${money(i.qty * i.price)}</span></p>`).join("")}
        <hr><p class="row"><span>Delivery</span><span>${o.delivery ? money(o.delivery) : "Free"}</span></p>${o.discount ? `<p class="row green"><span>Discount</span><span>−${money(o.discount)}</span></p>` : ""}
        <p class="row total"><span>Total paid (${esc(o.customer.pay)})</span><span>${money(o.total)}</span></p></div>
      <aside class="card"><h3>Customer</h3><p>${esc(o.customer.name)}<br>${esc(o.customer.phone)}${o.customer.email ? "<br>" + esc(o.customer.email) : ""}<br>${esc(o.customer.address)}</p>
        ${o.customer.notes ? `<p class="muted">Note: ${esc(o.customer.notes)}</p>` : ""}
        <h3>Tracking</h3><ol class="track">${steps.map((s, i) => `<li class="${i <= step ? "done" : ""}">${s}</li>`).join("")}</ol></aside></div>
      <p class="center"><a class="btn" href="#/menu">Order something else</a></p>`;
  },

  orders() {
    if (!orders.length) return `<h1>Order history</h1><p class="empty">No orders yet. <a href="#/menu">Order your first meal</a></p>`;
    return `<h1>Order history</h1>${orders.slice().reverse().map(o => `<a class="card order-row" href="#/order/${o.id}"><b>#${o.id}</b><span>${new Date(o.time).toLocaleString()}</span>
      <span>${o.items.reduce((s, i) => s + i.qty, 0)} items</span><b>${money(o.total)}</b></a>`).join("")}`;
  }
};

// ---------- router ----------
function parseHash() {
  const raw = location.hash.slice(1) || "/";
  const [path, qs] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  return { name: parts[0] || "home", arg: parts[1], params: new URLSearchParams(qs || "") };
}
function render() {
  const { name, arg, params } = parseHash();
  const view = views[name] || (() => `<h1>Page not found</h1><p class="empty"><a href="#/">Go home</a></p>`);
  $("#app").innerHTML = view(params, arg);
  document.querySelectorAll("nav a[data-route]").forEach(a => a.classList.toggle("active", a.dataset.route === name));
  $("#mainNav").classList.remove("open"); $("#menuToggle").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}

// ---------- events (delegated) ----------
document.addEventListener("click", e => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-rm],[data-fav],#clearCart,#applyPromo,#freset");
  if (!t) return;
  if (t.dataset.add) addToCart(t.dataset.add);
  else if (t.dataset.inc) changeQty(t.dataset.inc, 1);
  else if (t.dataset.dec) changeQty(t.dataset.dec, -1);
  else if (t.dataset.rm) removeItem(t.dataset.rm);
  else if (t.dataset.fav) { const id = +t.dataset.fav; favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id]; store.set("favs", favs); t.classList.toggle("on"); t.textContent = t.classList.contains("on") ? "♥" : "♡"; }
  else if (t.id === "clearCart") clearCart();
  else if (t.id === "freset") { filters = { q: "", cat: "All", min: "", max: "", sort: "popular" }; location.hash = "#/menu"; render(); }
  else if (t.id === "applyPromo") {
    const code = $("#promoIn").value.trim().toUpperCase(), o = OFFERS.find(x => x.code === code);
    if (!o) { promo = null; toast("Invalid promo code"); } else { promo = o; toast("Promo applied: " + o.text); }
    render();
  }
});
document.addEventListener("input", e => {
  const id = e.target.id;
  if (id === "rq") { const p = new URLSearchParams({ q: e.target.value }); history.replaceState(null, "", "#/restaurants?" + p); const pos = e.target.selectionStart; render(); const n = $("#rq"); n.focus(); n.setSelectionRange(pos, pos); }
  if (["fq", "fcat", "fmin", "fmax", "fsort"].includes(id)) {
    filters = { q: $("#fq").value, cat: $("#fcat").value, min: $("#fmin").value, max: $("#fmax").value, sort: $("#fsort").value };
    const rid = parseHash().params.get("r");
    const list = renderFoodGridOnly(rid ? +rid : null);
    $("#foodGrid").innerHTML = list.html; $("#count").textContent = list.n + " item(s)";
  }
});
function renderFoodGridOnly(rid) {   // update just the grid so the search box keeps focus while typing
  const tmp = document.createElement("div"); tmp.innerHTML = views.menu(new URLSearchParams(rid ? { r: rid } : {}));
  return { html: $("#foodGrid", tmp).innerHTML, n: $("#count", tmp).textContent.split(" ")[0] };
}
document.addEventListener("submit", e => {
  if (e.target.id !== "orderForm") return;
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  const errs = {};
  if (!d.name || d.name.trim().length < 3) errs.name = "Please enter your full name (min 3 characters).";
  if (!/^\+?[0-9 ()-]{8,16}$/.test(d.phone || "")) errs.phone = "Enter a valid phone number (8-16 digits).";
  if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) errs.email = "Enter a valid email address.";
  if (!d.address || d.address.trim().length < 8) errs.address = "Please enter a full delivery address.";
  f.querySelectorAll(".err").forEach(s => s.textContent = errs[s.dataset.for] || "");
  if (Object.keys(errs).length) { f.querySelector("[aria-invalid]")?.removeAttribute("aria-invalid"); f.elements[Object.keys(errs)[0]].focus(); return; }
  const t = totals();
  const order = { id: Date.now().toString(36).toUpperCase(), time: Date.now(), total: t.total, delivery: t.delivery, discount: t.discount,
    items: Object.entries(cart).map(([id, qty]) => ({ name: food(id).name, price: food(id).price, qty })),
    customer: { name: d.name.trim(), phone: d.phone.trim(), email: (d.email || "").trim(), address: d.address.trim(), notes: (d.notes || "").trim(), pay: d.pay } };
  orders.push(order); store.set("orders", orders);
  cart = {}; promo = null; saveCart();
  location.hash = "#/order/" + order.id;
});
$("#menuToggle").addEventListener("click", () => { const o = $("#mainNav").classList.toggle("open"); $("#menuToggle").setAttribute("aria-expanded", o); });
$("#themeToggle").addEventListener("click", () => { const d = document.documentElement.classList.toggle("dark"); store.set("dark", d); $("#themeToggle").textContent = d ? "☀️" : "🌙"; });
if (store.get("dark", false)) { document.documentElement.classList.add("dark"); $("#themeToggle").textContent = "☀️"; }
window.addEventListener("hashchange", render);
updateBadge(); render();
