import axios from "axios";

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem("RefreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.get("http://127.0.0.1:5555/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      return response.data.token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const fetchWithAuth = async (url, method = "GET", data = null) => {
  let token = getAuthToken();

  const config = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(method === "POST" && { "Content-Type": "multipart/form-data" }),
    },
    ...(data && { data }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newToken = await refreshAuthToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await axios(config);
        return retryResponse.data;
      } else {
        throw new Error("Failed to refresh token, please log in again.");
      }
    } else {
      throw new Error("Request failed: " + error.message);
    }
  }
};
