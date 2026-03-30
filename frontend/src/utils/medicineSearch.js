/**
 * Filter medicines by search text (name, brand, category).
 */
export function filterMedicinesBySearch(medicines, query) {
  const q = query.trim().toLowerCase();
  if (!q) return medicines;
  return medicines.filter((m) => medicineMatchesQuery(m, q));
}

export function medicineMatchesQuery(medicine, qLower) {
  if (!qLower) return true;
  const name = String(medicine.name || "").toLowerCase();
  const brand = String(medicine.brand || "").toLowerCase();
  const category = String(medicine.category || "").toLowerCase();
  return (
    name.includes(qLower) ||
    brand.includes(qLower) ||
    category.includes(qLower)
  );
}

/** Name-first relevance: starts-with name, then name contains, then brand/category. */
export function sortMedicinesForSearch(medicines, query) {
  const q = query.trim().toLowerCase();
  if (!q) return medicines;
  const rank = (m) => {
    const n = String(m.name || "").toLowerCase();
    const b = String(m.brand || "").toLowerCase();
    const c = String(m.category || "").toLowerCase();
    if (n.startsWith(q)) return 0;
    if (n.includes(q)) return 1;
    if (b.includes(q)) return 2;
    if (c.includes(q)) return 3;
    return 4;
  };
  return [...medicines].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}
