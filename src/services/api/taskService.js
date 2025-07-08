import tasksData from '@/services/mockData/tasks.json';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for tasks
let tasks = [...tasksData];

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async getByProject(projectId) {
    await delay(300);
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.Id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...tasks[taskIndex] };
  },

  async delete(id) {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.Id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    tasks.splice(taskIndex, 1);
    return { success: true };
  }
};