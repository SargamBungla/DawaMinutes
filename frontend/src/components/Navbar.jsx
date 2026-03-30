import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { IoMdSearch } from "react-icons/io";
import { MdAddShoppingCart } from "react-icons/md";
import "./Navbar.css";

function Navbar({ searchQuery, setSearchQuery, totalItems = 0 }) {
  const { user, setUser, city, address } = useAuth(); // ← city + address
  const navigate = useNavigate();
  const {
    totalPrice,
    cartOffers,
    appliedOfferId,
    applyOffer,
    removeAppliedOffer,
  } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [showAddress, setShowAddress] = useState(false); // ← address popup
  const [showOffers, setShowOffers] = useState(false);
  const offersRef = useRef(null);

  useEffect(() => {
    if (!showOffers) return;
    const onDown = (e) => {
      if (offersRef.current && !offersRef.current.contains(e.target)) {
        setShowOffers(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showOffers]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      setUser(null);
      setShowPopup(false);
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="brand" onClick={() => navigate("/")}>
          <span className="brand-icon">⚡</span>
          <span className="brand-name">
            Dawa<span className="brand-accent">Minute</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <span className="search-icon">
            <IoMdSearch />
          </span>
          <input
            type="text"
            placeholder="Search medicines, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">
          <div className="offers-wrap" ref={offersRef}>
            <button
              type="button"
              className={`nav-link offers-trigger${showOffers ? " is-open" : ""}`}
              onClick={() => setShowOffers((v) => !v)}
              aria-expanded={showOffers}
              aria-haspopup="true"
            >
              Offers
            </button>
            {showOffers && (
              <div
                className="offers-panel"
                role="dialog"
                aria-label="Cart offers"
              >
                <p className="offers-panel-title">Cart offers</p>
                <p className="offers-cart-hint">
                  Your cart: <strong>₹{Math.round(totalPrice)}</strong>
                </p>
                <ul className="offers-list">
                  {cartOffers.map((o) => {
                    const eligible = totalPrice >= o.minCart;
                    const isApplied = appliedOfferId === o.id;
                    return (
                      <li key={o.id} className="offers-item">
                        <div className="offers-item-text">
                          <span className="offers-item-label">{o.label}</span>
                          <span className="offers-item-hint">{o.hint}</span>
                        </div>
                        {isApplied ? (
                          <div className="offers-item-actions">
                            <span className="offers-applied-tag">Applied</span>
                            <button
                              type="button"
                              className="offers-remove-btn"
                              onClick={() => removeAppliedOffer()}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="offers-apply-btn"
                            disabled={!eligible}
                            title={
                              eligible
                                ? "Apply this offer"
                                : `Add ₹${o.minCart - Math.round(totalPrice)} more to unlock`
                            }
                            onClick={() => {
                              if (applyOffer(o.id)) setShowOffers(false);
                            }}
                          >
                            Apply
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <button className="my-orders-btn" onClick={() => navigate("/orders")}>
            My Orders
          </button>

          <button className="cart-btn" onClick={() => navigate("/cart")}>
            <MdAddShoppingCart style={{ color: "black", fontSize: "16px" }} />
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {user && (
            <div className="avatar-wrapper">
              <div
                className="user-avatar"
                onClick={() => setShowPopup(!showPopup)}
              >
                {user.name?.slice(0, 1).toUpperCase()}
              </div>

              {showPopup && (
                <div className="user-popup">
                  <div className="popup-user-info">
                    <div className="popup-avatar">
                      {user.name?.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="popup-details">
                      <p className="popup-name">{user.name}</p>
                      <p className="popup-email">{user.email}</p>
                    </div>
                  </div>

                  <div className="popup-divider" />

                  <button
                    className="popup-item"
                    onClick={() => {
                      navigate("/orders");
                      setShowPopup(false);
                    }}
                  >
                    My Orders
                  </button>

                  <button
                    className="popup-item popup-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Delivery Strip — Zepto Style ── */}
      <div className="delivery-strip">
        <span className="strip-dot" />

        {/* Location — click करने पर full address दिखेगा */}
        <div
          className="location-wrapper"
          onClick={() => setShowAddress(!showAddress)}
        >
          <span>
            Delivering to{" "}
            <strong className="location-city">{city || "Detecting..."}</strong>
            {address && <span className="location-short"> — {address}</span>}
          </span>
          {address && (
            <span className="location-arrow">{showAddress ? "▲" : "▼"}</span>
          )}
        </div>

        {showAddress && address && (
          <div className="address-popup">
            <p className="address-popup-label">📍 Your Location</p>
            <p className="address-popup-full">{address}</p>
          </div>
        )}

        <span className="strip-time">
          — Medicines arrive in <strong>30 mins</strong> ⚡
        </span>
      </div>
    </header>
  );
}

export default Navbar;
