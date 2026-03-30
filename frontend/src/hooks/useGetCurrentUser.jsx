import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useAuth } from "../context/AuthContext";

function useGetCurrentUser() {
  const { setUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        setUser(result.data); // ← YE ADD KARO
        console.log("Current User:", result.data);
      } catch (error) {
        setUser(null); // ← YE BHI ADD KARO
        console.log("No user logged in");
      }
    };
    fetchUser();
  }, []);
}

export default useGetCurrentUser;
