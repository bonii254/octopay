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
          .then(() => axios(originalRequest))
          .catch((err) => Promise.reject(err));
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

    const responseData = error.response?.data;

    if (error.response?.status === 404) {
        return Promise.reject({
            status: 404,
            message: responseData?.message || responseData?.error || "Record not found",
            errors: responseData?.errors || null
        });
    }

    if (responseData?.errors) {
      return Promise.reject(responseData.errors);
    }

    let message = "Something went wrong";
    if (error.response) {
       message = responseData?.error || responseData?.message || `Server Error: ${error.response.status}`;
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
  createWithFile = (url: string, data: FormData, config?: AxiosRequestConfig): Promise<any> => {
    return axios.post(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": undefined,
      },
    });
  };
  update = (url: string, data: any, config?: AxiosRequestConfig): Promise<any> => {
    return axios.patch(url, data, config);
  };
  patchWithFile = (url: string, data: FormData, config?: AxiosRequestConfig): Promise<any> => {
    return axios.patch(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": undefined,
      },
    });
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