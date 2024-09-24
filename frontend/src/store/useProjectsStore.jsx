import { create } from "zustand";

export const useProjectsStore = create((set, get) => ({
  projectsData: [],
  error: null,
  loadingProjects: false,
  loadingUpload: false,
  loadingDelete: false,
  uploadError: false,
  uploadSuccessful: false,
  deleteError: false,
  deleteValidationProcess: false,
  deleteconfirmed: false,
  deleteSuccessful: false,
  editSuccessful: false,
  editError: false,
  loadingEdit: false,
  headerVisibilityChange: false,
  darkTextNeeded: false,
  listIsVisible: false,
  laptopView: false,

  setUploadSuccessful: (input) => set({ uploadSuccessful: input }),
  setUploadError: (input) => set({uploadError: input }),
  setDeleteValidationProcess: (input) => set({ deleteValidationProcess: input }),
  setDeleteConfirmed: (input) => set({ deleteConfirmed: input }),
  setLoadingDelete: (input) => set({ loadingDelete: input }),
  setDeleteSuccessful: (input) => set({ deleteSuccessful: input }),
  setDeleteError: (input) => set({ deleteError: input }),
  setEditSuccessful: (input) => set({ editSuccessful: input}),
  setEditError: (input) => set({ editError: input}),
  setHeaderVisibilityChange: (input) => set({ headerVisibilityChange: input }),
  setDarkTextNeeded: (input) => set({ darkTextNeeded: input }),
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

  uploadNewProject: async (title, year, category, description, credits, uploadedImages, videoLink ) => {
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
          images: uploadedImages,
          video: videoLink
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
  deleteProjectWithId: async ( projectId ) => {
    set({ error: null, loadingDelete: true, deleteError: false });
    const URL = `https://amakyei.onrender.com/projects/${projectId}`;
    try {
      const response = await fetch(URL, {
        method: "DELETE",
      headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error("could not fetch");
      }
      const data = await response.json();
    console.log("Project successfully deleted:", data);

    const { fetchProjects } = get();
    await fetchProjects();

    set({ 
      loadingDelete: false,
      deleteSuccessful: true,
      deleteError: false,
      deleteConfirmed: false, 
    });
    } catch (error) {
      console.error("error deleting project:", error);
      set({ error: error, deleteError: true, deleteConfirmed: false });
    } finally {

      set({ loadingDelete: false });
    }
  },
   saveProjectEdits: async (projectId, input) => {
    set({ error: null, editSuccessful: false, loadingEdit: true, editError: false });
    try {
      const response = await fetch(`https://amakyei.onrender.com/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
  
      if (response.ok) {
        // Handle success
        console.log("Project updated successfully!");
        set({ editSuccessful: true, loadingEdit: false })
        const { fetchProjects } = get();
        await fetchProjects();    

      } else {
        // Handle error
        console.error("Error updating project");
        set({ error: error, editError: true, loadingEdit: false });
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
}));
