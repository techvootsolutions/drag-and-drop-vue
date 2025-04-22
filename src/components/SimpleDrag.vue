<template>
  <section>
    <ul class="tvd__column__list">
      <!-- Sections/Columns -->
      <BoardSection
        v-for="(data, index) in responseData.data"
        :key="index"
        :section="data"
        :section-index="index"
        :add-card-title="addCardTitle"
        :is-adding-card="addingCard === index"
        @show-add-card="showAddCardUI"
        @close-card="closeCard"
        @add-card="handleAddCard"
        @open-edit-modal="openModal"
        @open-delete-modal="openDeleteModal"
        @drop="handleDropItem"
        @drag-start="handleDragStart"
        @drag-over="handleDragOver"
        @drag-leave="handleDragLeave"
        @internal-drop="handleInternalDrop"
        @add-comment="handleAddComment"
        @add-tag="handleAddTag"
        @remove-tag="handleRemoveTag"
        @add-attachment="handleAddAttachment"
        @remove-attachment="handleRemoveAttachment"
      />
      
      <!-- Adding new section UI -->
      <AddListForm
        :is-adding-list="addingList"
        :add-section-title="addSectionTitle"
        @close-new-list="closeNewList"
        @add-list="handleAddList"
      />
      
      <!-- Add new section button -->
      <AddSectionButton
        :add-section-title="addSectionTitle"
        @show-add-list="showAddListUI"
      />
    </ul>
    
    <!-- Modals -->
    <EditModal
      :is-edit="isEdit"
      :is-open="isModalOpenedLocal"
      @modal-close="closeModal"
      @edit-data="editData"
      name="first-modal"
      :data="editCardData"
    />
    <DeleteConfirmation
      delete-message="Are you sure you want to Delete the Card?"
      :is-open-delete-modal="isOpenDeleteModalLocal"
      @modal-close="closeDeleteModal"
      @confirm-delete="deleteCard"
      name="delete-confirmation-modal"
    />
    
    <!-- Toast notification for drag and drop actions -->
    <div v-if="showToast" class="tvd__toast" :class="{ 'show': showToast }">
      {{ toastMessage }}
    </div>
  </section>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import BoardSection from "./BoardSection.vue";
import EditModal from "./Modal/EditModal.vue";
import DeleteConfirmation from "./Modal/DeleteConfirmation.vue";
import AddListForm from "./AddListForm.vue";
import AddSectionButton from "./AddSectionButton.vue";

const props = defineProps({
  responseData: {
    type: Object,
    required: true
  },
  addCardTitle: {
    type: String,
    default: "+Add Card"
  },
  addSectionTitle: {
    type: String,
    default: "Add Section"
  },
  isModalOpened: {
    type: Boolean,
    default: false
  },
  isCustomEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["add-card", "edit-card", "delete-card", "add-comment", "add-tag", "remove-tag", "add-attachment", "remove-attachment"]);

// Reactive state
const isModalOpenedLocal = ref(false);
const isOpenDeleteModalLocal = ref(false);
const isEdit = ref(false);
const addingCard = ref(null);
const addingList = ref(false);
const editCardData = ref({});
const deleteCardData = ref({});

// Drag and drop state
const draggedItem = ref(null);
const draggedArray = ref(null);

// Toast notification
const showToast = ref(false);
const toastMessage = ref('');

// Card management methods
const showAddCardUI = (index) => {
  addingCard.value = index;
};

const closeCard = () => {
  addingCard.value = null;
};

// Section management methods
const showAddListUI = () => {
  addingList.value = true;
};

const closeNewList = () => {
  addingList.value = false;
};

const handleAddList = (title) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.responseData.data.push({
    title: title,
    data: [],
  });
  addingList.value = false;
  
  // Show toast notification
  showToastNotification(`New section "${title}" added`);
};

// Modal management
const openModal = (item, sectionIndex, itemIndex, isEditMode) => {
  isEdit.value = isEditMode;
  editCardData.value = {
    event: item,
    arrayindex: sectionIndex,
    itemindex: itemIndex,
  };
  
  if (props.isCustomEdit) {
    emit("edit-card", editCardData.value);
    return;
  }
  
  document.body.classList.add('tvd__modal-open');
  isModalOpenedLocal.value = true;
};

const handleAddAttachment = (event) => {
  emit("add-attachment", event);
  showToastNotification('Attachment added');
};

const handleRemoveAttachment = (event) => {
  emit("remove-attachment", event);
  showToastNotification('Attachment removed');
};

