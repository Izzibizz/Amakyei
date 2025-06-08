import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      loggedIn: false,
      loggedOut: false,
      showPopupMessage: false,
      userId: "",
      accessToken: "",
      loadingUser: false,
      loginError: false,
      signUpError: false,
      signedUp: false,
      signupMessage: "",
      loginMessage: "",

      setLoggedIn: () => set({ loggedIn: true, loggedOut: false }),
      setShowPopupMessage: (input) => set({ showPopupMessage: input }),
      setLoggedOut: () =>
        set({
          loggedOut: true,
          loggedIn: false,
          userId: "",
          accessToken: "",
          loginMessage: "",
          showPopupMessage: true,
        }),
      setLoginError: (input) => set({ loginError: input }),

      loginUser: async (userName, password) => {
        set({ loadingUser: true, loginError: false, loggedIn: false });
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
              loginMessage: data.message,
              loggedIn: true,
              loggedOut: false,
              showPopupMessage: true,
            });
          }
        } catch (error) {
          console.error("error in login:", error);
          set({ error: error, loginError: true, showPopupMessage: true });
        } finally {
          set({ loadingUser: false });
        }
      },
    }),
    {
      name: "User-storage",
    }
  )
);
