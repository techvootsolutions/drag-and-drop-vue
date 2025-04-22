<template>
    <div class="tvd__column__title--wrapper">
      <h2>{{ title }}</h2>
      <i
        class="tvd__column__item--cta fa-solid fa-plus"
        @click.prevent="$emit('show-add-card')"
      ></i>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  
  defineProps({
    title: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['show-add-card']);
  </script>
  
  <style scoped>
  .tvd__column__title--wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-bottom: 8px;
  }
  
  .tvd__column__title--wrapper h2 {
    font-size: 18px;
    margin: 0;
  }
  
  .tvd__column__item--cta {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    color: #6b778c;
    font-size: 14px;
  }
  
  .tvd__column__item--cta:hover {
    background-color: #e4e6ea;
  }
  </style>