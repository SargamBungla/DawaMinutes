
export const CART_OFFERS = [
  { minCart: 200, discount: 15 },
  { minCart: 350, discount: 25 },
  { minCart: 500, discount: 50 },
  { minCart: 750, discount: 80 },
  { minCart: 1000, discount: 120 },
  { minCart: 1500, discount: 200 },
];

export function sanitizeCartDiscount(subtotal, requested) {
  const n = Math.round(Number(requested) || 0);
  if (n <= 0 || subtotal <= 0) return 0;
  const match = CART_OFFERS.find(
    (o) => o.discount === n && subtotal >= o.minCart,
  );
  return match ? n : 0;
}
