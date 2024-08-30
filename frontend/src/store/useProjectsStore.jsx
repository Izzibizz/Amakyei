import { create } from 'zustand';

export const useProjectsStore = create((set) => ({

    projectsData: [],
    loading: false,
    error: null,

   fetchProjects: async () => {
  set({ loading: true, error: null }); // Set loading and clear error
  
  try {
    const response = await fetch('https://amakyei.onrender.com/projects', {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error('Could not fetch');
    }
    
    const data = await response.json();
    
    // Update state immutably
    set({
     
      projectsData: data.project,
    })
    
    console.log(data.project)
  } catch (error) {
    console.log('error:', error);
    set({ error: error });
  } finally {
    set({ loading: false }); // Set loading to false when done
  }
}}))
