
<script setup>

//receives a single card object
defineProps(['card'])
defineEmits(['edit', 'delete', 'edit-country'])

</script>


<template>
  <!--Card Container with Responsive Styles-->
  <div class="p-6 rounded-2xl shadow-lg border-indigo-200 border group transition-transform duration-500 md:border-0 md:flex md:items-center md:justify-between md:shadow-none md:p-0 ">

    <!--Content Displaying Card Details-->
    <div class="flex justify-between items-start md:w-full">
      
      <div class="grid grid-cols-1 md:grid-cols-5 text-white text-l md:text-x md:w-full  md:py-4">

        <!--Parameter Key-->
        <div class="flex gap-4 text-l text-white md:flex-col justify-start">
          <div class="mb-2 font-bold whitespace-nowrap md:text-2xl md:text-slate-400 md:font-normal md:hidden">
            Parameter Key:
          </div>
          <div class="mb-2 font-light md:text-xs ">
            {{ card.key }}
          </div>
        </div>

        <!--Value(uses country specific version if provided or fallback to default value)-->
        <div class="flex gap-2 text-l text-white md:flex-col justify-start ">
          <div class="mb-2 font-bold whitespace-nowrap md:text-2xl md:text-slate-400 md:font-normal md:hidden">
            Value:
          </div>
          <div class=" mb-2 font-light md:text-xs ">
            {{ card.countryVersion?.default ?? card.value }}
          </div>
        </div>

        <!--Description-->
        <div class="flex gap-2 text-l text-white md:flex-col md:col-span-2">
          <div class="mb-2 font-bold whitespace-nowrap md:text-2xl md:text-slate-400 md:font-normal md:hidden">
            Description:
          </div>
          <div class=" mb-2 font-light md:text-xs">
            {{ card.description }}
          </div>
        </div>

        <!--Creation Date-->
        <div class="flex gap-2 text-l  text-white md:flex-col">
          <div class="mb-2 font-bold whitespace-nowrap md:text-2xl md:text-slate-400 md:font-normal md:hidden">
            Create Date:
          </div>
          <div class=" mb-2 font-light md:text-xs">
            {{card.createdDate}}
          </div>
        </div>
      </div>
    </div>

    <!--Action Buttons-->
    <div class="flex justify-center pt-5 border-t border-indigo-600/30 md:border-0 md:justify-between md:pt-0">
  
      <div class="flex space-x-3 transition-opacity duration-300 font-medium text-m">
        <button @click="$emit('edit', card)" class="text-indigo-200 hover:text-white px-3 py-1 bg-blue-600 rounded hover:bg-indigo-600 transition md:text-sm">
          Edit
        </button>
        <button @click="$emit('edit-country', card)" class="text-indigo-200 hover:text-white px-3 py-1 bg-blue-400 rounded hover:bg-blue-600 transition md:text-sm">
          Country
        </button>
        <button @click="$emit('delete', card.id)" class="text-indigo-200 hover:text-white px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition md:text-sm">
          Delete
        </button>
      </div>

    </div>
  </div>
</template>


