<script setup>
import { ref, reactive } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../store/auth';

//emits success to parent when login is successful
const emit = defineEmits(['login-success'])

const authStore = useAuthStore();

//reactive state for form input
const formData = reactive({
  email: '',
  password: ''
})

//reactive state for validation errors
const errors = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const isSubmitting = ref(false)

//form valdiation
const validateForm = () => {
  let isValid = true
  
  errors.email = ''
  errors.password = ''
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailPattern.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

//handle form submission
const handleSubmit = async () => {

  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    //Firebase login
    const userCredential = await signInWithEmailAndPassword( auth, formData.email, formData.password);
    
    //retrieve firebase ID token
    const idToken = await userCredential.user.getIdToken();

    //store user info Pinia store
    authStore.login({
      email: formData.email,
      token: idToken,
      uid: userCredential.user.uid
    })

    //emit login success event
    emit('login-success', {
      email: formData.email,
      token: idToken      
    })

    //reset form
    formData.email = '';
    formData.password = '';
    
  } catch (error) {
    console.error('Wrong email or password.', error);
    alert('Wrong email or password.');
    formData.email = '';
    formData.password = '';

  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto ">
    <div class=" p-8 ">
      <div class="text-center mb-8">
        <img
        class="p-8"
         src="../assets/logo.png"
        />
     
        <p class="text-indigo-400 text-xl">Please sign in</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <div >
        <!-- Email  -->
            <div>
                <div >
                    <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    required
                    placeholder="Email address"
                    class="block w-full border rounded-t-xl border border-gray-700 bg-gray-800 py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    :class="errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''"
                    />
                </div>
                <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                    {{ errors.email }}
                </p>
            </div>

            <!-- Password Field -->
            <div class="relative">
                <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Password"
                class="block w-full border rounded-b-xl border border-gray-700 bg-gray-800 py-2 px-4 text-white placeholder-gray-400 focus:outline-none  focus:border-pink-500 "
                :class="errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''"
                />
                <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                <svg
                    v-if="showPassword"
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                </svg>
                <svg
                    v-else
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">
                {{ errors.password }}
            </p>
        </div>

       
        <!-- Sign In Button -->
        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
