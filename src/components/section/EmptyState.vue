<template>
    <li class="tvd__card__empty">
      <p>Drop cards here</p>
    </li>
  </template>
  
  <script setup>
  // No props or emits needed
  </script>
  
  <style scoped>
  .tvd__card__empty {
    border: 2px dashed #ccc;
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 8px;
    text-align: center;
    color: #999;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tvd__card__empty p {
    margin: 0;
  }
  </style>