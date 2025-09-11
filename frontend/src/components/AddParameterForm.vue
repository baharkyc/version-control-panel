<script setup>
import { reactive, watch, toRefs } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  editingCard: Object,       // Düzenlenen kart objesi veya null
});

const emits = defineEmits(['submit', 'cancel']);

// formData'yi reactive yap ve dışardan editingCard değiştiğinde formu güncelle
const formData = reactive({
  key: '',
  value: '',
  description: '',
  version: 0,
});

watch(
  () => props.editingCard,
  (newVal) => {
    if (newVal) {
      formData.key = newVal.key || '';
      formData.value = newVal.value || '';
      formData.description = newVal.description || '';
      formData.version = newVal.version || 0;
    } else {
      formData.key = '';
      formData.value = '';
      formData.description = '';
      formData.version = 0;
    }
  },
  { immediate: true }
);

const onSubmit = () => {
  if (!formData.key || !formData.value || !formData.description) {
    alert('Please fill all fields.');
    return;
  }
  emits('submit', { ...formData });
};

const onCancel = () => {
  emits('cancel');
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4 md:grid md:grid-cols-6 text-sm">
    <input
      v-model="formData.key"
      placeholder="Parameter Key"
      class="md:col-span-1 rounded-md bg-gray-800 border border-gray-600 text-white px-4 py-2 md:py-1 placeholder-gray-400 focus:outline-none focus:border-pink-500"
      :disabled="!!props.editingCard"
    />
    <input
      v-model="formData.value"
      placeholder="Value"
      class="md:col-span-1 rounded-md bg-gray-800 border border-gray-600 text-white px-4 py-2 md:py-1 placeholder-gray-400 focus:outline-none focus:border-pink-500"
    />
    <input
      v-model="formData.description"
      placeholder="Description"
      class="md:col-span-3 rounded-md bg-gray-800 border border-gray-600 text-white px-4 py-2 md:py-1 placeholder-gray-400 focus:outline-none focus:border-pink-500"
    />

    <button
      v-if="props.editingCard"
      type="submit"
      class="md:col-span-1 py-2 md:py-1 bg-yellow-500 text-white font-medium rounded-md transition hover:opacity-90"
    >
      Update
    </button>

    <button
      v-if="props.editingCard"
      type="button"
      @click="onCancel"
      class="md:col-span-1 py-2 md:py-1 bg-gray-600 text-white font-medium rounded-md transition hover:opacity-90"
    >
      Cancel
    </button>

    <button
      v-else
      type="submit"
      class="md:col-span-1 py-2 md:py-1 bg-gradient-to-r from-blue-500 to-green-400 text-white font-medium rounded-md transition hover:opacity-90"
    >
      Add
    </button>
  </form>
</template>
