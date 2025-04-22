<template>
    <li class="tvd__column__item">
      <button class="tvd__add-btn" @click.prevent="$emit('show-add-list')">
        <h6>{{ addSectionTitle }}</h6>
      </button>
    </li>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  
  defineProps({
    addSectionTitle: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['show-add-list']);
  </script>