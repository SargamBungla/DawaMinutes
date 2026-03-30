import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { categories } from "../data/medicines";
import { useMedicineCatalog } from "../context/MedicineCatalogContext";
import { useCart } from "../context/CartContext";
import {
  filterMedicinesBySearch,
  sortMedicinesForSearch,
} from "../utils/medicineSearch";

function MedicineProductCard({ med, cart, addToCart, removeFromCart }) {
  return (
    <div className="med-card">
      <div className="med-img-area">
        {med.image || med.imageDataUrl ? (
          <img
            src={med.image || med.imageDataUrl}
            alt={med.name}
            className="med-thumb"
          />
        ) : (
          <span className="med-emoji">{med.emoji}</span>
        )}
        <span className="discount-badge">-{med.discount}%</span>
      </div>
      <div className="med-body">
        <p className="med-brand">{med.brand}</p>
        <h3 className="med-name">{med.name}</h3>
        <span className="med-cat-tag">{med.category}</span>
        <div className="med-pricing">
          <span className="med-price">₹{med.price}</span>
          <span className="med-mrp">₹{med.mrp}</span>
        </div>
        <div className="med-footer">
          <span className={`stock-dot ${med.stock > 50 ? "in" : "low"}`}>
            {med.stock > 50 ? "● In Stock" : "● Low Stock"}
          </span>
          {cart[med.medicine_id] ? (
            <div className="qty-control">
              <button
                type="button"
                onClick={() => removeFromCart(med.medicine_id)}
              >
                −
              </button>
              <span>{cart[med.medicine_id].qty}</span>
              <button type="button" onClick={() => addToCart(med)}>
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="add-btn"
              onClick={() => addToCart(med)}
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const offerBanners = [
  {
    id: 1,
    title: "Up to 25% off",
    subtitle: "On all prescription medicines",
    bg: "linear-gradient(135deg,#1565c0,#0d47a1)",
    emoji: "💊",
  },
  {
    id: 2,
    title: "Free Delivery",
    subtitle: "On orders above ₹499",
    bg: "linear-gradient(135deg,#00897b,#00695c)",
    emoji: "🚀",
  },
  {
    id: 3,
    title: "Lab Tests @ Home",
    subtitle: "Book now, reports in 24hrs",
    bg: "linear-gradient(135deg,#6a1b9a,#4a148c)",
    emoji: "🔬",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { medicines } = useMedicineCatalog();
  const { cartItems: cart, addToCart, removeFromCart, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  // const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedicines = useMemo(
    () => filterMedicinesBySearch(medicines, searchQuery),
    [searchQuery, medicines],
  );

  const searchResultsSorted = useMemo(
    () => sortMedicinesForSearch(filteredMedicines, searchQuery),
    [filteredMedicines, searchQuery],
  );

  const isSearching = searchQuery.trim().length > 0;

  const categorySections = useMemo(() => {
    return categories
      .map((cat) => {
        const medicines = filteredMedicines
          .filter((m) => m.category === cat.name)
          .slice(0, 4);
        return { ...cat, medicines };
      })
      .filter((section) => section.medicines.length > 0);
  }, [filteredMedicines]);


  return (
    <div className="home-page">
      {/* ── Navbar — Alag Component ── */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalItems={totalItems}
      />

      {/* Search results — directly under navbar */}
      {isSearching && (
        <section
          className="search-results-below-nav"
          id="search-results-below-nav"
          aria-label="Search results"
        >
          <div className="section-wrapper">
            <div className="section-head spaced search-results-head">
              <div>
                <h2 className="section-title">
                  Search results
                  <span className="count-badge">
                    {filteredMedicines.length}
                  </span>
                </h2>
                <p className="section-sub">
                  For &quot;{searchQuery.trim()}&quot; — medicine name, brand, or
                  category
                </p>
              </div>
              <button
                type="button"
                className="clear-filter"
                onClick={() => setSearchQuery("")}
              >
                ✕ Clear search
              </button>
            </div>

            {filteredMedicines.length > 0 ? (
              <div className="medicines-grid search-results-grid">
                {searchResultsSorted.map((med) => (
                  <MedicineProductCard
                    key={med.medicine_id}
                    med={med}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state search-empty-inline">
                <span>🔍</span>
                <h3>No medicines found</h3>
                <p>Try another spelling or a shorter search term</p>
                <button type="button" onClick={() => setSearchQuery("")}>
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Hero ── */}
      {!isSearching && (
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">⚡ 30-min delivery</div>
          <h1 className="hero-title">
            Medicines at Your
            <br />
            <span className="hero-highlight">Doorstep Fast</span>
          </h1>
          <p className="hero-sub">
            Search directly. Genuine medicines, guaranteed.
          </p>
          <div className="hero-actions">
            <button className="hero-cta">Shop Now →</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <strong>50K+</strong>
              <span>Medicines</span>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <strong>2M+</strong>
              <span>Customers</span>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <strong>30min</strong>
              <span>Delivery</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/src/assets/medicines/Hero/Hero SEction.png"
            alt="DawaMinute"
            className="hero-img"
          />
        </div>
      </section>
      )}

      {/* ── Offer Banners ── */}
      {!isSearching && (
      <section className="offer-section">
        <div className="section-wrapper">
          <div className="offer-row">
            {offerBanners.map((b) => (
              <div
                key={b.id}
                className="offer-card"
                style={{ background: b.bg }}
              >
                <div className="offer-text">
                  <h3>{b.title}</h3>
                  <p>{b.subtitle}</p>
                  <button className="offer-btn">Grab Now</button>
                </div>
                <span className="offer-emoji">{b.emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Categories ── */}
      {!isSearching && (
      <section className="categories-section">
        <div className="section-wrapper">
          <div className="section-head">
            <h2 className="section-title">
              Shop by <span>Category</span>
            </h2>
            <p className="section-sub">Browse from 13 health categories</p>
          </div>
          <div className="categories-grid">
            {/* All Card */}
            <div
              className={`cat-card ${selectedCategory === "All" ? "cat-active" : ""}`}
              onClick={() => setSelectedCategory("All")}
              style={{ "--cat-accent": "#1976d2", "--cat-bg": "#e3f2fd" }}
            >
              <div className="cat-img-box" style={{ background: "#e3f2fd" }}>
                <span style={{ fontSize: 36 }}>🏠</span>
              </div>
              <p className="cat-name">All</p>
            </div>

            {categories.map((cat) => (
              <div
                key={cat.id}
                className="cat-card"
                onClick={() =>
                  navigate(`/category/${encodeURIComponent(cat.name)}`)
                }
                style={{ "--cat-accent": cat.accent, "--cat-bg": cat.color }}
              >
                <div className="cat-img-box" style={{ background: cat.color }}>
                  <img src={cat.image} alt={cat.name} className="cat-img" />
                </div>
                <p className="cat-name">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Medicines by Category (Zepto style) — hidden while searching ── */}
      {!isSearching && (
      <section className="medicines-section" id="medicines-section">
        <div className="section-wrapper">
          <div className="section-head spaced">
            <div>
              <h2 className="section-title">
                All Medicines
                <span className="count-badge">{filteredMedicines.length}</span>
              </h2>
            </div>
          </div>

          {filteredMedicines.length > 0 ? (
            categorySections.map((section) => (
              <div key={section.id} style={{ marginBottom: 28 }}>
                <div
                  className="section-head spaced"
                  style={{ marginBottom: 14, alignItems: "center" }}
                >
                  <h3 className="section-title" style={{ fontSize: "1.15rem" }}>
                    {section.name}
                  </h3>
                  <button
                    type="button"
                    className="clear-filter"
                    onClick={() =>
                      navigate(`/category/${encodeURIComponent(section.name)}`)
                    }
                  >
                    See All →
                  </button>
                </div>

                <div className="medicines-grid">
                  {section.medicines.map((med) => (
                    <MedicineProductCard
                      key={med.medicine_id}
                      med={med}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <span>🔍</span>
              <h3>No medicines found</h3>
              <p>Try a different category or search term</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
      )}

      {/* ── Trust Strip ── */}
      <section className="trust-strip">
        <div className="trust-item">
          <span>✅</span>
          <p>
            <strong>100% Genuine</strong>
            <br />
            Verified medicines
          </p>
        </div>
        <div className="trust-item">
          <span>⚡</span>
          <p>
            <strong>30-min Delivery</strong>
            <br />
            Express to your door
          </p>
        </div>
        <div className="trust-item">
          <span>💊</span>
          <p>
            <strong>50,000+ SKUs</strong>
            <br />
            All brands available
          </p>
        </div>
        <div className="trust-item">
          <span>🔒</span>
          <p>
            <strong>Secure Payments</strong>
            <br />
            UPI, Card, COD
          </p>
        </div>
        <div className="trust-item">
          <span>📋</span>
          <p>
            <strong>Easy Rx Upload</strong>
            <br />
            Instant processing
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-name">
              <span>⚡</span> Dawa<span className="brand-accent">Minute</span>
            </div>
            <p>
              Quick medicine delivery — trusted by 2M+ customers across India.
            </p>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-links">
            <h4>Help</h4>
            <a href="#">FAQs</a>
            <a href="#">Returns</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-links">
            <h4>Services</h4>
            <a href="#">Doctor Consult</a>
            <a href="#">Lab Tests</a>
            <a href="#">Health Blog</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 DawaMinute Pvt. Ltd. — All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
