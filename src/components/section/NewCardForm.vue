<template>
    <li class="tvd__card__item">
      <button class="tvd_close_addcard" @click="$emit('close-card')">
        <i class="tvd__icons fa-solid fa-xmark"></i>
      </button>
      <div>
        <input
          v-model="newCard.title"
          type="text"
          placeholder="Card Title"
          class="tvd__add-input"
        />
        <textarea
          v-model="newCard.description"
          placeholder="Card Description"
          class="tvd__add-textarea"
        ></textarea>
        
        <div class="tvd__add-field">
          <label>Priority:</label>
          <select v-model="newCard.priority" class="tvd__add-select">
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div class="tvd__add-field">
          <label>Deadline:</label>
          <input 
            type="date" 
            v-model="newCard.deadlineDate" 
            class="tvd__add-date"
          />
        </div>
        
        <div class="tvd__add-field">
          <label>Tags (comma separated):</label>
          <input 
            type="text" 
            v-model="newCard.tags" 
            placeholder="frontend, bug, feature" 
            class="tvd__add-input"
          />
        </div>
        
        <!-- File attachment option -->
        <div class="tvd__add-field">
          <label>Attachment:</label>
          <label for="new-card-file" class="tvd__file-upload-label">
            <i class="fa-solid fa-paperclip"></i> Choose file
          </label>
          <input 
            id="new-card-file" 
            type="file" 
            style="display: none;"
            @change="handleFileSelect"
          />
          <div v-if="newCardFile" class="tvd__file-preview">
            {{ newCardFile.name }} ({{ formatFileSize(newCardFile.size) }})
            <button @click.prevent="newCardFile = null" class="tvd__file-remove">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
        
        <button class="tvd__add-btn" @click.prevent="addCard">
          <h6>{{ addCardTitle }}</h6>
        </button>
      </div>
    </li>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    sectionIndex: {
      type: Number,
      required: true
    },
    addCardTitle: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['close-card', 'add-card']);
  
  const newCard = ref({
    title: "",
    description: "",
    priority: "medium",
    deadlineDate: "",
    tags: ""
  });
  
  const newCardFile = ref(null);
  
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
  
  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      newCardFile.value = file;
    }
  };
  
  const addCard = () => {
    if (newCard.value.title.trim() !== "") {
      // Format date or use blank
      let formattedDate = "";
      if (newCard.value.deadlineDate) {
        const date = new Date(newCard.value.deadlineDate);
        formattedDate = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: '2-digit', 
          year: 'numeric' 
        });
      } else {
        // Default to 2 days from now
        formattedDate = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }
      
      // Process tags
      const tags = newCard.value.tags 
        ? newCard.value.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '') 
        : [];
      
      const cardData = {
        title: newCard.value.title,
        description: `<p>${newCard.value.description}</p>`,
        deadlineDate: formattedDate,
        priority: newCard.value.priority,
        tags: tags,
        activities: [
          {
            type: 'created',
            user: 'User',
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      // Process attachment if exists
      if (newCardFile.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const attachmentData = {
            name: newCardFile.value.name,
            type: newCardFile.value.type,
            size: newCardFile.value.size,
            date: new Date().toISOString(),
            data: e.target.result
          };
          
          cardData.attachments = [attachmentData];
          
          // Add activity for attachment
          cardData.activities.push({
            type: 'attachment-added',
            user: 'User',
            value: newCardFile.value.name,
            timestamp: new Date().toISOString()
          });
          
          // Submit the card with the attachment
          emit("add-card", props.sectionIndex, cardData);
          resetForm();
        };
        reader.readAsDataURL(newCardFile.value);
      } else {
        // Submit the card without attachment
        emit("add-card", props.sectionIndex, cardData);
        resetForm();
      }
    }
  };
  
  const resetForm = () => {
    // Reset form
    newCard.value.title = "";
    newCard.value.description = "";
    newCard.value.priority = "medium";
    newCard.value.deadlineDate = "";
    newCard.value.tags = "";
    newCardFile.value = null;
    emit("close-card");
  };
  </script>
  
  <style scoped>
  .tvd__card__item {
    position: relative;
  }
  
  .tvd_close_addcard {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
  }
  
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