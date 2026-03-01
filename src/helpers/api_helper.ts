import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import config from "../config";


const { api } = config;
axios.defaults.baseURL = api.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; 

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data ? response.data : response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (originalRequest.url.includes("/login")) {
        return Promise.reject("Invalid credentials. Please try again.");
      }
      
      if (originalRequest.url.includes("/refresh")) {
        sessionStorage.removeItem("authUser");
        window.location.href = "/login"; 
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post("/refresh");

        processQueue(null);
        return axios(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        sessionStorage.removeItem("authUser");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }


    let message = "Something went wrong";
    if (error.response) {
       const data = error.response.data;
       if (data?.errors) {
         return Promise.reject(data.errors);
       }
       if (data?.error) message = data.error;
       else if (data?.message) message = data.message;
       else if (data && data.errors) message = JSON.stringify(data.errors);
    } else if (error.request) {
       message = "Network Error: Could not reach the server";
    }
    
    return Promise.reject(message);
  }
);

class APIClient {
  get = (url: string, params?: any): Promise<any> => {
    return axios.get(url, { params: params });
  };
  create = (url: string, data: any, config?: AxiosRequestConfig): Promise<any> => {
    return axios.post(url, data, config);
  };
  update = (url: string, data: any, config?: AxiosRequestConfig): Promise<any> => {
    return axios.patch(url, data, config);
  };
  put = (url: string, data: any, config?: AxiosRequestConfig): Promise<any> => {
    return axios.put(url, data, config);
  };
  delete = (url: string, config?: AxiosRequestConfig): Promise<any> => {
    return axios.delete(url, config);
  };
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

export { APIClient, getLoggedinUser };