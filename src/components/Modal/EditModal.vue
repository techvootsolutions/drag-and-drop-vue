<template>
  <Teleport to="body">
    <div v-if="isOpen" class="tvd__modal-overlay" @click.self="closeModal">
      <div class="tvd__modal-container">
        <div class="tvd__modal-header">
          <h3>{{ isEdit ? 'Edit Card' : 'View Card' }}</h3>
          <button class="tvd__modal-close" @click="closeModal">
            <i class="tvd__icons fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="tvd__modal-content">
          <div class="tvd__form-group">
            <label>Title</label>
            <input
              v-model="editedCard.title"
              :disabled="!isEdit"
              type="text"
              class="tvd__form-control"
            />
          </div>
          
          <div class="tvd__form-group">
            <label>Description</label>
            <textarea
              v-model="editedCard.description"
              :disabled="!isEdit"
              class="tvd__form-control"
            ></textarea>
          </div>
          
          <div class="tvd__form-group">
            <label>Priority</label>
            <select 
              v-model="editedCard.priority" 
              :disabled="!isEdit"
              class="tvd__form-control"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div class="tvd__form-group">
            <label>Deadline Date</label>
            <input
              type="date"
              :disabled="!isEdit"
              v-model="deadlineDateInput"
              class="tvd__form-control"
            />
          </div>
        </div>
        <div class="tvd__modal-footer" v-if="isEdit">
          <button class="tvd__btn tvd__btn-secondary" @click="closeModal">Cancel</button>
          <button class="tvd__btn tvd__btn-primary" @click="saveChanges">Save</button>
        </div>
        <div class="tvd__modal-footer" v-else>
          <button class="tvd__btn tvd__btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(['modal-close', 'edit-data']);

const editedCard = ref({
  title: "",
  description: "",
  deadlineDate: "",
  attachment: null,
  priority: "medium"
});

// Date formatting utilities for the date input
const deadlineDateInput = computed({
  get() {
    if (!editedCard.value.deadlineDate) return '';
    
    // Try to convert from the format "Apr 13, 2025" to YYYY-MM-DD
    try {
      const date = new Date(editedCard.value.deadlineDate);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error parsing date:", e);
      return '';
    }
  },
  set(value) {
    if (!value) {
      editedCard.value.deadlineDate = '';
      return;
    }
    
    try {
      const date = new Date(value);
      editedCard.value.deadlineDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      });
    } catch (e) {
      console.error("Error setting date:", e);
    }
  }
});

watch(() => props.data, (newData) => {
  if (newData && newData.event) {
    editedCard.value = {
      title: newData.event.title || "",
      description: newData.event.description || "",
      deadlineDate: newData.event.deadlineDate || "",
      attachment: newData.event.attachment || null,
      priority: newData.event.priority || "medium"
    };
  }
}, { deep: true, immediate: true });

const closeModal = () => {
  emit('modal-close');
};

const saveChanges = () => {
  emit('edit-data', {
    arrayindex: props.data.arrayindex,
    itemindex: props.data.itemindex,
    title: editedCard.value.title,
    description: editedCard.value.description,
    deadlineDate: editedCard.value.deadlineDate,
    attachment: editedCard.value.attachment,
    priority: editedCard.value.priority
  });
};
</script>

<style>
.tvd__modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.tvd__modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.tvd__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.tvd__modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.tvd__modal-content {
  padding: 20px;
}

.tvd__modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  gap: 10px;
}

.tvd__form-group {
  margin-bottom: 15px;
}

.tvd__form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.tvd__form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.tvd__btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.tvd__btn-primary {
  background-color: #4caf50;
  color: white;
}

.tvd__btn-secondary {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
}
</style>