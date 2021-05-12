import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ElLoadingComponent } from "element-ui/types/loading";

const service = axios.create({
  baseURL: "/api", // url = base url + request url
  timeout: 200000,
  withCredentials: true, // send cookies when cross-domain requests
}) as AxiosInstance;

// Request interceptors
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service.request;
