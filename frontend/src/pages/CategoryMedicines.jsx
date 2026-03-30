import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useMedicineCatalog } from "../context/MedicineCatalogContext";
import { useCart } from "../context/CartContext";
import "./Home.css";

export default function CategoryMedicines() {
  const navigate = useNavigate();
  const { medicines } = useMedicineCatalog();
  const { cartItems: cart, addToCart, removeFromCart, totalItems } = useCart();
  const { categoryName } = useParams();
  const decodedCategory = useMemo(() => {
    try {
      return decodeURIComponent(categoryName || "");
    } catch {
      return categoryName || "";
    }
  }, [categoryName]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedicines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return medicines.filter((m) => {
      const matchCat = m.category === decodedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)
      );
    });
  }, [decodedCategory, searchQuery, medicines]);

  return (
    <div className="home-page">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalItems={totalItems}
      />

      <section className="medicines-section" id="medicines-section">
        <div className="section-wrapper">
          <div className="section-head spaced">
            <div>
              <h2 className="section-title">
                {decodedCategory || "Category"}
                <span className="count-badge">{filteredMedicines.length}</span>
              </h2>
              <p className="section-sub">
                Showing {filteredMedicines.length} results
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="clear-filter" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <button
                className="clear-filter"
                onClick={() => setSearchQuery("")}
              >
                ✕ Clear search
              </button>
            </div>
          </div>

          {filteredMedicines.length > 0 ? (
            <div className="medicines-grid">
              {filteredMedicines.map((med) => (
                <div key={med.medicine_id} className="med-card">
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
                      <span
                        className={`stock-dot ${med.stock > 50 ? "in" : "low"}`}
                      >
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
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>🗂️</span>
              <h3>No medicines found in this category</h3>
              <p>Try another category or change search</p>
              <button onClick={() => navigate("/")}>Go to Home</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
