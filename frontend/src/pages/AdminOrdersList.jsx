import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { sampleMedicines } from "../data/medicines";

function paymentLabel(status) {
  if (status === "Cancelled") return "Cancelled";
  if (status === "Delivered") return "Paid";
  if (status === "Pending") return "Pending";
  if (status === "Out for Delivery") return "Pending";
  return status || "—";
}

export default function AdminOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const { data } = await axios.get(`${serverUrl}/api/orders/admin/all`);
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
      setError(
        "Could not load orders. Start the backend server and ensure the database is connected.",
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="admin-panel-inner">
        <p className="admin-muted">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel-inner">
        <h1 className="admin-page-title">Orders List</h1>
        <p className="admin-error-text">{error}</p>
        <button type="button" className="admin-btn-secondary" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="admin-panel-inner">
        <h1 className="admin-page-title">Orders List</h1>
        <p className="admin-muted">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel-inner admin-orders-wrap">
      <h1 className="admin-page-title">Orders List</h1>
      <ul className="admin-order-cards">
        {orders.map((order) => (
          <li key={order.key} className="admin-order-card">
            <div className="admin-order-thumb" aria-hidden>
              {(() => {
                const firstItem = order.items[0];
                const med = sampleMedicines.find(
                  (m) => m.medicine_id === Number(firstItem?.medicine_id),
                );
                return med?.image ? (
                  <img
                    src={med.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: 4,
                    }}
                    onError={(e) => {
                      e.target.src = "/medicines/Categories/health care.png";
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 28 }}>{med?.emoji || "💊"}</span>
                );
              })()}
            </div>
            <div className="admin-order-items-col">
              {order.items.map((item) => {
                const med = sampleMedicines.find(
                  (m) => m.medicine_id === Number(item.medicine_id),
                );
                return (
                  <div key={item.order_id} className="admin-order-line">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
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
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: 2,
                          }}
                          onError={(e) => {
                            e.target.src =
                              "/medicines/Categories/health care.png";
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 18 }}>
                          {med?.emoji || "💊"}
                        </span>
                      )}
                    </div>
                    <span>
                      {item.medicine_name}
                      {item.brand ? ` (${item.brand})` : ""} × {item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="admin-order-customer">
              <strong>{order.customer_name || "Customer"}</strong>
              {order.delivery_address ? (
                <div className="admin-order-address">
                  {order.delivery_address}
                </div>
              ) : (
                <div className="admin-order-address admin-muted">
                  No address
                </div>
              )}
              {order.phone ? (
                <div className="admin-order-phone">{order.phone}</div>
              ) : null}
            </div>
            <div className="admin-order-total">
              ₹{Number(order.total).toFixed(0)}
            </div>
            <div className="admin-order-meta">
              <div>
                <span className="admin-meta-label">Method:</span> COD
              </div>
              <div>
                <span className="admin-meta-label">Date:</span>{" "}
                {new Date(order.order_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </div>
              <div>
                <span className="admin-meta-label">Payment:</span>{" "}
                {paymentLabel(order.status)}
              </div>
              <div>
                <span className="admin-meta-label">Status:</span> {order.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
