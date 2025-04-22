<template>
  <li class="tvd__column__item" 
      :class="{ 'section-drag-over': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop">
    <!-- Section header -->
    <SectionHeader 
      :title="section.title" 
      @show-add-card="$emit('show-add-card', sectionIndex)" 
    />
    
    <!-- Cards container -->
    <ul
      class="tvd__card__list"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <!-- Card items -->
      <BoardCard
        v-for="(item, itemIndex) in section.data"
        :key="itemIndex"
        :card="item"
        :card-index="itemIndex"
        :section-index="sectionIndex"
        @drag-start="onDragStart($event, sectionIndex, itemIndex)"
        @drag-over="onDragOver($event, sectionIndex, itemIndex)"
        @drag-leave="onDragLeave"
        @internal-drop="onInternalDrop($event, sectionIndex, itemIndex)"
        @open-edit-modal="$emit('open-edit-modal', item, sectionIndex, itemIndex, $event)"
        @open-delete-modal="$emit('open-delete-modal', sectionIndex, itemIndex)"
        @add-comment="$emit('add-comment', $event)"
        @add-tag="$emit('add-tag', $event)"
        @remove-tag="$emit('remove-tag', $event)"
        @add-attachment="$emit('add-attachment', $event)"
        @remove-attachment="$emit('remove-attachment', $event)"
      />
      
      <EmptyState v-if="section.data.length === 0" />
      
      <!-- Add card form -->
      <NewCardForm
        v-if="isAddingCard"
        :section-index="sectionIndex"
        :add-card-title="addCardTitle"
        @close-card="$emit('close-card')"
        @add-card="addNewCard"
      />
    </ul>
    <!-- $emit('add-card', $event, $event[1]) -->
    <!-- Add card button -->
    <button class="tvd__add-btn" @click.prevent="$emit('show-add-card', sectionIndex)">
      <h6>{{ addCardTitle }}</h6>
    </button>
  </li>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import BoardCard from "./BoardCard.vue";
import SectionHeader from "./section/SectionHeader.vue";
import EmptyState from "./section/EmptyState.vue";
import NewCardForm from "./section/NewCardForm.vue";

const props = defineProps({
  section: {
    type: Object,
    required: true
  },
  sectionIndex: {
    type: Number,
    required: true
  },
  addCardTitle: {
    type: String,
    required: true
  },
  isAddingCard: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'show-add-card',
  'close-card',
  'add-card',
  'drop',
  'drag-start',
  'drag-over',
  'drag-leave',
  'internal-drop',
  'open-edit-modal',
  'open-delete-modal',
  'add-comment',
  'add-tag',
  'remove-tag',
  'add-attachment',
  'remove-attachment'
]);

const isDragOver = ref(false);

const onDragStart = (event, sectionIndex, itemIndex) => {
  emit('drag-start', sectionIndex, itemIndex, event);
};

const addNewCard = (sectionIndex, cardData) => {
  emit('add-card', sectionIndex, cardData);
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragOver.value = true;
  // Find position in list
  emit('drag-over', props.sectionIndex, null, event);
};

const onDragOver = (event, sectionIndex, itemIndex) => {
  emit('drag-over', sectionIndex, itemIndex, event);
};

const handleDragLeave = (event) => {
  // Check if we're actually leaving the section or just entering a child
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false;
    emit('drag-leave', event);
  }
};

const onDragLeave = (event) => {
  emit('drag-leave', event);
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  emit('drop', props.sectionIndex, event);
};

const onInternalDrop = (event, sectionIndex, itemIndex) => {
  emit('internal-drop', sectionIndex, itemIndex);
};

</script>

<style>
.tvd__column__item {
  position: relative;
  transition: all 0.2s ease;
}

.section-drag-over {
  background-color: #e9efff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

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

/* New card form styles */
.tvd__add-field {
  margin-bottom: 10px;
}

.tvd__add-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
}

.tvd__add-select,
.tvd__add-date {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.tvd__file-upload-label {
  display: inline-block;
  padding: 7px 12px;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 10px;
}

.tvd__file-upload-label:hover {
  background-color: #e0e0e0;
}

.tvd__file-preview {
  background-color: #f9f9f9;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
}

.tvd__file-remove {
  background: none;
  border: none;
  color: #e53935;
  cursor: pointer;
}

/* Dark mode styles */
.dark-mode .tvd__file-upload-label {
  background-color: #444;
  color: #eee;
}

.dark-mode .tvd__file-upload-label:hover {
  background-color: #555;
}

.dark-mode .tvd__file-preview {
  background-color: #444;
  color: #eee;
}
</style>