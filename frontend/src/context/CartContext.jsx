import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CART_OFFERS } from "../data/cartOffers";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});
  const [appliedOfferId, setAppliedOfferId] = useState(null);

  const addToCart = useCallback((medicine) => {
    setCartItems((prev) => ({
      ...prev,
      [medicine.medicine_id]: {
        ...medicine,
        qty: (prev[medicine.medicine_id]?.qty || 0) + 1,
      },
    }));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[id]?.qty > 1) {
        updated[id] = { ...updated[id], qty: updated[id].qty - 1 };
      } else {
        delete updated[id];
      }
      return updated;
    });
  }, []);

  const deleteFromCart = useCallback((id) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems({});
    setAppliedOfferId(null);
  }, []);

  const totalItems = useMemo(
    () => Object.values(cartItems).reduce((sum, item) => sum + item.qty, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () =>
      Object.values(cartItems).reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      ),
    [cartItems],
  );

  const appliedOffer = useMemo(
    () => CART_OFFERS.find((o) => o.id === appliedOfferId) || null,
    [appliedOfferId],
  );

  const offerEligible =
    appliedOffer != null && totalPrice >= appliedOffer.minCart;

  const cartDiscount = useMemo(() => {
    if (!offerEligible || !appliedOffer) return 0;
    return Math.min(appliedOffer.discount, totalPrice);
  }, [offerEligible, appliedOffer, totalPrice]);

  useEffect(() => {
    if (!appliedOfferId) return;
    const o = CART_OFFERS.find((x) => x.id === appliedOfferId);
    if (!o || totalPrice < o.minCart) setAppliedOfferId(null);
  }, [totalPrice, appliedOfferId]);

  const applyOffer = useCallback(
    (offerId) => {
      const o = CART_OFFERS.find((x) => x.id === offerId);
      if (!o) return false;
      const sub = Object.values(cartItems).reduce(
        (s, i) => s + i.price * i.qty,
        0,
      );
      if (sub < o.minCart) return false;
      setAppliedOfferId(offerId);
      return true;
    },
    [cartItems],
  );

  const removeAppliedOffer = useCallback(() => setAppliedOfferId(null), []);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      deleteFromCart,
      clearCart,
      totalItems,
      totalPrice,
      cartOffers: CART_OFFERS,
      appliedOfferId,
      appliedOffer: offerEligible ? appliedOffer : null,
      cartDiscount,
      applyOffer,
      removeAppliedOffer,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      deleteFromCart,
      clearCart,
      totalItems,
      totalPrice,
      appliedOfferId,
      appliedOffer,
      offerEligible,
      cartDiscount,
      applyOffer,
      removeAppliedOffer,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
