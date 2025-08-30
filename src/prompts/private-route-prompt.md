// lib/api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AddPurchaseData } from "../entities/AddPurchaseData";
import type { ProductData } from "../entities/ProductData";
import { useUserProfileStore } from "../stores/useUserStore";

// --- Helper Functions for Token Management ---

const getAccessToken = (): string | null => {
  return sessionStorage.getItem("accessToken");
};

export const setAccessToken = (token: string): void => {
  sessionStorage.setItem("accessToken", token);
};

const clearAccessToken = (): void => {
  sessionStorage.removeItem("accessToken");
};

const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens or other headers
apiClient.interceptors.request.use(
  async (config) => {
    // JWT Token
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF token handling
    // const csrfToken = getCSRFToken();
    // if (csrfToken && config.method !== "get") {
    //   config.headers["X-CSRFToken"] = csrfToken;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401) {
      if (isRefreshing) {
        // If we are already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/accounts/token/refresh/",
          {},
          { withCredentials: true }
        );

        // Refresh successful
        setAccessToken(data.access);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, log the user out
        clearAccessToken();
        useUserProfileStore.getState().logout();

        // Redirect to login page
        window.location.href = "/login";

        processQueue(refreshError as AxiosError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);


this is my apiClient code and this is my router

import { createBrowserRouter, RouterProvider } from "react-router-dom";

function AppRouterProvider() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      ),
      errorElement: <h1 className="text-red-500">Page Not Found</h1>,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/dashboard/productDetails",
          element: <ProductDetails />,
        },
        ....
        {
          path: "/settings/about",
          element: <About />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default AppRouterProvider;


and this is my store

// stores/userStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import apiClient from "../lib/api";
import { AxiosError } from "axios";
import type { Theme } from "../services/theme";
import { extractAxiosError } from "../utils/extractError";

export type UserRole = {
  id: string;
  name: string;
  display_name: string;
};

export type Branch = {
  id: string;
  name: string;
  location: string;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string;
  location: number;
  permissions: string[];
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    theme: Theme;
  };
};

export type CreateUserData = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  role_id: string;
  location_id: string;
  language_preference?: string;
  timezone?: string;
  theme?: Theme;
};

export type UpdateUserData = {
  first_name?: string;
  last_name?: string;
  username?: string;
  role_id?: string;
  phone?: string;
  location_id?: string;
  preferred_currency_id?: number;
  language_preference?: string;
  timezone?: string;
  theme?: Theme;
};

export type ChangePasswordData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

interface UserState {
  userProfile: UserProfile | null;
  availableRoles: UserRole[];
  loading: boolean;
  error: string | null;
  logout: () => void;
  // Actions
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: UpdateUserData) => Promise<void>;

  changePassword: (data: ChangePasswordData) => Promise<void>;
  uploadPhoto: (file: File) => Promise<string>;
  deletePhoto: () => Promise<void>;
  // Utility actions
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useUserProfileStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Initial state
      userProfile: null,
      availableRoles: [],
      loading: false,
      error: null,
      // Actions
      fetchUserProfile: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get("/accounts/users/me");
          set({ userProfile: response.data, loading: false });
        } catch (error) {
          const errorMessage = extractAxiosError(
            error,
            "Failed to fetch user profile"
          );
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      updateUserProfile: async (data: UpdateUserData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.patch("/accounts/users/me/", data);
          set({ userProfile: response.data, loading: false });
        } catch (error) {
          const errorMessage = extractAxiosError(
            error,
            "Failed to update profile"
          );
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      changePassword: async (data: ChangePasswordData) => {
        set({ loading: true, error: null });
        try {
          await apiClient.post("/accounts/auth/change-password/", data);
          set({ loading: false });
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.error ||
              error.response?.data?.old_password?.[0] ||
              error.response?.data?.new_password?.[0] ||
              "Failed to change password";
            set({ error: errorMessage, loading: false });
          }
          throw error;
        }
      },

      uploadPhoto: async (file: File): Promise<string> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append("photo", file);

          const { userProfile } = get();
          if (!userProfile) throw new Error("No current user");

          const response = await apiClient.post(
            `/accounts/users/${userProfile.id}/upload-photo/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Update current user with new avatar
          set({
            userProfile: {
              ...userProfile,
              avatarUrl: response.data.avatar_url,
            },
            loading: false,
          });

          return response.data.avatar_url;
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.error || "Failed to upload photo";
            set({ error: errorMessage, loading: false });
          }
          throw error;
        }
      },

      deletePhoto: async () => {
        set({ loading: true, error: null });
        try {
          const { userProfile: currentUser } = get();
          if (!currentUser) throw new Error("No current user");

          const response = await apiClient.delete(
            `/accounts/users/${currentUser.id}/delete-photo/`
          );

          // Update current user with new avatar
          set({
            userProfile: {
              ...currentUser,
              avatarUrl: response.data.avatar_url,
            },
            loading: false,
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            const errorMessage =
              error.response?.data?.error || "Failed to delete photo";
            set({ error: errorMessage, loading: false });
          }
          throw error;
        }
      },

      // Utility actions
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      reset: () =>
        set({
          userProfile: null,
          availableRoles: [],
          loading: false,
          error: null,
        }),
      logout() {
        set({ userProfile: null });
      },
    }),
    {
      name: "user-store",
    }
  )
);


I want you to make it such when not logged in, redirect it to login page

now bro can you make it as to check not logged in users and redirect to login page, also initialize my store userprofile and ....
and when you log in it initializes the store,


maybe some privateRoute or anything, later i would add permission based .

if you have any question or if you didn't get me well, ask before you proceed