import usersData from '@/services/mockData/users.json';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for users
let users = [...usersData];

export const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      Id: Math.max(...users.map(u => u.Id)) + 1,
      ...userData,
      avatar: null,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, updateData) {
    await delay(300);
    const userIndex = users.findIndex(u => u.Id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...users[userIndex] };
  },

  async delete(id) {
    await delay(300);
    const userIndex = users.findIndex(u => u.Id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users.splice(userIndex, 1);
    return { success: true };
  }
};