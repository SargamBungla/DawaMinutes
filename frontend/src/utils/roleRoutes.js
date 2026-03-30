export const getDefaultRouteByRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase();

  if (normalizedRole === "delivery" || normalizedRole === "rider")
    return "/delivery";

  return "/";
};
