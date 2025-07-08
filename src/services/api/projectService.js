import projectsData from '@/services/mockData/projects.json';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for projects
let projects = [...projectsData];

export const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(400);
    const newProject = {
      Id: Math.max(...projects.map(p => p.Id)) + 1,
      ...projectData,
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
      members: [
        {
          Id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          avatar: null
        }
      ]
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updateData) {
    await delay(300);
    const projectIndex = projects.findIndex(p => p.Id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...projects[projectIndex] };
  },

  async delete(id) {
    await delay(300);
    const projectIndex = projects.findIndex(p => p.Id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    projects.splice(projectIndex, 1);
    return { success: true };
  }
};