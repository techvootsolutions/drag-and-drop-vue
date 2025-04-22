<template>
  <div class="drag-drop-manager">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, onBeforeUnmount } from "vue";
import { resetDragClass, handleDragImage } from "../utils/dragDropUtils";

const emit = defineEmits(['drag-start', 'drop-item', 'internal-drop', 'drag-over', 'drag-leave']);

const draggedItem = ref(null);
const draggedArray = ref(null);
const draggedElement = ref(null);
const dragOverSection = ref(null);
const dragOverItem = ref(null);

onMounted(() => {
  document.addEventListener('dragend', resetDragState);
});

onBeforeUnmount(() => {
  document.removeEventListener('dragend', resetDragState);
});

const dragStart = (sectionIndex, itemIndex, event) => {
  if (!event?.target) return;
  draggedItem.value = itemIndex;
  draggedArray.value = sectionIndex;
  draggedElement.value = event.target;
  
  event.target.classList.add('dragging');
  
  if (event.dataTransfer) {
    handleDragImage(event, { sectionIndex, itemIndex });
  }
  
  emit('drag-start', sectionIndex, itemIndex);
};

const dragOver = (targetSectionIndex, targetItemIndex = null, event) => {
  if (event) event.preventDefault();
  
  // Skip if we're still over the same elements
  if (dragOverSection.value === targetSectionIndex && 
      dragOverItem.value === targetItemIndex) {
    return;
  }
  
  // Update drag over states
  dragOverSection.value = targetSectionIndex;
  dragOverItem.value = targetItemIndex;
  
  emit('drag-over', {
    targetSectionIndex,
    targetItemIndex,
    event
  });
  
  // Add visual indicator
  if (event?.target && event.target.classList) {
    event.target.classList.add('drag-over');
  }
};

const dragLeave = (event) => {
  // Remove visual indicator
  if (event?.target && event.target.classList) {
    event.target.classList.remove('drag-over');
  }
  
  emit('drag-leave', event);
};

const dropItem = (targetSectionIndex, event) => {
  event.preventDefault();
  if (draggedItem.value === null || draggedArray.value === null) return;

  // Remove visual feedback
  resetDragClass(draggedElement.value);

  // Emit drop event with all relevant information
  emit('drop-item', {
    draggedItem: draggedItem.value,
    draggedArray: draggedArray.value,
    targetSectionIndex,
    event
  });
  
  // Reset after drop
  resetDragState();
};

const internalDrop = (targetSectionIndex, targetIndex) => {
  if (draggedItem.value === null || draggedArray.value === null) return;
  
  // Remove visual feedback
  resetDragClass(draggedElement.value);
  
  emit('internal-drop', {
    draggedItem: draggedItem.value,
    draggedArray: draggedArray.value,
    targetSectionIndex,
    targetIndex
  });
  
  // Reset after drop
  resetDragState();
};

const resetDragState = () => {
  resetDragClass(draggedElement.value);
  draggedItem.value = null;
  draggedArray.value = null;
  draggedElement.value = null;
  dragOverSection.value = null;
  dragOverItem.value = null;
};

// Expose methods to parent components
// eslint-disable-next-line no-undef
defineExpose({
  dragStart,
  dragOver,
  dragLeave,
  dropItem,
  internalDrop,
  resetDragState
});
</script>

<style>
.dragging {
  opacity: 0.6;
  transform: scale(0.98);
}

.drag-over {
  border: 2px dashed #4a9eff;
  background-color: rgba(74, 158, 255, 0.1);
  transition: all 0.2s ease;
}
</style>