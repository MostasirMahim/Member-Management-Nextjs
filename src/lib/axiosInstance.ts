import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    if (status && typeof window !== "undefined") {
      switch (status) {
        case 401:
          if (currentPath !== "/login") {
            window.location.replace("/login?expired=true");
          }
          break;

        case 403:
          window.location.replace("/unauthorized");
          break;

        case 405:
          window.location.replace("/");
          break;
        
        case 500:
          window.location.replace(`/error?code=500`);
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
