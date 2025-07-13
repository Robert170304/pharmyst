import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAuthCookie, setAuthCookie, removeAuthCookie } from "@/lib/auth";

interface UserData {
  id: string;
  pharmacyName: string;
  email: string;
  token: string;
  ownerName: string;
  phone: string;
  address: { location: string; lat: number; lng: number };
  licenseNumber: string;
}

interface AppState {
  userData: UserData;
  setUserData: (userData: UserData) => void;
  logout: () => void;
  shouldRedirect: boolean;
  triggerRedirect: () => void;
  clearRedirect: () => void;
  initializeAuth: () => void;
}

const initialUserData: UserData = {
  id: "",
  pharmacyName: "",
  email: "",
  token: "",
  ownerName: "",
  phone: "",
  licenseNumber: "",
  address: { location: "", lat: 0, lng: 0 },
};

const useAppStore = create(
  persist<AppState>(
    (set, get) => ({
      shouldRedirect: false,
      userData: initialUserData,
      setUserData: (userData) => {
        set({ userData });
        // Sync with cookie
        if (userData.token) {
          setAuthCookie(userData.token);
        }
      },
      logout: () => {
        set({ userData: initialUserData });
        removeAuthCookie();
      },
      triggerRedirect: () => set({ shouldRedirect: true }),
      clearRedirect: () => set({ shouldRedirect: false }),
      initializeAuth: () => {
        // Check for existing cookie on app initialization
        const cookieToken = getAuthCookie();
        const currentUserData = get().userData;

        if (cookieToken && !currentUserData.token) {
          // If we have a cookie but no token in store, we need to re-authenticate
          // This could trigger a token refresh or redirect to login
          set({ shouldRedirect: true });
        }
      },
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
);

export default useAppStore;
