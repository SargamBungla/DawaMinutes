import { useMedicineCatalog } from "../context/MedicineCatalogContext";

function productImageSrc(m) {
  if (m.imageDataUrl) return m.imageDataUrl;
  if (m.image) return m.image;
  return null;
}

export default function AdminProductList() {
  const { medicines, removeMedicine, updateMedicine } = useMedicineCatalog();

  const toggleInStock = (m) => {
    if (m.stock > 0) {
      updateMedicine(m.medicine_id, { stock: 0 });
    } else {
      updateMedicine(m.medicine_id, { stock: 100 });
    }
  };

  return (
    <div className="admin-panel-inner">
      <h1 className="admin-page-title">Product List</h1>
      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>In Stock</th>
                <th aria-label="Remove" />
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => {
                const src = productImageSrc(m);
                const inStock = m.stock > 0;
                return (
                  <tr key={m.medicine_id}>
                    <td>
                      <div className="admin-product-cell">
                        {src ? (
                          <img
                            className="admin-product-thumb"
                            src={src}
                            alt=""
                          />
                        ) : (
                          <div
                            className="admin-product-thumb admin-product-thumb-fallback"
                            aria-hidden
                          >
                            💊
                          </div>
                        )}
                        <div>
                          <div className="admin-product-name">{m.name}</div>
                          {m.brand ? (
                            <div className="admin-product-sub">{m.brand}</div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>{m.category || "—"}</td>
                    <td>₹{Number(m.price).toFixed(0)}</td>
                    <td>
                      <button
                        type="button"
                        className={`admin-toggle${inStock ? " on" : " off"}`}
                        onClick={() => toggleInStock(m)}
                        aria-pressed={inStock}
                        aria-label={inStock ? "In stock" : "Out of stock"}
                      >
                        <span className="admin-toggle-knob" />
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-icon-btn"
                        onClick={() => removeMedicine(m.medicine_id)}
                        aria-label={`Remove ${m.name}`}
                        title="Remove product"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
