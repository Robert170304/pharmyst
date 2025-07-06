import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  id: string;
  pharmacyName: string;
  email: string;
  token: string;
  ownerName: string;
}

interface AppState {
  userData: UserData;
  setUserData: (userData: UserData) => void;
  logout: () => void;
  shouldRedirect: boolean;
  triggerRedirect: () => void;
  clearRedirect: () => void;
}

const initialUserData: UserData = {
  id: "",
  pharmacyName: "",
  email: "",
  token: "",
  ownerName: "",
};

const useAppStore = create(
  persist<AppState>(
    (set) => ({
      shouldRedirect: false,
      userData: initialUserData,
      setUserData: (userData) => set({ userData }),
      logout: () => set({ userData: initialUserData }),
      triggerRedirect: () => set({ shouldRedirect: true }),
      clearRedirect: () => set({ shouldRedirect: false }),
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        userData: state.userData,
        setUserData: state.setUserData,
      }),
    }
  )
);

export default useAppStore;
