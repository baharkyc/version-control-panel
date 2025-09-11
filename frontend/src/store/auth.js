import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);

  function login(userData) {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
  }

  function loadFromStorage() {
    const stored = localStorage.getItem('user');
    if (stored) {
      user.value = JSON.parse(stored);
    }
  }

  loadFromStorage();

  return {
    user,
    login,
    logout,
    loadFromStorage,
  }
})