const closeModal = () => {
  document.body.classList.remove('tvd__modal-open');
  isModalOpenedLocal.value = false;
};

const openDeleteModal = (sectionIndex, itemIndex) => {
  deleteCardData.value = {
    arrayindex: sectionIndex,
    itemindex: itemIndex,
  };
  
  document.body.classList.add('tvd__modal-open');
  isOpenDeleteModalLocal.value = true;
};

const closeDeleteModal = () => {
  document.body.classList.remove('tvd__modal-open');
  isOpenDeleteModalLocal.value = false;
};

const handleAddCard = (index, newCardData) => {
  emit("add-card", {
    index,
    value: newCardData
  });
  
  // Show toast notification
  showToastNotification(`New card added to ${props.responseData.data[index]?.title}`);
};

const editData = (event) => {
  emit("edit-card", event);
  document.body.classList.remove('tvd__modal-open');
  isModalOpenedLocal.value = false;
  
  // Show toast notification
  showToastNotification('Card updated successfully');
};

const deleteCard = () => {
  document.body.classList.remove('tvd__modal-open');
  emit("delete-card", deleteCardData.value);
  isOpenDeleteModalLocal.value = false;
  
  // Show toast notification
  showToastNotification('Card deleted successfully');
};

// Comment and tag management
const handleAddComment = (event) => {
  emit("add-comment", event);
  showToastNotification('Comment added');
};

const handleAddTag = (event) => {
  emit("add-tag", event);
  showToastNotification(`Tag "${event.tag}" added`);
};

const handleRemoveTag = (event) => {
  emit("remove-tag", event);
  showToastNotification(`Tag removed`);
}

// Drag and drop handlers
const handleDragStart = (sectionIndex, itemIndex) => {
  draggedItem.value = itemIndex;
  draggedArray.value = sectionIndex;
};

const handleDragOver = () => {
  // Visual feedback can be added if needed
};

const handleDragLeave = () => {
  // Reset any visual feedback if needed
};

const handleDropItem = (targetSectionIndex, event) => {
  event.preventDefault();
  
  if (draggedItem.value === null || draggedArray.value === null) return;

  // Get source and target sections
  const sourceSection = props.responseData.data[draggedArray.value];
  const targetSection = props.responseData.data[targetSectionIndex];
  
  if (!sourceSection || !targetSection) return;
  
  // If it's the same section, don't do anything
  if (draggedArray.value === targetSectionIndex) return;
  
  // Get the card we're moving
  const cardToMove = { ...sourceSection.data[draggedItem.value] };
  
  // Remove card from source section
  sourceSection.data.splice(draggedItem.value, 1);
  
  // Add card to target section
  targetSection.data.push(cardToMove);
  
  // Show toast notification
  showToastNotification(`Card moved to ${targetSection.title}`);
  
  // Reset drag state
  draggedItem.value = null;
  draggedArray.value = null;
};

const handleInternalDrop = (targetSectionIndex, targetIndex) => {
  if (draggedItem.value === null || draggedArray.value === null) return;
  
  // If moving within the same section
  if (draggedArray.value === targetSectionIndex) {
    const section = props.responseData.data[targetSectionIndex];
    
    // Skip if trying to drop to the same position
    if (draggedItem.value === targetIndex) return;
    
    // Get the card we're moving
    const cardToMove = { ...section.data[draggedItem.value] };
    
    // Remove card from its original position
    section.data.splice(draggedItem.value, 1);
    
    // Add card to its new position
    // If dragging from higher to lower index, we need to adjust the target index
    section.data.splice(targetIndex, 0, cardToMove);
    
    showToastNotification('Card reordered');
  } else {
    // Moving between different sections
    const sourceSection = props.responseData.data[draggedArray.value];
    const targetSection = props.responseData.data[targetSectionIndex];
    
    // Get the card we're moving
    const cardToMove = { ...sourceSection.data[draggedItem.value] };
    
    // Remove card from source section
    sourceSection.data.splice(draggedItem.value, 1);
    
    // Add card to target section at specific position
    targetSection.data.splice(targetIndex, 0, cardToMove);
    
    showToastNotification(`Card moved to ${targetSection.title}`);
  }
  
  // Reset drag state
  draggedItem.value = null;
  draggedArray.value = null;
};

// Toast notification helper
const showToastNotification = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};
</script>

<style>
.tvd__toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.tvd__toast.show {
  opacity: 1;
}
</style>