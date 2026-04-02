import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { sampleMedicines } from "../data/medicines";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Orders.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const riderIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function Orders() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingKey, setCancellingKey] = useState(null);

  const fetchOrders = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/orders/my`, {
        withCredentials: true,
      });
      setOrders(result.data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const orderCardKey = (order) =>
    `${order.order_date}-${order.items[0]?.order_id ?? ""}`;

  const handleCancelOrder = async (order) => {
    const key = orderCardKey(order);
    const ids = order.items.map((i) => i.order_id);
    if (!window.confirm("Cancel this order?")) return;
    setCancellingKey(key);
    try {
      await axios.put(
        `${serverUrl}/api/orders/cancel`,
        { order_ids: ids },
        { withCredentials: true },
      );
      await fetchOrders();
    } catch (e) {
      alert(e.response?.data?.message || "Could not cancel the order.");
    } finally {
      setCancellingKey(null);
    }
  };

  const statusColor = {
    Pending: "#f9a825",
    Packed: "#1976d2",
    "Out for Delivery": "#7e57c2",
    Delivered: "#2e7d32",
    Cancelled: "#757575",
  };

  return (
    <div className="home-page">
      <Navbar
        totalItems={totalItems}
        searchQuery=""
        setSearchQuery={() => {}}
      />

      <div className="orders-page">
        <div className="orders-header">
          <h2 className="cart-heading">My Orders</h2>
          <button className="continue-shopping" onClick={() => navigate("/")}>
            ← Continue Shopping
          </button>
        </div>

        {loading ? (
          <p className="orders-loading">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <span>📦</span>
            <h3>No orders yet</h3>
            <p>Place your first order!</p>
            <button onClick={() => navigate("/")}>Shop Now</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={orderCardKey(order)} className="order-card">
                {/* ── Header ── */}
                <div className="order-card-header">
                  <div className="order-items-imgs">
                    {order.items.map((item) => {
                      const med = sampleMedicines.find(
                        (m) => m.medicine_id === item.medicine_id,
                      );
                      return (
                        <div key={item.order_id} className="order-item-img-box">
                          {med?.image ? (
                            <img
                              src={med.image}
                              alt={item.medicine_name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                padding: 4,
                              }}
                              onError={(e) => {
e.target.src =\n                                  "/medicines/Categories/health care.png";
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 24 }}>
                              {med?.emoji || "💊"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="order-card-right">
                    <span
                      className="order-status-badge"
                      style={{
                        background:
                          (statusColor[order.status] || "#757575") + "22",
                        color: statusColor[order.status] || "#757575",
                      }}
                    >
                      {order.status === "Cancelled" ? "✕ " : "✓ "}
                      {order.status}
                    </span>
                    <p className="order-total">₹{order.total.toFixed(2)}</p>
                    {order.status === "Pending"}
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="order-card-body">
                  <p className="order-date">
                    Placed on{" "}
                    {new Date(order.order_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="order-items-list">
                    {order.items.map((item) => {
                      const med = sampleMedicines.find(
                        (m) => m.medicine_id === item.medicine_id,
                      );
                      return (
                        <div key={item.order_id} className="order-item-row">
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 8,
                              background: "#f0f4ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            {med?.image ? (
                              <img
                                src={med.image}
                                alt={item.medicine_name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                  padding: 4,
                                }}
                                onError={(e) => {
                                  e.target.src =
                                    "/src/assets/medicines/Categories/health care.png";
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: 22 }}>
                                {med?.emoji || "💊"}
                              </span>
                            )}
                          </div>
                          <span className="order-item-name">
                            {item.medicine_name} ({item.brand})
                          </span>
                          <span className="order-item-qty">
                            x{item.quantity}
                          </span>
                          <span className="order-item-price">
                            ₹{item.total_amount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Map — sirf Out for Delivery mein ── */}
                {order.status === "Out for Delivery" &&
                  order.delivery_lat &&
                  order.delivery_lng && (
                    <div style={{ marginTop: 14 }}>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#7e57c2",
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        🛵 Delivery partner on the way...
                      </p>
                      <div
                        style={{
                          height: 220,
                          borderRadius: 12,
                          overflow: "hidden",
                        }}
                      >
                        <MapContainer
                          center={[
                            parseFloat(order.delivery_lat),
                            parseFloat(order.delivery_lng),
                          ]}
                          zoom={15}
                          style={{ height: "100%", width: "100%" }}
                          zoomControl={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                          <Marker
                            position={[
                              parseFloat(order.delivery_lat),
                              parseFloat(order.delivery_lng),
                            ]}
                            icon={homeIcon}
                          >
                            <Popup>Your Location</Popup>
                          </Marker>

                          {order.rider_lat && order.rider_lng && (
                            <>
                              <Marker
                                position={[
                                  parseFloat(order.rider_lat),
                                  parseFloat(order.rider_lng),
                                ]}
                                icon={riderIcon}
                              >
                                <Popup>Delivery Partner</Popup>
                              </Marker>
                              <Polyline
                                positions={[
                                  [
                                    parseFloat(order.rider_lat),
                                    parseFloat(order.rider_lng),
                                  ],
                                  [
                                    parseFloat(order.delivery_lat),
                                    parseFloat(order.delivery_lng),
                                  ],
                                ]}
                                color="#4361ee"
                                weight={3}
                                dashArray="8,6"
                              />
                            </>
                          )}
                        </MapContainer>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
