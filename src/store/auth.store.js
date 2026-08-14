// front end state management system for user authentication
// managers user sate and authenticates each requests with token

import { create } from "zustand";
import {
  login as loginUser,
  register as registerUser,
  getMe,
} from "../services/auth.service";
import { connectSocket, disconnectSocket } from "../api/socket";

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  authenticated: false,
  initialized: false,

  login: async (credentials) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const data = await loginUser(credentials);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        authenticated: true,
        loading: false,
        error: null,
      });

      connectSocket();

      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });

      throw error;
    }
  },

  register: async (userData) => {
    console.log('[authStore.register] called with:', JSON.stringify({ ...userData, password: '***' }));
    set({
      loading: true,
      error: null,
    });

    try {
      console.log('[authStore.register] calling registerUser service...');
      const data = await registerUser(userData);
      console.log('[authStore.register] service returned:', data);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        authenticated: true,
        loading: false,
        error: null,
      });

      connectSocket();

      return data;
    } catch (error) {
      console.error('[authStore.register] ERROR:', error?.response?.data || error?.message || error);
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });

      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    disconnectSocket();

    set({
      user: null,
      token: null,
      loading: false,
      error: null,
      authenticated: false,
    });
  },

  fetchCurrentUser: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getMe();

      set({
        user: data.user,
        authenticated: true,
        loading: false,
      });

      connectSocket();

      return data.user;
    } catch (error) {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        authenticated: false,
        loading: false,
        error: error.response?.data?.message || error.message,
      });
    }
  },

  init: async () => {
    set({ loading: true });
    const token = localStorage.getItem('token');

    if (!token) {
      set({ loading: false, initialized: true });
      return;
    }

    set({ token });

    await get().fetchCurrentUser();

    set({ initialized: true });
  },
}));

export default useAuthStore;