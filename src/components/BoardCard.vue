<template>
  <li
    class="tvd__card__item"
    :class="[priorityClass]"
    :draggable="true"
    @dragstart="handleDragStart"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- Visual drag indicator that appears during drag -->
    <div class="tvd__card__drag-handle" title="Drag to move">
      <i class="fa-solid fa-grip-lines"></i>
    </div>
    
    <div class="tvd__card__field">
      <!-- Card title -->
      <span
        v-if="card && card.title"
        v-html="card.title"
        class="tvd__card__tag"
        @click="$emit('open-edit-modal', false)"
      ></span>
      
      <!-- Card actions -->
      <div>
        <button
          @click="$emit('open-edit-modal', true)"
          class="tvd__edit_card"
        >
          <i class="fa-solid fa-pen-to-square tvd__icons"></i>
        </button>
        <button
          @click="$emit('open-delete-modal')"
          class="tvd__delete_card"
        >
          <i class="tvd__icons fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>

    <!-- Priority Badge -->
    <div class="tvd__card__field" v-if="card && card.priority">
      <span class="tvd__priority-badge" :class="priorityBadgeClass">
        <i :class="priorityIcon"></i>
        {{ getPriorityLabel(card.priority) }}
      </span>
    </div>

    <!-- Card tags -->
    <div class="tvd__card__field tvd__card__tags" v-if="card && card.tags && card.tags.length > 0">
      <span 
        v-for="(tag, index) in card.tags" 
        :key="index" 
        class="tvd__tag"
      >
        #{{ tag }}
        <button class="tvd__tag-remove" @click="removeTag(tag)">
          <i class="fa-solid fa-times"></i>
        </button>
      </span>
      <button class="tvd__tag-add" @click="addNewTag">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    
    <!-- Card deadline -->
    <div class="tvd__card__field" v-if="card && card.deadlineDate">
      <span>
        <i class="fa-regular fa-calendar-alt"></i>
        {{ card.deadlineDate }}
      </span>
    </div>

    <!-- Card attachments -->
    <div class="tvd__card__field tvd__card__attachments-preview" v-if="card && card.attachments && card.attachments.length > 0">
      <div class="tvd__attachments-count" @click="showAttachments = !showAttachments">
        <i class="fa-solid fa-paperclip"></i>
        {{ card.attachments.length }} {{ card.attachments.length === 1 ? 'Attachment' : 'Attachments' }}
        <i :class="showAttachments ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
      </div>
      
      <CardAttachment 
        v-if="showAttachments"
        :attachments="card.attachments"
        @add-attachment="addAttachment"
        @remove-attachment="removeAttachment"
      />
    </div>
    
    <!-- Card description -->
    <div class="tvd__card__field" v-if="card && card.description">
      <span class="tvd__description" v-html="card.description"></span>
    </div>

     <!-- Card comments -->
     <div class="tvd__card__comments" v-if="card && card.comments && card.comments.length > 0">
      <div class="tvd__comments-header" @click="toggleComments">
        <i class="fa-solid fa-comments"></i>
        {{ card.comments.length }} {{ card.comments.length === 1 ? 'Comment' : 'Comments' }}
        <i :class="showComments ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
      </div>
      <div class="tvd__comments-list" v-if="showComments">
        <div class="tvd__comment" v-for="(comment, index) in card.comments" :key="index">
          <div class="tvd__comment-header">
            <span class="tvd__comment-author">{{ comment.author }}</span>
            <span class="tvd__comment-time">{{ formatCommentTime(comment.timestamp) }}</span>
          </div>
          <div class="tvd__comment-text">{{ comment.text }}</div>
        </div>
      </div>
      <div class="tvd__add-comment" v-if="showComments">
        <input 
          type="text" 
          v-model="newComment" 
          placeholder="Add a comment..." 
          class="tvd__comment-input"
          @keyup.enter="addComment"
        />
        <button class="tvd__comment-btn" @click="addComment">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
    
    <!-- Activity Log -->
    <CardActivityLog 
      :activities="card.activities"
    />
    
    <!-- Quick action buttons -->
    <div class="tvd__card__quick-actions">
      <!-- Add comment button when there are no comments -->
      <button class="tvd__quick-action-btn" v-if="card && (!card.comments || card.comments.length === 0)" @click="showAddComment = !showAddComment">
        <i class="fa-regular fa-comment"></i>
      </button>
      
      <!-- Add tag button when there are no tags -->
      <button class="tvd__quick-action-btn" v-if="card && (!card.tags || card.tags.length === 0)" @click="addNewTag">
        <i class="fa-solid fa-tag"></i>
      </button>
      
      <!-- Add attachment button when there are no attachments -->
      <button class="tvd__quick-action-btn" v-if="card && (!card.attachments || card.attachments.length === 0)" @click="showAttachmentInput = true">
        <i class="fa-solid fa-paperclip"></i>
      </button>
    </div>
    
    <!-- Add comment form when there are no comments -->
    <div class="tvd__add-comment" v-if="showAddComment">
      <input 
        type="text" 
        v-model="newComment" 
        placeholder="Add a comment..." 
        class="tvd__comment-input"
        @keyup.enter="addComment"
      />
      <button class="tvd__comment-btn" @click="addComment">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>

    <!-- Tag input modal -->
    <div class="tvd__tag-modal" v-if="showTagInput">
      <div class="tvd__tag-modal-content">
        <input 
          type="text" 
          v-model="newTag" 
          placeholder="Enter tag name..." 
          class="tvd__tag-input"
          @keyup.enter="addTag"
          ref="tagInput"
        />
        <div class="tvd__tag-actions">
          <button class="tvd__tag-cancel" @click="showTagInput = false">
            Cancel
          </button>
          <button class="tvd__tag-save" @click="addTag">
            Add
          </button>
        </div>
      </div>
    </div>
    <!-- Attachment input modal -->
    <div class="tvd__attachment-modal" v-if="showAttachmentInput">
      <div class="tvd__attachment-modal-content">
        <h4>Add Attachment</h4>
        <label for="card-file-upload" class="tvd__attachment-file-label">
          <i class="fa-solid fa-cloud-upload-alt"></i> Choose a file
        </label>
        <input 
          id="card-file-upload" 
          type="file" 
          @change="handleFileUpload"
          style="display: none;"
        />
        <div class="file-upload-preview" v-if="selectedFile">
          <div class="file-name">{{ selectedFile.name }}</div>
          <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
        </div>
        <div class="tvd__attachment-actions">
          <button class="tvd__attachment-cancel" @click="cancelAttachment">
            Cancel
          </button>
          <button class="tvd__attachment-save" @click="uploadAttachment" :disabled="!selectedFile">
            Upload
          </button>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from "vue";
