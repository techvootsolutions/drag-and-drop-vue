<template>
  <li class="tvd__card__item" v-if="isAddingList">
    <button class="tvd__close_section" @click="closeNewList">
      <i class="tvd__icons fa-solid fa-xmark"></i>
    </button>
    <input
      v-model="listTitle"
      type="text"
      placeholder="Section Title"
      class="tvd__add-input"
    />
    <button class="tvd__add-btn" @click.prevent="addList">
      <h6>{{ addSectionTitle }}</h6>
    </button>
  </li>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  isAddingList: {
    type: Boolean,
    required: true
  },
  addSectionTitle: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close-new-list', 'add-list']);

const listTitle = ref("");

const closeNewList = () => {
  emit('close-new-list');
};

const addList = () => {
  if (listTitle.value.trim() !== "") {
    emit('add-list', listTitle.value);
    listTitle.value = ""; // Reset the input
  }
};
</script>
