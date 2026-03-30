/** Default admin login (override with Vite env in production). */
export const ADMIN_LOGIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL || "admin@dawaminute.com";
export const ADMIN_LOGIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
