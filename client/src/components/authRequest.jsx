import axios from "axios";
import { getAuthToken, refreshAuthToken } from "./auth";

export const MakeAuthRequests = async (
  url,
  method = "GET",
  data = {},
  navigate
) => {
  let token = getAuthToken();

  if (!token) {
    console.error("No token found");
    navigate("/login");
    return null;
  }

  const config = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": method === "POST" ? "application/json" : undefined,
    },
    ...(method === "POST" && { data: JSON.stringify(data) }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          const newToken = await refreshAuthToken();

          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            const retryResponse = await axios(config);
            return retryResponse.data;
          } else {
            if (navigate) navigate("/login");
            return null;
          }
        } else {
          throw new Error("Request failed: " + error.message);
        }
      } else {
        console.error("Network Error:", error.message);
        return { error: "Network Error: Unable to reach the server." };
      }
    } else {
      console.error("Unexpected Error:", error);
      throw error;
    }
  }
};
