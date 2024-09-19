import { create } from "zustand";

export const useProjectsStore = create((set, get) => ({
  projectsData: [],
  error: null,
  loadingProjects: false,
  loadingUpload: false,
  uploadError: false,
  uploadSuccessful: false,
  headerVisibilityChange: false,
  darkTextNeeded: false,
  listIsVisible: false,
  laptopView: false,

  setUploadSuccessful: () => set({ uploadSuccessFul: true }),
  setHeaderVisibilityChange: (input) => set({ headerVisibilityChange: input }),
  setDarkTextNeeded: (input) => set({ darkTextNeeded: input}),
  setListIsVisible: (input) => set({ listIsVisible: input }),
  setLaptopView: (input) => set({ laptopView: input }), 

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

  uploadNewProject: async (title, year, category, description, credits, images, video ) => {
    set({ loadingUpload: true, error: null, uploadError: false, uploadSuccessful: false });
    const URL = "https://amakyei.onrender.com/projects/newProject";
    try {
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
          title: title,
          year: year,
          category: category,
          description: description,
          credits: credits,
          images: images,
          video: video
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("could not fetch");
      }
      const data = await response.json();
    console.log("Project created successfully:", data);

    const { fetchProjects } = get();
    await fetchProjects();

    set({ 
      uploadSuccessful: true,
      showPopupMessage: true, 
    });
    } catch (error) {
      console.error("error uploading:", error);
      set({ error: error, uploadError: true, showPopupMessage: true });
    } finally {

      set({ loadingUpload: false });
    }
  },
}));
