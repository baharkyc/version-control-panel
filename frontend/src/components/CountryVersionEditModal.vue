<script setup>
import { ref, watch, reactive } from 'vue';
import { API_BASE_URL } from "../constants";

const props = defineProps({
  card: Object,
  token: String
});

const emit = defineEmits(['close', 'saved']);

const defaultValue = ref('');
const countryOverrides = reactive({}); 

watch(
  () => props.card,
  (newCard) => {
    if (newCard) {
        defaultValue.value = newCard.countryVersion?.default || '';

        Object.keys(countryOverrides).forEach(key => delete countryOverrides[key]);

        const version = newCard.countryVersion || {};

        Object.entries(version).forEach(([key, val]) => {
        if (key !== 'default') {
            countryOverrides[key] = val;
        }
      });
    }
  },
  { immediate: true }
);


function addCountry() {
  const newCountry = prompt('Enter country code (e.g. TR)');
  if (newCountry) {
    const code = newCountry.trim().toUpperCase();
    if (code && !countryOverrides[code]) {
      countryOverrides[code] = '';
    }
  }
}

function removeCountry(country) {
  delete countryOverrides[country];
}

async function save() {
    
  const newCountryVersion = {
    default: defaultValue.value,
    ...countryOverrides,
  };

  const updatedCard = {
    ...props.card,
    countryVersion: newCountryVersion,
    version: props.card.version,
  };

  console.log("Saving updated card id:", updatedCard.id);

  try {
    const res = await fetch(`${API_BASE_URL}/api/parameters/${updatedCard.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`, // token from parent component
      },
      body: JSON.stringify(updatedCard),
    });

    if (!res.ok) {
      alert('Failed to save country version');
      return;
    }

    const updatedResponse = await res.json();

    emit('saved', updatedResponse.updatedParameter);
  } catch (error) 
  {
    alert('Error saving country version');
    console.error(error);
  }
}

</script>


<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
    >
      <div class="text-xl font-semibold mb-4">
        Edit Country Versions:
      </div>
      <div class="text-l font-normal mb-4">
        {{ props.card.key }}
      </div>

      <label class="block font-medium mb-1">Default Value</label>
      <input
        v-model="defaultValue"
        type="text"
        class="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

        <div
        v-for="(val, country) in countryOverrides"
        :key="country"
        class="mb-3"
        >
        <label class="block font-medium mb-1">{{ country }}</label>
        <div class="flex items-center gap-2">
            <input
            v-model="countryOverrides[country]"
            type="text"
            class="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
            @click="removeCountry(country)"
            class="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded border border-red-600 hover:bg-red-100 transition"
            aria-label="Remove country override"
            >
            &times;
            </button>
        </div>
        </div>

      <button
        @click="addCountry"
        class="mb-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
      >
        + Add Country
      </button>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          @click="save"
          class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
