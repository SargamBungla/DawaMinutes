import { useEffect, useRef, useState } from "react";
import { useMedicineCatalog } from "../context/MedicineCatalogContext";
import { categories } from "../data/medicines";

const emptySlots = () => [null, null, null, null];

export default function AdminAddProduct() {
  const { addMedicine } = useMedicineCatalog();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    productPrice: "0",
    offerPrice: "0",
    stock: "100",
  });
  const [imageSlots, setImageSlots] = useState(emptySlots);
  const [previewUrls, setPreviewUrls] = useState([null, null, null, null]);
  const previewUrlsRef = useRef(previewUrls);
  previewUrlsRef.current = previewUrls;

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, []);

  const setSlotFile = (index, file) => {
    setImageSlots((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    setPreviewUrls((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]);
      next[index] = file ? URL.createObjectURL(file) : null;
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mrp = Number(form.productPrice) || 0;
    const price = Number(form.offerPrice) || 0;
    const firstFile = imageSlots.find((f) => f instanceof File);

    await addMedicine({
      name: form.name,
      brand: "Generic",
      category: form.category,
      price,
      mrp: mrp || price,
      stock: form.stock,
      description: form.description,
      imageFile: firstFile || undefined,
      imageFiles: imageSlots,
    });

    alert("Product added.");

    setForm({
      name: "",
      description: "",
      category: "",
      productPrice: "0",
      offerPrice: "0",
      stock: "100",
    });
    setImageSlots(emptySlots());
    setPreviewUrls((prev) => {
      prev.forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
      return [null, null, null, null];
    });
  };

  return (
    <form className="admin-add-form" onSubmit={handleSubmit}>
      <div className="admin-form-label">Product Image</div>
      <div className="admin-upload-row">
        {[0, 1, 2, 3].map((i) => (
          <label key={i} className="admin-upload-slot">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setSlotFile(i, f || null);
                e.target.value = "";
              }}
            />
            {previewUrls[i] ? (
              <span className="admin-upload-preview">
                <img src={previewUrls[i]} alt="" />
              </span>
            ) : (
              <>
                <span className="admin-upload-slot-icon">⬆</span>
                <span>Upload</span>
              </>
            )}
          </label>
        ))}
      </div>

      <label className="admin-form-label" htmlFor="admin-product-name">
        Product Name
      </label>
      <input
        id="admin-product-name"
        name="name"
        className="admin-text-input"
        placeholder="Type here."
        value={form.name}
        onChange={handleChange}
        required
      />

      <label className="admin-form-label" htmlFor="admin-product-desc">
        Product Description
      </label>
      <textarea
        id="admin-product-desc"
        name="description"
        className="admin-textarea"
        placeholder="Type here."
        value={form.description}
        onChange={handleChange}
        rows={4}
      />

      <label className="admin-form-label" htmlFor="admin-category">
        Category
      </label>
      <select
        id="admin-category"
        name="category"
        className="admin-select"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <div className="admin-price-row">
        <div>
          <label className="admin-form-label" htmlFor="admin-mrp">
            Product Price (MRP)
          </label>
          <input
            id="admin-mrp"
            name="productPrice"
            type="number"
            min="0"
            step="0.01"
            className="admin-text-input"
            style={{ marginBottom: 0 }}
            value={form.productPrice}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="admin-form-label" htmlFor="admin-price">
            Offer Price (Selling)
          </label>
          <input
            id="admin-price"
            name="offerPrice"
            type="number"
            min="0"
            step="0.01"
            className="admin-text-input"
            style={{ marginBottom: 0 }}
            value={form.offerPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      <label className="admin-form-label" htmlFor="admin-stock">
        Stock quantity
      </label>
      <input
        id="admin-stock"
        name="stock"
        type="number"
        min="0"
        className="admin-text-input"
        value={form.stock}
        onChange={handleChange}
      />

      <button type="submit" className="admin-add-submit">
        ADD
      </button>
    </form>
  );
}
