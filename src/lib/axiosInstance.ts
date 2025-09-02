import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "http://192.168.0.102:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
