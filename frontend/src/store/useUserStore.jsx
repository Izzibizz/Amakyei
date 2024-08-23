import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      loggedIn: false,
      showPopupMessage: false,
      loggedOut: false,
      automaticLogOut: false,
      backgroundColor: "#5d805f",
      textColor: "#FFFF",

      setLoggedIn: () => set({ loggedIn: true, loggedOut: false }),
      setShowPopupMessage: (input) => set({ showPopupMessage: input }),
      setLoggedOut: () => set({ loggedOut: true, loggedIn: false }),
      setAutomaticLogOut: () => set({ automaticLogOut: true, loggedOut: true, loggedIn: false }),
      setBackgroundColor: (input) => set({ backgroundColor: input }),
      setTextColor: (input) => set({ textColor: input }),

    }),
    {
        name: "User-storage",
      }
    )
  );
  