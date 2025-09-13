import { defineStore } from 'pinia'
import { ref } from 'vue'

//define an auth store
export const useAuthStore = defineStore('auth', () => {
  //holds current user object or null if not signed in
  const user = ref(null);

  //update user state and add to local storage
  function login(userData) {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  //clear state and remove state from local storage
  function logout() {
    user.value = null;
    localStorage.removeItem('user');
  }

  //load user from local storage
  function loadFromStorage() {
    const stored = localStorage.getItem('user');
    if (stored) {
      user.value = JSON.parse(stored);
    }
  }

  //initialize user state when store is created
  loadFromStorage();

  //export state and actions to other components
  return {
    user,
    login,
    logout,
    loadFromStorage,
  }
})
