import { useEffect, useMemo, useState } from "react";

const cartStorageKey = "interior-cart";
const money = new Intl.NumberFormat("ru-RU");
const formatPrice = (price) => `${money.format(price)} руб.`;

function readSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item) =>
        typeof item?.id === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch (error) {
    console.error("Не удалось прочитать корзину:", error);
    return [];
  }
}

function Header({ cartCount, variant = "home" }) {
  const [search, setSearch] = useState(
    () => new URLSearchParams(window.location.search).get("search") || "",
  );
  const heroClass =
    variant === "catalog"
      ? "top-catalog"
      : variant === "cart"
        ? "top-cart"
        : "top";
  const title =
    variant === "catalog"
      ? "Каталог"
      : variant === "cart"
        ? "Корзина"
        : null;

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    window.location.href = query
      ? `/catalog?search=${encodeURIComponent(query)}`
      : "/catalog";
  }

  return (
    <div className={`${heroClass} center`}>
      <header className="header">
        <a href="/" aria-label="Интерьер — главная">
          <img src="/img/logo.svg" className="header__logo" alt="Интерьер" />
        </a>
        <form className="header-search" onSubmit={submitSearch}>
          <input
            aria-label="Поиск по каталогу"
            placeholder="Поиск"
            className="header__input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <nav className="header__nav" aria-label="Основная навигация">
          <ul className="header__nav-decoration">
            <li>
              <a href="/catalog" className="header__link">
                Каталог
              </a>
            </li>
            <li>
              <a href="/cart" className="header__link">
                Корзина{cartCount > 0 ? ` (${cartCount})` : ""}
              </a>
            </li>
          </ul>
        </nav>
        <nav className="header__menu" aria-label="Мобильная навигация">
          <a href="/catalog" aria-label="Открыть каталог">
            Каталог
          </a>
          <a href="/cart" aria-label={`Корзина, товаров: ${cartCount}`}>
            ♡ <span className="cart-count">{cartCount}</span>
          </a>
        </nav>
      </header>
      {variant !== "home" ? (
        <>
          <hr className="hero-divider" />
          <h1 className="page-hero-title">{title}</h1>
        </>
      ) : (
        <>
          <hr className="top__hr" />
          <div className="top__content">
            <h1 className="top__title">
              Всё, чего
              <br />
              заслуживает ваш дом
            </h1>
            <p className="top__subtitle">Наша мебель — ваше отражение</p>
            <a href="/catalog" className="top__link">
              Перейти в каталог
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  function subscribe(event) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="footer center">
      <a href="/" aria-label="На главную">
        <img src="/img/logo_dark.svg" className="footer__logo" alt="Интерьер" />
      </a>
      <div className="footer__menu">
        <h2 className="footer__title">Меню</h2>
        <nav className="footer__nav" aria-label="Ссылки в подвале">
          <ul className="nav-box">
            <li>
              <a href="/" className="footer__link">
                Главная
              </a>
            </li>
            <li>
              <a href="/catalog" className="footer__link">
                Каталог
              </a>
            </li>
            <li>
              <a href="/cart" className="footer__link">
                Корзина
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="footer__contacts">
        <h2 className="footer__title">Контакты</h2>
        <a href="tel:+79088008080" className="footer__link">
          +7 908 800 80 80
        </a>
        <a href="mailto:help@interier.com" className="footer__link">
          help@interier.com
        </a>
        <div className="footer__icons">
          <a href="#" className="footer__icon" aria-label="ВКонтакте">
            <img src="/img/vk.svg" alt="" />
          </a>
          <a href="#" className="footer__icon" aria-label="Telegram">
            <img src="/img/telegram.svg" alt="" />
          </a>
          <a href="#" className="footer__icon" aria-label="Дзен">
            <img src="/img/dzen.svg" alt="" />
          </a>
        </div>
      </div>
      <form className="form" onSubmit={subscribe}>
        <label className="form__subtitle" htmlFor="newsletter-email">
          {subscribed
            ? "Спасибо за подписку!"
            : "Получайте наши новости и обновления"}
        </label>
        <input
          id="newsletter-email"
          placeholder="Ваш e-mail"
          type="email"
          className="form__input"
          required
          disabled={subscribed}
        />
        <button className="form__button" type="submit" disabled={subscribed}>
          {subscribed ? "Вы подписаны" : "Подписаться"}
        </button>
      </form>
    </footer>
  );
}

function ProductCard({ product, onAdd, isFavorite, onFavorite, index = 0 }) {
  return (
    <article
      className="product reveal-card"
      style={{ "--card-index": index % 6 }}
    >
      <div className="product__img-wrapper">
        <img
          src={product.image}
          className="product__img"
          alt={product.name}
          loading="lazy"
        />
        <div className="product__actions">
          <button
            className="product__action-btn"
            type="button"
            aria-label={`Добавить ${product.name} в корзину`}
            onClick={() => onAdd(product.id)}
          >
            <img src="/img/cart_mini_logo.svg" alt="" />
          </button>
          <button
            className={`product__action-btn${isFavorite ? " is-favorite" : ""}`}
            type="button"
            aria-label={
              isFavorite
                ? `Удалить ${product.name} из избранного`
                : `Добавить ${product.name} в избранное`
            }
            aria-pressed={isFavorite}
            onClick={() => onFavorite(product.id)}
          >
            <img src="/img/favorite_icon.svg" alt="" />
          </button>
        </div>
      </div>
      <h3 className="product__subtitle">{product.name}</h3>
      <p className="product__description">{product.description}</p>
      <div className="product__price-box">
        <p className="product__price">{formatPrice(product.price)}</p>
        {product.oldPrice ? (
          <p className="product__price-old">{formatPrice(product.oldPrice)}</p>
        ) : null}
      </div>
      <button
        className="product-add-button"
        type="button"
        onClick={() => onAdd(product.id)}
      >
        Добавить в корзину
      </button>
    </article>
  );
}

function ProductSection({ title, products, onAdd, favorites, onFavorite }) {
  return (
    <section className="product-box center">
      <h2 className="product-box__title">{title}</h2>
      <div className="product-content">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
            isFavorite={favorites.includes(product.id)}
            onFavorite={onFavorite}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function HomePage({ products, onAdd, favorites, onFavorite, cartCount }) {
  const featured = products.filter((product) => product.featured);
  const bestsellers = products.filter((product) => !product.featured).slice(0, 6);

  return (
    <>
      <Header cartCount={cartCount} />
      <main>
        <section className="for-box center">
          <h2 className="for-box__title">Мебель для ...</h2>
          <div className="for">
            <a
              href="/catalog?category=Диваны"
              className="for__item for__item_1 for__item_big"
            >
              ОТДЫХА
            </a>
            <a
              href="/catalog?category=Столы"
              className="for__item for__item_2 for__item_big"
            >
              РАБОТЫ
            </a>
            <a
              href="/catalog?category=Столы"
              className="for__item for__item_3"
            >
              КУХНИ
            </a>
            <a
              href="/catalog?category=Кровати"
              className="for__item for__item_4"
            >
              ДЕТСКОЙ
            </a>
            <a
              href="/catalog?category=Хранение"
              className="for__item for__item_5"
            >
              ВАННОЙ
            </a>
          </div>
        </section>
        <ProductSection
          title="Специальные предложения"
          products={featured}
          onAdd={onAdd}
          favorites={favorites}
          onFavorite={onFavorite}
        />
        <ProductSection
          title="Каталог товаров"
          products={bestsellers}
          onAdd={onAdd}
          favorites={favorites}
          onFavorite={onFavorite}
        />
        <a href="/catalog" className="link-box center">
          Перейти в каталог
        </a>
      </main>
      <Footer />
    </>
  );
}

function CatalogPage({
  products,
  onAdd,
  favorites,
  onFavorite,
  search,
  cartCount,
}) {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(search);
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState(params.get("category") || "Все");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortOptions = [
    { value: "popular", label: "Сначала популярные" },
    { value: "price-asc", label: "Сначала дешевле" },
    { value: "price-desc", label: "Сначала дороже" },
    { value: "name", label: "По названию" },
  ];
  const selectedSort = sortOptions.find((option) => option.value === sort);
  const categories = ["Все", ...new Set(products.map((item) => item.category))];
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.description} ${product.category}`
          .toLocaleLowerCase("ru")
          .includes(normalizedQuery);
      const matchesCategory = category === "Все" || product.category === category;
      const matchesPrice = !maxPrice || product.price <= Number(maxPrice);
      return matchesQuery && matchesCategory && matchesPrice;
    });

    return filtered.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name, "ru");
      if (sort === "popular") {
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      }
      return 0;
    });
  }, [category, maxPrice, products, query, sort]);

  return (
    <>
      <Header variant="catalog" cartCount={cartCount} />
      <main>
        <section className="catalog-toolbar center" aria-label="Настройки каталога">
          <p className="filtering__title-main">Главная / Каталог товаров</p>
          <div className="catalog-controls">
            <label className="catalog-search-label">
              <span className="visually-hidden">Поиск товаров</span>
              <input
                className="catalog-search"
                type="search"
                placeholder="Найти товар"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button
              className="filter-button"
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              Фильтры
            </button>
            <div className="sort-menu">
              <button
                className="sort-trigger"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((open) => !open)}
              >
                {selectedSort.label}
              </button>
              {sortOpen ? (
                <div className="sort-options" role="listbox" aria-label="Сортировка товаров">
                  {sortOptions.map((option) => (
                    <button
                      className={`sort-option${sort === option.value ? " is-selected" : ""}`}
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={sort === option.value}
                      onClick={() => {
                        setSort(option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
        {filtersOpen ? (
          <section className="catalog-filter-panel center" aria-label="Фильтры">
            <label>
              Категория
              <select
                className="filter-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Цена до, руб.
              <input
                className="catalog-price-input"
                type="number"
                min="0"
                placeholder="Без ограничений"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </label>
            <button
              className="filter-reset"
              type="button"
              onClick={() => {
                setCategory("Все");
                setMaxPrice("");
                setQuery("");
              }}
            >
              Сбросить фильтры
            </button>
          </section>
        ) : null}
        <section className="product-box center catalog-products">
          <div className="catalog-result-line">
            <h2 className="product-box__title">Каталог</h2>
            <p aria-live="polite">Найдено товаров: {visibleProducts.length}</p>
          </div>
          {visibleProducts.length ? (
            <div className="product-content">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={onAdd}
                  isFavorite={favorites.includes(product.id)}
                  onFavorite={onFavorite}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className="empty-message">
              По вашему запросу ничего не найдено. Измените фильтры и попробуйте
              еще раз.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function CartPage({ products, cart, setCart, onAdd, favorites, onFavorite }) {
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [orderStatus, setOrderStatus] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.id),
    }))
    .filter((item) => item.product);
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const recommendations = products.filter((product) => product.featured);

  function changeQuantity(id, quantity) {
    const nextQuantity = Math.max(1, Math.min(99, Number(quantity) || 1));
    setCart((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  }

  function removeItem(id) {
    setCart((items) => items.filter((item) => item.id !== id));
  }

  async function checkout(event) {
    event.preventDefault();
    setCheckoutError("");
    setOrderStatus(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cartItems.map(({ id, quantity }) => ({ id, quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Не удалось оформить заказ.");
      }
      setOrderStatus(result);
      setCart([]);
    } catch (error) {
      setCheckoutError(error.message);
    }
  }

  return (
    <>
      <Header
        variant="cart"
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <main>
        <div className="cart center">
          <section className="cart__content" aria-label="Товары в корзине">
            {cartItems.length ? (
              <>
                <div className="cart__name-box">
                  <h2>Товар</h2>
                  <h2>Количество</h2>
                </div>
                <hr className="cart__hr" />
                {cartItems.map(({ id, quantity, product }) => (
                  <article className="cart__item" key={id}>
                    <div className="cart__left">
                      <img
                        className="cart__img"
                        src={product.image}
                        alt={product.name}
                      />
                      <div className="cart__info">
                        <h3 className="cart__title">{product.name}</h3>
                        <p className="cart__subtitle">{product.description}</p>
                        <p className="cart__price">
                          {formatPrice(product.price * quantity)}
                        </p>
                        <div className="cart__link-box">
                          <button
                            className="cart__link"
                            type="button"
                            onClick={() => removeItem(id)}
                          >
                            Удалить
                          </button>
                          <a className="cart__link" href="/catalog">
                            В каталог
                          </a>
                        </div>
                      </div>
                    </div>
                    <label className="quantity-label">
                      <span className="visually-hidden">
                        Количество: {product.name}
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantity}
                        className="cart__number"
                        onChange={(event) =>
                          changeQuantity(id, event.target.value)
                        }
                      />
                    </label>
                  </article>
                ))}
                <div className="cart-actions">
                  <button
                    className="cart__button"
                    type="button"
                    onClick={() => setCart([])}
                  >
                    Очистить корзину
                  </button>
                  <a className="cart__button cart__button-link" href="/catalog">
                    Продолжить покупки
                  </a>
                </div>
              </>
            ) : (
              <div className="cart-empty">
                <h2 className="cart__title">
                  {orderStatus ? "Спасибо за заказ!" : "В корзине пока пусто"}
                </h2>
                <p className="cart__subtitle">
                  {orderStatus
                    ? `${orderStatus.message} Номер заказа: ${orderStatus.orderId.slice(0, 8)}.`
                    : "Добавьте понравившуюся мебель из каталога — здесь появится ваш заказ."}
                </p>
                <a href="/catalog" className="cart__button cart__button-link">
                  Перейти в каталог
                </a>
              </div>
            )}
          </section>
          <form className="cart__form" onSubmit={checkout}>
            <div className="cart__form-content">
              <h2 className="cart__form-title">Оформление заказа</h2>
              <div className="cart__contact">
                {[
                  ["name", "Имя Фамилия", "text"],
                  ["phone", "+7 904 000 80 80", "tel"],
                  ["address", "Адрес доставки", "text"],
                ].map(([key, placeholder, type]) => (
                  <label className="checkout-field" key={key}>
                    <span className="visually-hidden">{placeholder}</span>
                    <input
                      className="cart__input"
                      type={type}
                      placeholder={placeholder}
                      value={customer[key]}
                      onChange={(event) =>
                        setCustomer((value) => ({
                          ...value,
                          [key]: event.target.value,
                        }))
                      }
                      required
                    />
                    <hr className="cart__form-hr" />
                  </label>
                ))}
              </div>
              <p className="cart__price-total">Итого: {formatPrice(total)}</p>
              {checkoutError ? (
                <p className="checkout-error" role="alert">
                  {checkoutError}
                </p>
              ) : null}
              <button
                className="cart__purchase"
                type="submit"
                disabled={!cartItems.length}
              >
                Оформить заказ
              </button>
            </div>
          </form>
        </div>
        <ProductSection
          title="Специальные предложения"
          products={recommendations}
          onAdd={onAdd}
          favorites={favorites}
          onFavorite={onFavorite}
        />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState("");
  const [cart, setCart] = useState(readSavedCart);
  const [favorites, setFavorites] = useState([]);
  const [notice, setNotice] = useState("");
  const path = window.location.pathname;

  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Не удалось загрузить каталог.");
        return response.json();
      })
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((error) => {
        console.error("Не удалось загрузить каталог:", error);
        if (active) setProductsError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Не удалось сохранить корзину:", error);
      setNotice("Не удалось сохранить корзину в этом браузере.");
    }
  }, [cart]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function addToCart(id) {
    setCart((items) => {
      const existing = items.find((item) => item.id === id);
      if (existing) {
        return items.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(99, item.quantity + 1) }
            : item,
        );
      }
      return [...items, { id, quantity: 1 }];
    });
    setNotice("Товар добавлен в корзину");
  }

  function toggleFavorite(id) {
    setFavorites((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }

  if (productsError) {
    return (
      <main className="app-error" role="alert">
        <h1>Не удалось загрузить магазин</h1>
        <p>{productsError}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </main>
    );
  }

  if (!products.length) {
    return (
      <main className="app-loading" aria-live="polite">
        Загружаем мебель для вашего дома…
      </main>
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const search = new URLSearchParams(window.location.search).get("search") || "";

  return (
    <>
      {path === "/cart" || path === "/cart.html" ? (
        <CartPage
          products={products}
          cart={cart}
          setCart={setCart}
          onAdd={addToCart}
          favorites={favorites}
          onFavorite={toggleFavorite}
        />
      ) : path === "/catalog" || path === "/catalog.html" ? (
        <CatalogPage
          products={products}
          onAdd={addToCart}
          favorites={favorites}
          onFavorite={toggleFavorite}
          search={search}
          cartCount={cartCount}
        />
      ) : (
        <HomePage
          products={products}
          onAdd={addToCart}
          favorites={favorites}
          onFavorite={toggleFavorite}
          cartCount={cartCount}
        />
      )}
      <p className="toast" role="status" aria-live="polite">
        {notice}
      </p>
      <span className="visually-hidden" aria-live="polite">
        В корзине товаров: {cartCount}
      </span>
    </>
  );
}