import CardAttachment from "./CardAttachment.vue";
import CardActivityLog from "./CardActivityLog.vue";

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  cardIndex: {
    type: Number,
    required: true
  },
  sectionIndex: {
    type: Number,
    required: true
  }
});

const emit = defineEmits([
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

// Reactive state
const showComments = ref(false);
const newComment = ref('');
const showAddComment = ref(false);
const showTagInput = ref(false);
const newTag = ref('');
const showAttachments = ref(false);
const showAttachmentInput = ref(false);
const selectedFile = ref(null);

// Priority visual utilities
const priorityClass = computed(() => {
  if (!props.card.priority) return '';
  return `priority-${props.card.priority}`;
});

const priorityBadgeClass = computed(() => {
  if (!props.card.priority) return '';
  return `priority-badge-${props.card.priority}`;
});

const priorityIcon = computed(() => {
  switch (props.card.priority) {
    case 'urgent':
      return 'fa-solid fa-exclamation-circle';
    case 'high':
      return 'fa-solid fa-arrow-up';
    case 'medium':
      return 'fa-solid fa-minus';
    case 'low':
      return 'fa-solid fa-arrow-down';
    default:
      return 'fa-solid fa-circle';
  }
});

const getPriorityLabel = (priority) => {
  if (!priority) return '';
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

// Comment functions
const toggleComments = () => {
  showComments.value = !showComments.value;
};

const formatCommentTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffDays < 7) {
    // Within a week
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    // Older
    return date.toLocaleDateString();
  }
};

const addComment = () => {
  if (newComment.value.trim() === '') return;
  
  emit('add-comment', {
    arrayIndex: props.sectionIndex,
    itemIndex: props.cardIndex,
    comment: newComment.value.trim()
  });
  
  newComment.value = '';
  showAddComment.value = false;
  showComments.value = true;
};

// Tag functions
const addNewTag = () => {
  showTagInput.value = true;
  // Focus the input field when it becomes visible
  setTimeout(() => {
    if (document.querySelector('.tvd__tag-input')) {
      document.querySelector('.tvd__tag-input').focus();
    }
  }, 100);
};

const addTag = () => {
  if (newTag.value.trim() === '') return;
  
  emit('add-tag', {
    arrayIndex: props.sectionIndex,
    itemIndex: props.cardIndex,
    tag: newTag.value.trim().toLowerCase()
  });
  
  newTag.value = '';
  showTagInput.value = false;
};

const removeTag = (tag) => {
  emit('remove-tag', {
    arrayIndex: props.sectionIndex,
    itemIndex: props.cardIndex,
    tag: tag
  });
};

// Attachment functions
const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const cancelAttachment = () => {
  selectedFile.value = null;
  showAttachmentInput.value = false;
};

const uploadAttachment = () => {
  if (!selectedFile.value) return;
  
  const file = selectedFile.value;
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const attachment = {
      name: file.name,
      type: file.type,
      size: file.size,
      date: new Date().toISOString(),
      data: e.target.result
    };
    
    emit('add-attachment', {
      arrayIndex: props.sectionIndex,
      itemIndex: props.cardIndex,
      attachment: attachment
    });
    
    // Reset
    selectedFile.value = null;
    showAttachmentInput.value = false;
  };
  
  reader.readAsDataURL(file);
};

