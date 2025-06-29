import axios from "axios";
import { toast } from "react-toastify";


const apiClient = axios.create({
  withCredentials: true,
  baseURL: process.env.API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("request Error:", error);
    return Promise.reject(error);
  }
);
// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    interface ResponseData {
      message?: string;
    }
    const data = response.data as ResponseData;
    if (data.message) {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      // Backend is down or unreachable
      console.error("Backend is down or disconnected.");
      toast.error("Could not connect to the server. Please check your connection.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } else {
      // API responded with an error status
      console.error(error.response.data || error.response);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
