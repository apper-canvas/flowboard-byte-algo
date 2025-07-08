import commentsData from '@/services/mockData/comments.json';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for comments
let comments = [...commentsData];

export const commentService = {
  async getAll() {
    await delay(300);
    return [...comments];
  },

  async getById(id) {
    await delay(200);
    const comment = comments.find(c => c.Id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return { ...comment };
  },

  async getByTask(taskId) {
    await delay(300);
    return comments.filter(c => c.taskId === taskId).map(c => ({ ...c }));
  },

  async create(commentData) {
    await delay(400);
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      ...commentData,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    return { ...newComment };
  },

  async update(id, updateData) {
    await delay(300);
    const commentIndex = comments.findIndex(c => c.Id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    comments[commentIndex] = {
      ...comments[commentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...comments[commentIndex] };
  },

  async delete(id) {
    await delay(300);
    const commentIndex = comments.findIndex(c => c.Id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    comments.splice(commentIndex, 1);
    return { success: true };
  }
};