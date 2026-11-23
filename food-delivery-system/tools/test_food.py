import sys, pathlib
from playwright.sync_api import sync_playwright
root = pathlib.Path(sys.argv[1]).resolve(); shots = root / "screenshots"; shots.mkdir(exist_ok=True)
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": 1280, "height": 800}); pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto(f"file://{root}/index.html"); pg.wait_for_selector(".hero")
    pg.screenshot(path=str(shots / "01-home.png"))
    pg.goto(f"file://{root}/index.html#/menu"); pg.wait_for_selector("#foodGrid .food")
    assert pg.locator("#foodGrid .food").count() == 20, "20 foods"
    pg.fill("#fq", "pizza"); assert pg.locator("#foodGrid .food").count() == 3, "search pizza"
    pg.fill("#fq", ""); pg.select_option("#fcat", "Desserts"); assert pg.locator("#foodGrid .food").count() == 3, "dessert filter"
    pg.select_option("#fcat", "All"); pg.fill("#fmax", "3"); n = pg.locator("#foodGrid .food").count(); assert n == 4, f"price filter got {n}"
    pg.fill("#fmax", ""); pg.select_option("#fsort", "low"); first = pg.locator("#foodGrid .food h3").first.inner_text(); assert first == "Cola 0.5L", first
    pg.select_option("#fsort", "popular"); pg.screenshot(path=str(shots / "02-menu.png"))
    pg.click("[data-add='1']"); pg.click("[data-add='1']"); pg.click("[data-add='10']")
    assert pg.inner_text("#cartCount") == "3"
    assert pg.is_disabled("[data-add='19']")                        # closed restaurant cannot be ordered from
    assert pg.inner_text("#cartCount") == "3"
    pg.goto(f"file://{root}/index.html#/cart"); pg.wait_for_selector(".cart-row")
    assert "$21.80" in pg.inner_text(".summary"), pg.inner_text(".summary")   # 2*8.5 + 4.8 = 21.8 -> free delivery
    pg.click("[data-dec='1']"); assert "$13.30" in pg.inner_text(".summary") and "$1.50" in pg.inner_text(".summary")
    pg.fill("#promoIn", "WELCOME10"); pg.click("#applyPromo"); assert "WELCOME10" in pg.inner_text(".summary")
    pg.screenshot(path=str(shots / "03-cart.png"))
    pg.click("text=Proceed to checkout"); pg.wait_for_selector("#orderForm")
    pg.click("#orderForm button[type=submit]"); assert "full name" in pg.inner_text("#orderForm").lower()   # validation
    pg.fill("[name=name]", "Ajvi <b>Test</b>"); pg.fill("[name=phone]", "+355 69 123 4567"); pg.fill("[name=address]", "Rruga e Durresit 10, Tirana")
    pg.screenshot(path=str(shots / "04-checkout.png"))
    pg.click("#orderForm button[type=submit]"); pg.wait_for_selector(".confirm")
    assert "<b>" not in pg.inner_html(".confirm h1").replace("&lt;b&gt;", ""), "escaped"
    assert pg.inner_text("#cartCount") == "0"; pg.screenshot(path=str(shots / "05-order-confirmation.png"))
    pg.goto(f"file://{root}/index.html#/orders"); assert pg.locator(".order-row").count() == 1
    m = b.new_page(viewport={"width": 390, "height": 800}); m.goto(f"file://{root}/index.html"); m.wait_for_selector(".hero")
    assert m.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "no horizontal scroll on mobile"
    m.click("#menuToggle"); assert m.is_visible("#mainNav"); m.screenshot(path=str(shots / "06-mobile.png"))
    b.close()
assert not errs, errs
print("ALL FOOD DELIVERY CHECKS PASSED")
