<template>
  <div class="tvd__card__attachments">
    <h4 class="tvd__attachments-title">
      <i class="fa-solid fa-paperclip"></i> Attachments
    </h4>
    
    <div class="tvd__attachments-list">
      <div 
        v-for="(attachment, index) in attachments" 
        :key="index"
        class="tvd__attachment-item"
      >
        <div class="tvd__attachment-icon">
          <i :class="getFileIcon(attachment.type)"></i>
        </div>
        <div class="tvd__attachment-info">
          <div class="tvd__attachment-name">{{ attachment.name }}</div>
          <div class="tvd__attachment-meta">
            {{ formatSize(attachment.size) }} · 
            {{ formatDate(attachment.date) }}
          </div>
        </div>
        <div class="tvd__attachment-actions">
          <button 
            class="tvd__attachment-download" 
            @click="downloadAttachment(attachment)"
            title="Download"
          >
            <i class="fa-solid fa-download"></i>
          </button>
          <button 
            class="tvd__attachment-remove" 
            @click="removeAttachment(index)"
            title="Remove"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="tvd__attachment-add">
      <label for="file-upload" class="tvd__attachment-upload">
        <i class="fa-solid fa-plus"></i> Add Attachment
      </label>
      <input 
        id="file-upload" 
        type="file" 
        @change="addAttachment"
        style="display: none;"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  attachments: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['add-attachment', 'remove-attachment']);

// Helper function to get the appropriate icon based on file type
const getFileIcon = (type) => {
  if (type.startsWith('image/')) {
    return 'fa-solid fa-image';
  } else if (type.includes('pdf')) {
    return 'fa-solid fa-file-pdf';
  } else if (type.includes('word') || type.includes('document')) {
    return 'fa-solid fa-file-word';
  } else if (type.includes('excel') || type.includes('sheet')) {
    return 'fa-solid fa-file-excel';
  } else if (type.includes('zip') || type.includes('compressed')) {
    return 'fa-solid fa-file-archive';
  } else {
    return 'fa-solid fa-file';
  }
};

// Format the file size
const formatSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

// Format the date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Add a new attachment
const addAttachment = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment = {
        name: file.name,
        type: file.type,
        size: file.size,
        date: new Date().toISOString(),
        data: e.target.result
      };
      emit('add-attachment', attachment);
    };
    reader.readAsDataURL(file);
  }
  // Reset the input so the same file can be selected again
  event.target.value = null;
};

// Remove an attachment
const removeAttachment = (index) => {
  emit('remove-attachment', index);
};

// Download an attachment
const downloadAttachment = (attachment) => {
  const link = document.createElement('a');
  link.href = attachment.data;
  link.download = attachment.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style>
.tvd__card__attachments {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.tvd__attachments-title {
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tvd__attachment-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 8px;
}

.tvd__attachment-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #4a6cff;
  margin-right: 10px;
}

.tvd__attachment-info {
  flex-grow: 1;
}

.tvd__attachment-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
  word-break: break-word;
}

.tvd__attachment-meta {
  font-size: 11px;
  color: #888;
}

.tvd__attachment-actions {
  display: flex;
  gap: 5px;
}

.tvd__attachment-download,
.tvd__attachment-remove {
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.tvd__attachment-download {
  color: #4a6cff;
}

.tvd__attachment-remove {
  color: #e53935;
}

.tvd__attachment-download:hover,
.tvd__attachment-remove:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.tvd__attachment-add {
  margin-top: 10px;
}

.tvd__attachment-upload {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tvd__attachment-upload:hover {
  background-color: #e0e0e0;
}

/* Dark Mode Styles */
.dark-mode .tvd__card__attachments {
  border-top-color: #444;
}

.dark-mode .tvd__attachment-item {
  background-color: #3a3a3a;
}

.dark-mode .tvd__attachment-name {
  color: #eee;
}

.dark-mode .tvd__attachment-meta {
  color: #aaa;
}

.dark-mode .tvd__attachment-download:hover,
.dark-mode .tvd__attachment-remove:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .tvd__attachment-upload {
  background-color: #444;
  color: #eee;
}

.dark-mode .tvd__attachment-upload:hover {
  background-color: #555;
}
</style>