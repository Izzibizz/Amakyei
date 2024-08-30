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
      userId: "",
      accessToken: "",

      setLoggedIn: () => set({ loggedIn: true, loggedOut: false }),
      setShowPopupMessage: (input) => set({ showPopupMessage: input }),
      setLoggedOut: () => set({ loggedOut: true, loggedIn: false, userId: "", accessToken: "",}),
      setAutomaticLogOut: () => set({ automaticLogOut: true, loggedOut: true, loggedIn: false }),
      setBackgroundColor: (input) => set({ backgroundColor: input }),
      setTextColor: (input) => set({ textColor: input }),


      loginUser: async (userName, password) => {
        set({ loadingUser: true, loginError: false });
        const URL_login = "https://amakyei.onrender.com/users/login";
        try {
          const response = await fetch(URL_login, {
            method: "POST",
            body: JSON.stringify({
              userName: userName,
              password: password,
            }),
            headers: { "Content-Type": "application/json" },
          });
          if (!response.ok) {
            throw new Error("could not fetch");
          }
          const data = await response.json();

          if (data.accessToken) {
            set({
              userId: data.id,
              accessToken: data.accessToken,
            });
            await get().fetchUser(data.id, data.accessToken);
          }
        } catch (error) {
          console.error("error in login:", error);
          set({ error: error, loginError: true });
        } finally {
          /*  fetchUser(userId, accessToken); */
          set({ loadingUser: false });
        }
      },

    }),
    {
        name: "User-storage",
      }
    )
  );
  