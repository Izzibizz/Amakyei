import { create } from "zustand";

export const useProjectsStore = create((set) => ({
  projectsData: [],
  loadingProjects: false,
  error: null,
  uploadSuccessful: false,
  headerVisibilityChange: false,
  darkTextNeeded: false,
  listIsVisible: false,

  setUploadSuccessful: () => set({ uploadSuccessFul: true }),
  setHeaderVisibilityChange: (input) => set({ headerVisibilityChange: input }),
  setDarkTextNeeded: (input) => set({ darkTextNeeded: input}),
  setListIsVisible: (input) => set({ listIsVisible: input }),

  fetchProjects: async () => {
    set({ loadingProjects: true, error: null }); // Set loading and clear error

    try {
      const response = await fetch("https://amakyei.onrender.com/projects", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Could not fetch");
      }

      const data = await response.json();

      // Update state immutably
      set({
        projectsData: data.project,
      });

      console.log(data.project);
    } catch (error) {
      console.log("error:", error);
      set({ error: error });
    } finally {
      set({ loadingProjects: false }); // Set loading to false when done
    }
  },
}));