const addAttachment = () => {
  showAttachmentInput.value = true;
  // Focus the file input when it becomes visible
  setTimeout(() => {
    if (document.getElementById('card-file-upload')) {
      document.getElementById('card-file-upload').click();
    }
  }, 100);
};

const removeAttachment = (index) => {
  emit('remove-attachment', {
    arrayIndex: props.sectionIndex,
    itemIndex: props.cardIndex,
    attachmentIndex: index
  });
};

// Drag and drop functions
const handleDragStart = (event) => {
  // Set data transfer for drag operation
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    // Store card data in data transfer
    event.dataTransfer.setData('text/plain', JSON.stringify({
      cardId: props.card.title,
      sectionIndex: props.sectionIndex,
      cardIndex: props.cardIndex
    }));
  }
  emit('drag-start', event);
};

const handleDragOver = (event) => {
  event.preventDefault();
  // Add visual cue when dragging over this card
  event.currentTarget.classList.add('card-drag-over');
  emit('drag-over', event);
};

const handleDragLeave = (event) => {
  // Remove visual cue when dragging moves out
  event.currentTarget.classList.remove('card-drag-over');
  emit('drag-leave', event);
};

const handleDrop = (event) => {
  event.preventDefault();
  // Remove the visual cue
  event.currentTarget.classList.remove('card-drag-over');
  emit('internal-drop', event);
};
</script>

<style>
.tvd__card__item {
  position: relative;
  transition: all 0.2s ease;
}

.tvd__card__drag-handle {
  position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 6px;
    cursor: grab;
    opacity: 0.3;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
}

.tvd__card__item:hover .tvd__card__drag-handle {
  opacity: 1;
}

.tvd__card__item.dragging {
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  transform: rotate(2deg) scale(1.02);
}

