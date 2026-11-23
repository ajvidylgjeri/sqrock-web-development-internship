import sys, pathlib
from playwright.sync_api import sync_playwright
root = pathlib.Path(sys.argv[1]).resolve(); shots = root / "screenshots"; shots.mkdir(exist_ok=True)
errs = []
U = f"file://{root}/index.html"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1280, "height": 800}); pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto(U); pg.wait_for_selector(".hero"); pg.screenshot(path=str(shots / "01-home.png"))
    pg.goto(U + "#/vendors"); assert pg.locator("#vendorGrid .card").count() == 4
    pg.fill("#vq", "tech"); assert pg.locator("#vendorGrid .card").count() == 1
    pg.goto(U + "#/products"); pg.wait_for_selector("#productGrid .card"); assert pg.locator("#productGrid .card").count() == 16
    pg.fill("#pq", "book"); assert pg.locator("#productGrid .card").count() == 0     # names only ("Clean Code"...) -> no match
    pg.fill("#pq", "clean"); assert pg.locator("#productGrid .card").count() == 1
    pg.fill("#pq", ""); pg.select_option("#pcat", "Books"); assert pg.locator("#productGrid .card").count() == 4
    pg.select_option("#pcat", "All"); pg.fill("#pmin", "30"); pg.fill("#pmax", "50"); n = pg.locator("#productGrid .card").count(); assert n == 6, n
    pg.fill("#pmin", ""); pg.fill("#pmax", ""); pg.check("#pstock"); assert pg.locator("#productGrid .card").count() == 14
    pg.uncheck("#pstock"); pg.select_option("#psort", "low"); assert pg.locator("#productGrid h3").first.inner_text() == "Atomic Habits"
    pg.select_option("#psort", "popular"); pg.screenshot(path=str(shots / "02-products.png"))
    assert pg.is_disabled("[data-add='3']")          # out of stock
    pg.goto(U + "#/product/2"); pg.wait_for_selector(".detail"); pg.screenshot(path=str(shots / "03-product-details.png"))
    for _ in range(9): pg.click("#qPlus")            # stock is 8 -> max qty 8
    assert pg.inner_text("#qVal") == "8"; pg.click("#qMinus"); pg.click("#addDetail"); assert pg.inner_text("#cartCount") == "7"
    pg.goto(U + "#/vendor/4"); pg.wait_for_selector(".vendor-head"); assert pg.locator("article.card").count() == 4; pg.screenshot(path=str(shots / "04-vendor-store.png"))
    pg.click("[data-add='13']"); pg.goto(U + "#/cart"); pg.wait_for_selector(".cart-row")
    assert "$658.00" in pg.inner_text(".summary"), pg.inner_text(".summary")      # 7*89 + 35 = 658 -> free shipping
    pg.click("[data-dec='13']"); pg.click("[data-rm='2']"); assert pg.inner_text(".empty") .startswith("Your cart is empty")
    pg.goto(U + "#/product/15"); pg.click("#addDetail"); pg.goto(U + "#/cart"); assert "$3.99" in pg.inner_text(".summary")   # $16 -> shipping
    pg.screenshot(path=str(shots / "05-cart.png"))
    pg.click("text=Checkout"); pg.click("#orderForm button[type=submit]"); assert "valid email" in pg.inner_text("#orderForm")
    for k, v in {"name": "Ajvi D", "email": "ajvi@example.com", "phone": "+355 69 123 4567", "address": "Rruga 1", "city": "Tirana"}.items(): pg.fill(f"[name={k}]", v)
    pg.check("[name=terms]"); pg.screenshot(path=str(shots / "06-checkout.png")); pg.click("#orderForm button[type=submit]")
    pg.wait_for_selector(".confirm"); assert pg.inner_text("#cartCount") == "0"; pg.screenshot(path=str(shots / "07-confirmation.png"))
    m = b.new_page(viewport={"width": 390, "height": 800}); m.goto(U + "#/products"); m.wait_for_selector("#productGrid .card")
    assert m.evaluate("document.documentElement.scrollWidth <= window.innerWidth"); m.click("#menuToggle"); m.screenshot(path=str(shots / "08-mobile.png"))
    b.close()
assert not errs, errs
print("ALL MARKETPLACE CHECKS PASSED")
