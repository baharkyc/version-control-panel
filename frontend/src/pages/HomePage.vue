<script setup>
import Card from '../components/Card.vue';
import Header from '../components/Header.vue';
import { onMounted, reactive, ref } from 'vue';
import { API_BASE_URL } from "../constants";
import AddParameterForm from '../components/AddParameterForm.vue';
import CountryVersionEditModal from '../components/CountryVersionEditModal.vue';

const storedUser = JSON.parse(localStorage.getItem('user'));
const token = storedUser?.token;

if (!token) {
  console.error('No auth token found');
};

const cards = ref([]);
const editingCard = ref(null);
const showCountryModal = ref(false);
const selectedCardForCountry = ref(null);

const fetchCards = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/parameters`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch cards:', res.statusText);
      return;
    }
    const data = await res.json();
    cards.value = data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const resetForm = () => {
  editingCard.value = null;
};

const handleEdit = (card) => {
  editingCard.value = card;
};

const handleDelete = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/parameters/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error deleting parameter:', errorData.message);
      return;
    }

    await fetchCards();
  } catch (error) {
    console.error('DELETE request failed:', error);
  }
};

const addCard = async (formValues) => {
  if (!formValues.key || !formValues.value || !formValues.description) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/parameters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        key: formValues.key,
        value: formValues.value,
        description: formValues.description,
        version: 0
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error creating parameter:', errorData.message);
      return;
    }

    await fetchCards();
    resetForm();
  } catch (error) {
    console.error('POST request failed:', error);
  }
};

const updateCard = async (formValues) => {

  if (!editingCard.value) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/parameters/${editingCard.value.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify({
        key: formValues.key,
        value: formValues.value,
        description: formValues.description,
        version: formValues.version,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      
      if (res.status === 409) {
        alert("This parameter has been edited by someone else. Please refresh the page and try again.")
      } else {
        alert("Update failed. Please refresh the page and try again.")
      }

      console.error('Error updating parameter:', errorData.message);
      return;
    }

    await fetchCards();
    resetForm();

  } catch (error) {
    console.error('Update failed:', error);
    alert("Update failed. Please check your internet connection.");
  }
};

const handleFormSubmit = async (formValues) => {
  if (editingCard.value) {
    await updateCard(formValues);
  } else {
    await addCard(formValues);
  };
};

const handleFormCancel = () => {
  resetForm();
};

const handleEditCountry = (card) => {

  selectedCardForCountry.value = JSON.parse(JSON.stringify(card));
  showCountryModal.value = true;
}

const handleCountrySaved = (updatedCard) => {

  const index = cards.value.findIndex(c => c.id === updatedCard.id);
  if (index !== -1) {
    cards.value[index] = updatedCard;
  } else {
    
    fetchCards();
  }
  showCountryModal.value = false;
};


onMounted(() => {
  fetchCards();
});

</script>

<template>
  <div class="flex flex-col">
    <Header></Header>

    <!-- Panel -->
    <div class="p-8">
      <div class="grid grid-cols-1 px-12 gap-8 md:pt-0 md:gap-2">
        <div
          class="hidden md:grid gap-4 md:grid-cols-5 text-xl text-slate-400 font-normal mb-4 md:pr-60"
        >
          <div class="col-span-1">Parameter Key</div>
          <div class="col-span-1">Value</div>
          <div class="col-span-2">Description</div>
          <div class="col-span-1">Create Date</div>
        </div>

        <Card
          v-for="card in cards.filter(c => c.id !== 'support_email')"
          :key="card.id"
          :card="card"
          @edit="handleEdit"
          @delete="handleDelete"
          @edit-country="handleEditCountry"
        />

      </div>
    </div>

    <!-- Add / Edit Form -->
    <div class="px-20 pb-16">
      <AddParameterForm
        :editingCard="editingCard"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </div>

    <CountryVersionEditModal
      v-if="showCountryModal"
      :card="selectedCardForCountry"
      :token="token"
      @close="showCountryModal = false"
      @saved="handleCountrySaved"
    />
  </div>
</template>
