import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { serverUrl } from "../App";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    addToCart,
    deleteFromCart,
    totalPrice,
    clearCart,
    cartDiscount,
    appliedOffer,
  } = useCart();
  const { user, address } = useAuth();

  const items = Object.values(cartItems);
  const afterDiscount = Math.max(0, totalPrice - cartDiscount);
  const shipping = afterDiscount >= 499 ? 0 : 49;
  const tax = Math.round(afterDiscount * 0.02);
  const grandTotal = afterDiscount + shipping + tax;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await axios.post(
            `${serverUrl}/api/orders/place`,
            {
              items,
              delivery_address: address,
              delivery_lat: pos.coords.latitude,
              delivery_lng: pos.coords.longitude,
              cart_discount: cartDiscount || 0,
            },
            { withCredentials: true },
          );
          clearCart();
          navigate("/orders");
        } catch (error) {
          alert(error.response?.data?.message || "Order failed");
        }
      },
      async () => {
        // Location permission denied — bina coordinates ke bhi order ho jayega
        try {
          await axios.post(
            `${serverUrl}/api/orders/place`,
            {
              items,
              delivery_address: address,
              cart_discount: cartDiscount || 0,
            },
            { withCredentials: true },
          );
          clearCart();
          navigate("/orders");
        } catch (error) {
          alert(error.response?.data?.message || "Order failed");
        }
      },
    );
  };
  return (
    <div className="home-page">
      <Navbar
        totalItems={Object.values(cartItems).reduce((s, i) => s + i.qty, 0)}
        searchQuery=""
        setSearchQuery={() => {}}
      />

      <div className="cart-page">
        <div className="cart-left">
          <h2 className="cart-heading">
            Shopping Cart{" "}
            <span className="count-badge">{items.length} Items</span>
          </h2>

          {items.length === 0 ? (
            <div className="empty-state">
              <span>🛒</span>
              <h3>Your cart is empty</h3>
              <p>Add medicines to get started</p>
              <button onClick={() => navigate("/")}>Shop Now</button>
            </div>
          ) : (
            <>
              <div className="cart-table-head">
                <span>Product Details</span>
                <span>Subtotal</span>
                <span>Action</span>
              </div>

              <div className="cart-items-list">
                {items.map((item) => (
                  <div key={item.medicine_id} className="cart-item">
                    <div className="cart-item-left">
                      <div className="cart-item-img">
                        {item.image || item.imageDataUrl ? (
                          <img
                            src={item.image || item.imageDataUrl}
                            alt={item.name}
                          />
                        ) : (
                          <span className="cart-item-emoji">{item.emoji}</span>
                        )}
                      </div>
                      <div className="cart-item-info">
                        <p className="cart-item-brand">{item.brand}</p>
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-meta">Weight: N/A</p>
                        <div className="cart-qty-control">
                          <span>Qty: </span>
                          <button
                            onClick={() => removeFromCart(item.medicine_id)}
                          >
                            −
                          </button>
                          <span className="cart-qty-num">{item.qty}</span>
                          <button onClick={() => addToCart(item)}>+</button>
                        </div>
                      </div>
                    </div>
                    <div className="cart-item-subtotal">
                      ₹{item.price * item.qty}
                    </div>
                    <button
                      className="cart-item-delete"
                      onClick={() => deleteFromCart(item.medicine_id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="continue-shopping"
                onClick={() => navigate("/")}
              >
                ← Continue Shopping
              </button>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-right">
            <h2 className="order-summary-title">Order Summary</h2>

            <div className="order-address-box">
              <p className="order-label">DELIVERY ADDRESS</p>
              <div className="order-address-row">
                <p className="order-address-value">
                  {address || "No address found"}
                </p>
                <button className="change-btn">Change</button>
              </div>
            </div>

            <div className="order-payment-box">
              <p className="order-label">PAYMENT METHOD</p>
              <select className="payment-select">
                <option>Cash On Delivery</option>
                <option>UPI</option>
                <option>Credit / Debit Card</option>
              </select>
            </div>

            <div className="order-totals">
              <div className="order-row">
                <span>Price</span>
                <span>₹{totalPrice}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="order-row offer-discount-row">
                  <span>
                    Offer
                    {appliedOffer ? ` (${appliedOffer.label})` : ""}
                  </span>
                  <span className="offer-discount-value">−₹{cartDiscount}</span>
                </div>
              )}
              <div className="order-row">
                <span>Shipping Fee</span>
                <span className={shipping === 0 ? "free-tag" : ""}>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              <div className="order-row">
                <span>Tax (2%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="order-row total-row">
                <span>Total Amount:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
