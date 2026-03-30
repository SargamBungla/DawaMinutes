import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sampleMedicines as baseMedicines } from "../data/medicines";

const STORAGE_KEY = "dawa_medicines_catalog_v1";

// clone base data
function cloneBase() {
  return baseMedicines.map((m) => ({ ...m }));
}

// load from localStorage
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

// 🔥 convert image to base64
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

const MedicineCatalogContext = createContext(null);

export function MedicineCatalogProvider({ children }) {
  const [medicines, setMedicines] = useState(
    () => loadFromStorage() || cloneBase(),
  );

  // save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
    } catch {}
  }, [medicines]);

  // ➕ ADD MEDICINE
  const addMedicine = useCallback(async (payload) => {
    let imageDataUrl = payload.imageDataUrl || null;

    const fileFromSlots =
      Array.isArray(payload.imageFiles) &&
      payload.imageFiles.find((f) => f instanceof File);
    const file = payload.imageFile || fileFromSlots;

    if (file) {
      imageDataUrl = await convertToBase64(file);
    }

    setMedicines((prev) => {
      const nextId =
        prev.reduce((max, m) => Math.max(max, m.medicine_id || 0), 0) + 1;

      const mrp = Number(payload.mrp) || 0;
      const price = Number(payload.price) || 0;

      let discount = 0;
      if (mrp > 0 && price >= 0 && price <= mrp) {
        discount = Math.round(((mrp - price) / mrp) * 100);
      }

      return [
        ...prev,
        {
          medicine_id: nextId,
          name: String(payload.name || "").trim(),
          brand: String(payload.brand || "Generic").trim(),
          price,
          mrp: mrp || price,
          category: payload.category,
          stock: Number(payload.stock) || 100,
          emoji: payload.emoji || "💊",
          discount: Math.max(0, Math.min(99, discount)),
          description: String(payload.description || "").trim(),
          imageDataUrl,
        },
      ];
    });
  }, []);

  // ❌ DELETE WITH CONFIRM
  const removeMedicine = useCallback((id) => {
    const confirmDelete = window.confirm("Delete this medicine?");
    if (!confirmDelete) return;

    setMedicines((prev) => prev.filter((m) => m.medicine_id !== id));
  }, []);

  // 🔥 UPDATE (EDIT)
  const updateMedicine = useCallback((id, updatedData) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.medicine_id !== id) return m;

        const mrp = Number(updatedData.mrp ?? m.mrp);
        const price = Number(updatedData.price ?? m.price);

        let discount = 0;
        if (mrp > 0 && price >= 0 && price <= mrp) {
          discount = Math.round(((mrp - price) / mrp) * 100);
        }

        return {
          ...m,
          ...updatedData,
          price,
          mrp,
          discount,
        };
      }),
    );
  }, []);

  // 🔄 RESET
  const resetCatalog = useCallback(() => {
    const fresh = cloneBase();
    setMedicines(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      medicines,
      addMedicine,
      removeMedicine,
      updateMedicine, // 🔥 NEW
      resetCatalog,
    }),
    [medicines, addMedicine, removeMedicine, updateMedicine, resetCatalog],
  );

  return (
    <MedicineCatalogContext.Provider value={value}>
      {children}
    </MedicineCatalogContext.Provider>
  );
}

export function useMedicineCatalog() {
  const ctx = useContext(MedicineCatalogContext);
  if (!ctx) {
    throw new Error(
      "useMedicineCatalog must be used within MedicineCatalogProvider",
    );
  }
  return ctx;
}
