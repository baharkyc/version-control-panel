<script setup>

import { ref, onUnmounted, onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const dropdownOpen = ref(false);
const authStore = useAuthStore();

const isLoggedIn = computed(() => !!authStore.user);

//close dropdown when clicked outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

const handleLogout = () => {
  dropdownOpen.value = false
  authStore.logout();
  alert('Logged out successfully!')
  router.push('/signin');
}

//add/remove click listener on mount/unmount
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<template>
  <!--Sticky Header-->
  <header class="sticky top-0 z-50 bg-background-color">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background-color">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center ">
              <img
                src="../assets/logo.png"
              />
            </div>
          </router-link>
        </div>
        
        <!-- User Dropdown Menu-->
        <div class="relative">
          <button 
            @click="dropdownOpen = !dropdownOpen"
            class="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all duration-200 border border-transparent hover:border-primary-500/30"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <svg class="hidden md:block w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            
            <!--Dropdown Toggle Icon-->
            <svg 
              class="hidden md:block w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': dropdownOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            <svg 
                class="md:hidden w-6 h-6 transition-transform duration-200"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- Dropdown Menu Content-->
          <transition>
            <div 
              v-if = "dropdownOpen"
              class="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border z-50 bg-background-color border-slate-500"
            >
              <div class="py-2 ">

                <!-- User Info (when logged in) -->
                <div v-if="isLoggedIn" class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div class="text-sm text-slate-200">
                    {{ authStore.user.email }}
                  </div>
                </div>
                
                
                <!-- Menu Item -->
                <div class="py-1 ">
                  <template v-if="isLoggedIn">
                      <div class="border-t border-primary-500/20 my-1 opacity-20">
                      </div>

                      <!-- Logout Button -->
                      <button 
                          @click="handleLogout"
                          class="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                          <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                          </svg>
                          Logout
                      </button>

                  </template>
                  
                  <template v-else>
                    <!--Login Link-->
                    <router-link 
                      to="/signin"
                      @click="dropdownOpen = false"
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700/50 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Login
                    </router-link>
                  </template>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    
  </header>
</template>

