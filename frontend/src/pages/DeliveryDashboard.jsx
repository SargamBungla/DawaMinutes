import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useAuth } from "../context/AuthContext";

function DeliveryDashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myLocation, setMyLocation] = useState(null);
  const [distances, setDistances] = useState({});

  const fetchOrders = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/orders/pending`, {
        withCredentials: true,
      });
      setOrders(result.data.orders);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccepted = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/orders/accepted`, {
        withCredentials: true,
      });
      setAcceptedOrders(result.data.orders);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const updateRiderLocation = useCallback(
    async (lat, lng) => {
      const allOrderIds = acceptedOrders.flatMap((o) =>
        o.items.map((i) => i.order_id),
      );
      if (allOrderIds.length === 0) return;
      try {
        await axios.put(
          `${serverUrl}/api/orders/rider-location`,
          { order_ids: allOrderIds, rider_lat: lat, rider_lng: lng },
          { withCredentials: true },
        );
      } catch (error) {
        console.log("Location update failed:", error);
      }
    },
    [acceptedOrders],
  );

  useEffect(() => {
    fetchOrders();
    fetchAccepted();
    const interval = setInterval(() => {
      fetchOrders();
      fetchAccepted();
    }, 10000);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMyLocation({ lat, lng });
        updateRiderLocation(lat, lng);
      },
      (err) => console.log("Location error:", err),
      { enableHighAccuracy: true },
    );

    return () => {
      clearInterval(interval);
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (!myLocation) return;
    const newDistances = {};
    acceptedOrders.forEach((order) => {
      if (order.delivery_lat && order.delivery_lng) {
        newDistances[order.key] = getDistance(
          myLocation.lat,
          myLocation.lng,
          parseFloat(order.delivery_lat),
          parseFloat(order.delivery_lng),
        );
      }
    });
    setDistances(newDistances);
    if (myLocation) {
      updateRiderLocation(myLocation.lat, myLocation.lng);
    }
  }, [myLocation, acceptedOrders]);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleAccept = async (orderGroup) => {
    const order_ids = orderGroup.items.map((i) => i.order_id);
    try {
      await axios.put(
        `${serverUrl}/api/orders/accept`,
        { order_ids },
        { withCredentials: true },
      );
      fetchOrders();
      fetchAccepted();
    } catch (error) {
      alert("Failed to accept order");
    }
  };

  const handleDelivered = async (orderGroup) => {
    const order_ids = orderGroup.items.map((i) => i.order_id);
    try {
      await axios.put(
        `${serverUrl}/api/orders/delivered`,
        { order_ids },
        { withCredentials: true },
      );
      fetchAccepted();
    } catch (error) {
      alert("Failed to mark delivered");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/signin");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: 14,
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "14px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a2e" }}>
          ⚡ Dawa<span style={{ color: "#4361ee" }}>Minute</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {myLocation && (
            <span
              style={{
                fontSize: 12,
                color: "#2e7d32",
                background: "#e8f5e9",
                padding: "4px 10px",
                borderRadius: 20,
              }}
            >
              📍 Location Active
            </span>
          )}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#4361ee",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {user?.name?.slice(0, 1).toUpperCase()}
          </div>
          <span style={{ fontWeight: 500, color: "#333" }}>{user?.name}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 18px",
              border: "1.5px solid #e53935",
              borderRadius: 8,
              background: "#fff",
              color: "#e53935",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px" }}>
        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#1a1a2e",
            marginBottom: 4,
          }}
        >
          Available Orders
        </h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
          Auto-refreshes every 10 seconds
        </p>

        {loading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Loading...</p>
        ) : orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #eee",
              marginBottom: 32,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
            <h3 style={{ color: "#333" }}>No pending orders</h3>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginBottom: 32,
            }}
          >
            {orders.map((order, index) => (
              <div key={index} style={cardStyle}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#1a1a2e",
                      marginBottom: 4,
                    }}
                  >
                    {order.customer_name}
                  </div>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                    📍 {order.delivery_address || "Address not available"}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}{" "}
                    | ₹{order.total.toFixed(0)}
                  </div>
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: 12,
                        color: "#555",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      {item.medicine_image_url ? (
                        <img
                          src={item.medicine_image_url}
                          alt=""
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            objectFit: "cover",
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <span>💊</span>
                      )}
                      <span>
                        {item.medicine_name} ({item.brand}) × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleAccept(order)}
                  style={{
                    padding: "10px 24px",
                    background: "#4361ee",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}

        {acceptedOrders.length > 0 && (
          <>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: 16,
              }}
            >
              My Deliveries
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {acceptedOrders.map((order, index) => {
                const dist = distances[order.key];
                const isNear = true; // Testing ke liye — baad mein `dist <= 10` karna
                return (
                  <div
                    key={index}
                    style={{
                      ...cardStyle,
                      borderLeft: "4px solid #7e57c2",
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#1a1a2e",
                            marginBottom: 4,
                          }}
                        >
                          {order.customer_name}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#666",
                            marginBottom: 4,
                          }}
                        >
                          📍 {order.delivery_address || "Address not available"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#aaa",
                            marginBottom: 8,
                          }}
                        >
                          {order.items.length} item
                          {order.items.length > 1 ? "s" : ""} | ₹
                          {order.total.toFixed(0)}
                        </div>
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: 12,
                              color: "#555",
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginTop: 4,
                            }}
                          >
                            {item.medicine_image_url ? (
                              <img
                                src={item.medicine_image_url}
                                alt=""
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 6,
                                  objectFit: "cover",
                                  border: "1px solid #eee",
                                }}
                              />
                            ) : (
                              <span>💊</span>
                            )}
                            <span>
                              {item.medicine_name} ({item.brand}) ×{" "}
                              {item.quantity}
                            </span>
                          </div>
                        ))}
                        {dist !== undefined && (
                          <div
                            style={{
                              fontSize: 12,
                              marginTop: 8,
                              color: isNear ? "#2e7d32" : "#f9a825",
                              fontWeight: 600,
                            }}
                          >
                            {isNear
                              ? "✅ You are near the customer!"
                              : `📏 Distance: ${dist.toFixed(0)} meters away`}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => isNear && handleDelivered(order)}
                        style={{
                          padding: "10px 20px",
                          background: isNear ? "#2e7d32" : "#ccc",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: isNear ? "pointer" : "not-allowed",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {isNear ? "✅ Delivered" : "🔒 Delivered"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;