.tvd__card__item.card-drag-over {
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  transform: translateY(5px);
  border: 2px dashed #4a9eff;
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Priority styling */
.priority-urgent {
  border-left: 5px solid #ea384c !important;
}

.priority-high {
  border-left: 5px solid #9b87f5 !important;
}

.priority-medium {
  border-left: 5px solid #FEF7CD !important;
}

.priority-low {
  border-left: 5px solid #F2FCE2 !important;
}

.tvd__priority-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.priority-badge-urgent {
  background-color: #ffebee;
  color: #ea384c;
}

.priority-badge-high {
  background-color: #f5f0ff;
  color: #9b87f5;
}

.priority-badge-medium {
  background-color: #FEF7CD;
  color: #777;
}

.priority-badge-low {
  background-color: #F2FCE2;
  color: #4caf50;
}

/* Tags styling */
.tvd__card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.tvd__tag {
  background-color: #e9efff;
  color: #4a6cff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
}

.tvd__tag-remove {
  background: none;
  border: none;
  color: #4a6cff;
  cursor: pointer;
  font-size: 10px;
  margin-left: 4px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.tvd__tag-add, .tvd__add-tag-btn, .tvd__add-comment-btn {
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.tvd__tag-add:hover, .tvd__add-tag-btn:hover, .tvd__add-comment-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.tvd__tag-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.tvd__tag-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tvd__tag-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
}

.tvd__tag-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.tvd__tag-cancel, .tvd__tag-save {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.tvd__tag-cancel {
  background-color: #f0f0f0;
  color: #333;
}

.tvd__tag-save {
  background-color: #4a6cff;
  color: white;
}

/* Comments styling */
.tvd__card__comments {
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 8px;
}

.tvd__comments-header {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #777;
  cursor: pointer;
  padding: 4px 0;
}

.tvd__comments-list {
  margin-top: 5px;
}

.tvd__comment {
  padding: 8px;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-bottom: 5px;
}

.tvd__comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  font-size: 11px;
}

.tvd__comment-author {
  font-weight: 600;
  color: #555;
}

.tvd__comment-time {
  color: #999;
}

.tvd__comment-text {
  font-size: 13px;
  word-break: break-word;
}

.tvd__add-comment {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.tvd__comment-input {
  flex-grow: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.tvd__comment-btn {
  background-color: #4a6cff;
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Dark mode adjustments for tag and comment features */
.dark-mode .tvd__tag {
  background-color: #3a3a3a;
  color: #a0c2ff;
}

.dark-mode .tvd__tag-remove {
  color: #a0c2ff;
}

.dark-mode .tvd__tag-remove:hover {
  background-color: rgba(160, 194, 255, 0.1);
}

.dark-mode .tvd__tag-add:hover, 
.dark-mode .tvd__add-tag-btn:hover, 
.dark-mode .tvd__add-comment-btn:hover {
  background-color: #3a3a3a;
  color: #eee;
}

.dark-mode .tvd__tag-modal-content {
  background-color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-mode .tvd__tag-input {
  background-color: #444;
  border-color: #555;
  color: #eee;
}

.dark-mode .tvd__tag-cancel {
  background-color: #555;
  color: #eee;
}

.dark-mode .tvd__card__comments {
  border-top-color: #444;
}

.dark-mode .tvd__comment {
  background-color: #3a3a3a;
}

.dark-mode .tvd__comment-author {
  color: #ddd;
}

.dark-mode .tvd__comment-time {
  color: #aaa;
}

.dark-mode .tvd__comment-input {
  background-color: #444;
  border-color: #555;
  color: #eee;
}

.tvd__card__attachments-preview {
  margin-top: 10px;
  display: block !important;
}

.tvd__attachments-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.tvd__card__quick-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.tvd__quick-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}

.tvd__quick-action-btn:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.tvd__attachment-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.tvd__attachment-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tvd__attachment-file-label {
  display: block;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin: 15px 0;
  transition: background-color 0.2s;
}

.tvd__attachment-file-label:hover {
  background-color: #e0e0e0;
}

.file-upload-preview {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.file-name {
  font-weight: 500;
  margin-bottom: 5px;
  word-break: break-all;
}

.file-size {
  font-size: 12px;
  color: #777;
}

.tvd__attachment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.tvd__attachment-cancel, .tvd__attachment-save {
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.tvd__attachment-cancel {
  background-color: #f0f0f0;
  color: #333;
}

.tvd__attachment-save {
  background-color: #4a6cff;
  color: white;
}

.tvd__attachment-save:disabled {
  background-color: #c1c1c1;
  cursor: not-allowed;
}

/* Dark mode styles */
.dark-mode .tvd__attachments-count {
  color: #aaa;
}

.dark-mode .tvd__quick-action-btn {
  background-color: #444;
  color: #ccc;
}

.dark-mode .tvd__quick-action-btn:hover {
  background-color: #555;
}

.dark-mode .tvd__attachment-modal-content {
  background-color: #333;
  color: #eee;
}

.dark-mode .tvd__attachment-file-label {
  background-color: #444;
  color: #eee;
}

.dark-mode .tvd__attachment-file-label:hover {
  background-color: #555;
}

.dark-mode .file-upload-preview {
  background-color: #444;
}

.dark-mode .file-size {
  color: #bbb;
}

.dark-mode .tvd__attachment-cancel {
  background-color: #444;
  color: #eee;
}

.dark-mode .tvd__attachment-save:disabled {
  background-color: #555;
  color: #999;
}
</style>