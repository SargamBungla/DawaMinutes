import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminAddProduct from "../pages/AdminAddProduct";
import AdminProductList from "../pages/AdminProductList";
import AdminOrdersList from "../pages/AdminOrdersList";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("add");
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="seller-app">
      <header className="seller-topbar">
        <div className="seller-brand">
          <span className="seller-brand-icon" aria-hidden>
            🛒
          </span>
          <span className="seller-brand-text">DawaMinute</span>
        </div>
        <div className="seller-topbar-right">
          <span className="seller-greeting">Hi! Admin</span>
          <button type="button" className="seller-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="seller-layout">
        <aside className="seller-sidebar">
          <nav className="seller-nav">
            <button
              type="button"
              className={`seller-nav-item${tab === "add" ? " is-active" : ""}`}
              onClick={() => setTab("add")}
            >
              <span className="seller-nav-icon" aria-hidden>
                ⊕
              </span>
              Add Product
            </button>
            <button
              type="button"
              className={`seller-nav-item${tab === "list" ? " is-active" : ""}`}
              onClick={() => setTab("list")}
            >
              <span className="seller-nav-icon" aria-hidden>
                ☰
              </span>
              Product List
            </button>
            <button
              type="button"
              className={`seller-nav-item${tab === "orders" ? " is-active" : ""}`}
              onClick={() => setTab("orders")}
            >
              <span className="seller-nav-icon" aria-hidden>
                ✓
              </span>
              Orders
            </button>
          </nav>
        </aside>

        <main className="seller-main">
          {tab === "add" && <AdminAddProduct />}
          {tab === "list" && <AdminProductList />}
          {tab === "orders" && <AdminOrdersList />}
        </main>
      </div>
    </div>
  );
}
