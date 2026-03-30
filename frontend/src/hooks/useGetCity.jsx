import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function useGetCity() {
  const { user, setCity, setAddress } = useAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();

          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "Unknown";

          const parts = [
            data.address.neighbourhood || data.address.suburb,
            data.address.road,
            data.address.city || data.address.town,
            data.address.postcode,
          ].filter(Boolean);

          const fullAddress = parts.join(", ");

          setCity(cityName);
          setAddress(fullAddress);
          console.log("City:", cityName);
          console.log("Full Address:", fullAddress);
        } catch (error) {
          console.log("Failed:", error);
          setCity(null);
        }
      },

      (error) => {
        console.log("Location denied:", error.message);
        setCity(null);
      },
    );
  }, [user]);
}

export default useGetCity;
