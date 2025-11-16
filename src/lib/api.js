const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

import axios from "axios";

// In-memory storage for access token
let accessToken = null;

// Create axios instance with base URL and credentials support
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add the auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding auth header for login and refresh token requests
    if (
      config.url?.includes("/user/login") ||
      config.url?.includes("/user/register") ||
      config.url?.includes("/user/refresh-token")
    ) {
      return config;
    }

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already refreshing the token, add the request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // If this is a refresh token request and it fails, log out
      if (
        originalRequest.url.includes("/user/refresh-token") ||
        originalRequest.url.includes("/user/login") ||
        originalRequest.url.includes("/user/register")
      ) {
        // Clear auth data and redirect to login
        accessToken = null;
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Set the retry flag and start token refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Make request to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/user/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
            skipAuthRefresh: true, // Custom flag to prevent infinite loop
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Store the new tokens
        accessToken = newAccessToken;
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Update the authorization header
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // Process any queued requests
        processQueue(null, accessToken);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        processQueue(error, null);
        accessToken = null;
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to get auth headers
export const getAuthHeader = () => {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export const api = {
  async register(userData) {
    const response = await axiosInstance.post("/user/register", userData);

    // Store tokens if they exist in the response
    if (response.data.accessToken) {
      accessToken = response.data.accessToken;
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response.data;
  },

  async login(credentials) {
    try {
      const response = await axiosInstance.post("/user/login", credentials);

      // Store tokens
      if (response.data.accessToken) {
        accessToken = response.data.accessToken;
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout() {
    // Clear tokens
    accessToken = null;
    localStorage.removeItem("refreshToken");

    // // Redirect to login page
    // window.location.href = "/login";
  },

  // Check if user is authenticated
  async checkAuth() {
    try {
      const response = await axiosInstance.get("/user/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user data
  async getCurrentUser() {
    // If no access token, try to refresh
    if (!accessToken) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      try {
        // Attempt to refresh the token
        const response = await axiosInstance.post("/user/refresh-token", {
          refreshToken: refreshToken,
        });

        if (!response.data.accessToken) {
          // If no new access token, clear everything
          accessToken = null;
          localStorage.removeItem("refreshToken");
          return null;
        }

        // Update access token
        accessToken = response.data.accessToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        accessToken = null;
        localStorage.removeItem("refreshToken");
        return null;
      }
    }

    // If we get here, we have a valid access token or just refreshed it

    try {
      const base64Url = accessToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));
      return payload;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired() {
    const user = this.getCurrentUser();
    if (!user || !user.exp) return true;

    // Convert expiration time to milliseconds
    const expiryTime = user.exp * 1000;
    return Date.now() >= expiryTime;
  },
};
