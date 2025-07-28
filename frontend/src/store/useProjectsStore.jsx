import { create } from "zustand";
import axios from "axios";

export const useProjectsStore = create((set, get) => ({
  projectsData: [],
  pedagogData: [],
  error: null,
  loadingProjects: false,
  loadingPedagog: false,
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
  filteredProjects: [],

  setUploadSuccessful: (input) => set({ uploadSuccessful: input }),
  setUploadError: (input) => set({ uploadError: input }),
  setDeleteValidationProcess: (input) =>
    set({ deleteValidationProcess: input }),
  setDeleteConfirmed: (input) => set({ deleteConfirmed: input }),
  setLoadingDelete: (input) => set({ loadingDelete: input }),
  setDeleteSuccessful: (input) => set({ deleteSuccessful: input }),
  setDeleteError: (input) => set({ deleteError: input }),
  setEditSuccessful: (input) => set({ editSuccessful: input }),
  setEditError: (input) => set({ editError: input }),
  setHeaderVisibilityChange: (input) => set({ headerVisibilityChange: input }),
  setDarkTextNeeded: (input) => set({ darkTextNeeded: input }),
  setListIsVisible: (input) => set({ listIsVisible: input }),
  setLaptopView: (input) => set({ laptopView: input }),
  setFilteredProjects: (input) => set({ filteredProjects: input }),

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

  uploadNewProject: async (
    title,
    year,
    category,
    description,
    credits,
    uploadedImages,
    videoLink
  ) => {
    set({
      loadingUpload: true,
      error: null,
      uploadError: false,
      uploadSuccessful: false,
    });
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
          video: videoLink,
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
  deleteProjectWithId: async (projectId) => {
    set({ error: null, loadingDelete: true, deleteError: false });
    const URL = `https://amakyei.onrender.com/projects/${projectId}`;
    try {
      const response = await fetch(URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
    set({
      error: null,
      editSuccessful: false,
      loadingEdit: true,
      editError: false,
    });
    try {
      const response = await fetch(
        `https://amakyei.onrender.com/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );

      if (response.ok) {
        // Handle success
        console.log("Project updated successfully!");
        set({ editSuccessful: true, loadingEdit: false });
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
  },
    fetchPedagog: async () => {
      set({ loadingPedagog: true, error: null });
    try {
      const res = await axios.get("https://amakyei.onrender.com/pedagog");
      set({ pedagogData: res.data });
    } catch (error) {
      console.error("Error fetching pedagog data", error);
    }  finally {
      set({ loadingPedagog: false });
    }
    
  },
 updatePedagogData: async (newData) => {
  try {
    // Hämta tidigare data, om du har det i state
    const current = get().pedagogData;

    const updatedEducation = newData.education.map(item => {
      const existing = current.education.find(e => e._id === item._id);
      return existing ? { ...existing, ...item } : item; // uppdatera eller lägg till
    });

    const updatedProjects = newData.projects.map(item => {
      const existing = current.projects.find(p => p._id === item._id);
      return existing ? { ...existing, ...item } : item; // uppdatera eller lägg till
    });

    const updatedDescription = {
      ...current.description,
      ...newData.description // endast uppdatera befintlig
    };

    const payload = {
      description: updatedDescription,
      education: updatedEducation,
      projects: updatedProjects
    };

    const res = await axios.post("https://amakyei.onrender.com/pedagog", payload);
    set({ pedagogData: res.data });

  } catch (error) {
    console.error("Error updating pedagog data", error);
  }
},

 deletePedagogData: async (type, id) => {
  try {
    const res = await axios.delete("https://amakyei.onrender.com/pedagog", {
      data: { type, id }
    });
    set({ pedagogData: res.data });
  } catch (error) {
    console.error("Error deleting pedagog data", error);
  }
},


}));
