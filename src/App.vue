<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="app-header">
      <h1 class="app-title">Vue Drag and Drop</h1>
      <div class="app-controls">
        <div class="board-actions">
          <button @click="toggleTemplates" class="board-action-btn">
            <i class="fa-solid fa-clipboard-list"></i> Templates
          </button>
          <button @click="toggleSharing" class="board-action-btn">
            <i class="fa-solid fa-share-alt"></i> Share / Export
          </button>
        </div>
        <!-- Search & Filter -->
        <div class="search-filter">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search cards..." 
            class="search-input"
          />
          <select v-model="priorityFilter" class="filter-select">
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input 
            type="text" 
            v-model="tagFilter" 
            placeholder="Filter by tag..." 
            class="tag-filter"
          />
        </div>
        
        <!-- Dark Mode Toggle -->
        <button @click="toggleDarkMode" class="theme-toggle">
          <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
        </button>
      </div>
    </div>
    
    <!-- Board Templates View -->
    <BoardTemplates 
      v-if="showTemplates"
      :current-board="response"
      @load-template="loadTemplate"
    />
    
    <!-- Board Sharing View -->
    <BoardSharing
      v-if="showSharing"
      :board-id="boardId"
      :board-data="response"
      @import-board="importBoard"
    />
    
    <!-- Main Board -->    
    <SimpleDrag
      :response-data="filteredData"
      :is-custom-edit="false"
      add-card-title="+Add Card"
      add-section-title="Add Section"
      @add-card="addNewCard"
      @edit-card="editData"
      @delete-card="deleteCard"
      @add-comment="addComment"
      @add-tag="addTag"
      @remove-tag="removeTag"
      @add-attachment="addAttachment"
      @remove-attachment="removeAttachment"
      @move-card="moveCard"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import SimpleDrag from "./components/SimpleDrag.vue";
import BoardTemplates from "./components/BoardTemplates.vue";
import BoardSharing from "./components/BoardSharing.vue";

// Initialize dark mode from localStorage if available
const isDarkMode = ref(false);

// Generate a unique board ID
const boardId = ref(localStorage.getItem('boardId') || Math.random().toString(36).substring(2, 15));

onMounted(() => {
  // Load dark mode preference
  const savedMode = localStorage.getItem('darkMode');
  isDarkMode.value = savedMode === 'true';
  
  // Save board ID
  localStorage.setItem('boardId', boardId.value);
  
  // Load board data if it exists
  const savedBoard = localStorage.getItem('boardData');
  if (savedBoard) {
    try {
      response.value = JSON.parse(savedBoard);
    } catch (e) {
      console.error('Failed to load saved board:', e);
    }
  }
});

// Toggle dark mode function
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value);
};

// Search and filter
const searchQuery = ref('');
const priorityFilter = ref('');
const tagFilter = ref('');

// View state
const showTemplates = ref(false);
const showSharing = ref(false);

// Toggle views
const toggleTemplates = () => {
  showTemplates.value = !showTemplates.value;
  if (showTemplates.value) showSharing.value = false;
};

const toggleSharing = () => {
  showSharing.value = !showSharing.value;
  if (showSharing.value) showTemplates.value = false;
}

// Board data

const response = ref({
  data: [
    {
      title: "Section 1",
      drop_col_id: "",
      data: [
        { 
          title: 'Card 1',
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>",
          attachment: null,
          deadldeadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          priority: "high",
          comments: [
            { text: "This needs to be completed ASAP", author: "User", timestamp: new Date().toISOString() }
          ],
          tags: ["frontend", "bug"]
        },
        { 
          title: 'Card 2',
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>",
          attachment: null,
          deadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          priority: "medium",
          comments: [],
          tags: ["backend"]
        },
        { 
          title: "Card 3",
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>",
          attachment: null,
          deadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          priority: "low",
          comments: [],
          tags: ["design", "frontend"]
        },
      ],
    },
    {
      title: "Section 2",
      data: [
        { 
          title: "Card 4", 
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>",
          attachment: null,
          deadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          priority: "urgent",
          comments: [],
          tags: ["research"]
        }
      ],
    },
    {
      title: "Section 3",
      data: [],
    },
  ],
});

watch(
  () => JSON.stringify(response.value),
  (newVal) => {
    try {
      const cloned = JSON.parse(newVal);

      cloned.data.forEach(section => {
        section.data.forEach(card => {
          if (card.attachments && Array.isArray(card.attachments)) {
            card.attachments.forEach(att => {
              delete att.data; // remove base64 before storing
            });
          }
        });
      });

      localStorage.setItem('boardData', JSON.stringify(cloned));
    } catch (err) {
      console.error('Error storing boardData in localStorage:', err);
    }
  }
);

// All available tags from all cards
// const allTags = computed(() => {
//   const tags = new Set();
//   response.value.data.forEach(section => {
//     section.data.forEach(card => {
//       if (card.tags) {
//         card.tags.forEach(tag => tags.add(tag));
//       }
//     });
//   });
//   return Array.from(tags);
// });
// Filter data based on search and filter selections
const filteredData = computed(() => {
  return {
    data: response.value.data.map(section => {
      const filteredCards = section.data.filter(card => {
        const matchesSearch = !searchQuery.value || 
          card.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          card.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (card.tags && card.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase())));
        const matchesPriority = !priorityFilter.value || card.priority === priorityFilter.value;
        const matchesTag = !tagFilter.value || 
            (card.tags && card.tags.some(tag => tag === tagFilter.value));
          
          return matchesSearch && matchesPriority && matchesTag;
      });

      return {
        ...section,
        data: filteredCards.length === section.data.length ? section.data : filteredCards
      };
    })
  };
});

// Card management functions
const addNewCard = (event) => {
  if (event && event.index !== undefined) {
    console.log("Added new card", event);
    if (response.value.data[event.index]) {
      // Add the new card to the correct section
      const newCard = {
        ...event.value,
        comments: [],
        tags: event.value.tags || [],
        activities: [
          {
            type: 'created',
            user: 'User',
            timestamp: new Date().toISOString()
          }
        ]
      };
      response.value.data[event.index].data.push(newCard);
    }
  }
};

const editData = (event) => {
  if (!event) return;
  
  const arrayIndex = event.arrayindex;
  const itemIndex = event.itemindex;
  
  if (response.value.data[arrayIndex] && response.value.data[arrayIndex].data[itemIndex]) {
    response.value.data[arrayIndex].data[itemIndex].title = event.title;
    response.value.data[arrayIndex].data[itemIndex].description = event.description;
    response.value.data[arrayIndex].data[itemIndex].deadlineDate = event.deadlineDate;
    response.value.data[arrayIndex].data[itemIndex].attachment = event.attachment;
    response.value.data[arrayIndex].data[itemIndex].priority = event.priority;

    // Make sure we preserve comments and tags if not included in the event
    if (event.comments) {
      response.value.data[arrayIndex].data[itemIndex].comments = event.comments;
    }
    if (event.tags) {
      response.value.data[arrayIndex].data[itemIndex].tags = event.tags;
    }
    const card = response.value.data[arrayIndex].data[itemIndex];
    
    // Track changes for activity log
    const activities = card.activities || [];
    
    // Check for title change
    if (card.title !== event.title) {
      activities.push({
        type: 'updated',
        field: 'title',
        user: 'User',
        oldValue: card.title,
        newValue: event.title,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for description change
    if (card.description !== event.description) {
      activities.push({
        type: 'updated',
        field: 'description',
        user: 'User',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for priority change
    if (card.priority !== event.priority) {
      activities.push({
        type: 'priority-changed',
        user: 'User',
        oldValue: card.priority,
        newValue: event.priority,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for deadline change
    if (card.deadlineDate !== event.deadlineDate) {
      activities.push({
        type: 'deadline-changed',
        user: 'User',
        oldValue: card.deadlineDate,
        newValue: event.deadlineDate,
        timestamp: new Date().toISOString()
      });
    }
    
    // Update the card
    response.value.data[arrayIndex].data[itemIndex] = {
      ...card,
      title: event.title,
      description: event.description,
      deadlineDate: event.deadlineDate,
      priority: event.priority,
      attachment: event.attachment,
      activities: activities
    };
  }
};

const deleteCard = (event) => {
  if (!event) return;
  
  const arrayIndex = event.arrayindex;
  const itemIndex = event.itemindex;
  
  if (response.value.data[arrayIndex] && response.value.data[arrayIndex].data) {
    response.value.data[arrayIndex].data.splice(itemIndex, 1);
  }
};
// Comment management
const addComment = (event) => {
  if (!event) return;
  
  const { arrayIndex, itemIndex, comment } = event;
  
  if (response.value.data[arrayIndex] && response.value.data[arrayIndex].data[itemIndex]) {
    const card = response.value.data[arrayIndex].data[itemIndex];
    
    if (!card.comments) {
      card.comments = [];
    }
    
    if (!card.activities) {
      card.activities = [];
    }
    
    const newComment = {
      text: comment,
      author: "User", // In a real app, this would come from authentication
      timestamp: new Date().toISOString()
    };
    
    // Add to comments
    card.comments.push(newComment);
    
    // Log the activity
    card.activities.push({
      type: 'commented',
      user: 'User',
      value: comment.length > 30 ? comment.substring(0, 30) + '...' : comment,
      timestamp: new Date().toISOString()
    });
  }
};

// Tag management
const addTag = (event) => {
  if (!event) return;
  
  const { arrayIndex, itemIndex, tag } = event;
  
  if (response.value.data[arrayIndex] && response.value.data[arrayIndex].data[itemIndex]) {
    const card = response.value.data[arrayIndex].data[itemIndex];
    
    if (!card.tags) {
      card.tags = [];
    }
    
    if (!card.activities) {
      card.activities = [];
    }
    
    // Only add if the tag doesn't already exist
    if (!card.tags.includes(tag)) {
      card.tags.push(tag);
      
      // Log the activity
      card.activities.push({
        type: 'tag-added',
        user: 'User',
        value: tag,
        timestamp: new Date().toISOString()
      });
    }
  }
};

const removeTag = (event) => {
  if (!event) return;
  
  const { arrayIndex, itemIndex, tag } = event;
  
  if (response.value.data[arrayIndex] && 
  response.value.data[arrayIndex].data[itemIndex]) {
    
    const card = response.value.data[arrayIndex].data[itemIndex];
    
    if (card.tags) {
      card.tags = card.tags.filter(t => t !== tag);
      
      // Log the activity
      if (!card.activities) {
        card.activities = [];
      }
      
      card.activities.push({
        type: 'tag-removed',
        user: 'User',
        value: tag,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Attachment management
const addAttachment = (event) => {
  console.log('event', event); 
  
  if (!event) return;
  
  const { arrayIndex, itemIndex, attachment } = event;
  
  if (response.value.data[arrayIndex] && response.value.data[arrayIndex].data[itemIndex]) {
    const card = response.value.data[arrayIndex].data[itemIndex];
    
    if (!card.attachments) {
      card.attachments = [];
    }
    
    if (!card.activities) {
      card.activities = [];
    }
    
    // Add attachment
    card.attachments.push(attachment);
    
    // Log the activity
    card.activities.push({
      type: 'attachment-added',
      user: 'User',
      value: attachment.name,
      timestamp: new Date().toISOString()
    });
  }
};

const removeAttachment = (event) => {
  if (!event) return;
  
  const { arrayIndex, itemIndex, attachmentIndex } = event;
  
  if (response.value.data[arrayIndex] && response.value.data[arrayIndex].data[itemIndex]) {
    const card = response.value.data[arrayIndex].data[itemIndex];
    
    if (card.attachments && card.attachments[attachmentIndex]) {
      const attachmentName = card.attachments[attachmentIndex].name;
      
      // Remove the attachment
      card.attachments.splice(attachmentIndex, 1);
      
      // Log the activity
      if (!card.activities) {
        card.activities = [];
      }
      
      card.activities.push({
        type: 'attachment-removed',
        user: 'User',
        value: attachmentName,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Board templates and sharing
const loadTemplate = (templateData) => {
  // Keep original sections that don't conflict with template sections
  // eslint-disable-next-line no-unused-vars
  const currentSections = response.value.data.map(section => section.title);
  const templateSections = templateData.data.map(section => section.title);
  
  // Find sections in current board that are not in the template
  const sectionsToKeep = response.value.data.filter(
    section => !templateSections.includes(section.title)
  );
  
  // Combine the template sections with the sections to keep
  response.value = {
    data: [...templateData.data, ...sectionsToKeep]
  };
};

const importBoard = (boardData) => {
  response.value = boardData;
};

const moveCard = (event) => {
  if (!event) return;
  
  const { sourceSection, sourceIndex, targetSection, targetIndex } = event;
  
  if (response.value.data[sourceSection] && 
      response.value.data[sourceSection].data[sourceIndex] &&
      response.value.data[targetSection]) {
        
    const card = response.value.data[sourceSection].data[sourceIndex];
    const sourceSectionName = response.value.data[sourceSection].title;
    const targetSectionName = response.value.data[targetSection].title;
    
    // Remove from source
    response.value.data[sourceSection].data.splice(sourceIndex, 1);
    
    // Add to target
    if (targetIndex !== undefined) {
      response.value.data[targetSection].data.splice(targetIndex, 0, card);
    } else {
      response.value.data[targetSection].data.push(card);
    }
    
    // Add move activity if source and target sections are different
    if (sourceSection !== targetSection) {
      if (!card.activities) {
        card.activities = [];
      }
      
      card.activities.push({
        type: 'moved',
        user: 'User',
        oldValue: sourceSectionName,
        newValue: targetSectionName,
        timestamp: new Date().toISOString()
      });
    }
  }
};
</script>

<style>
body {
  margin: 0;
}
.app-container {
  padding: 20px;
  max-width: 100%;
  transition: background-color 0.3s, color 0.3s;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.app-title {
  text-align: center;
  color: #333;
  font-size: 28px;
  margin: 0;
}

.app-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-filter {
  display: flex;
  gap: 10px;
}

.search-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.tag-filter {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #333;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Dark mode styles */
.dark-mode {
  background-color: #222;
  color: #eee;
}

.dark-mode .app-title {
  color: #eee;
}

.dark-mode .theme-toggle {
  color: #eee;
}

.dark-mode .theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .search-input, 
.dark-mode .filter-select {
  background-color: #333;
  border-color: #444;
  color: #eee;
}

.dark-mode .tvd__column__item {
  background-color: #333;
  color: #eee;
  border-color: #444;
}

.dark-mode .tvd__card__item {
  background-color: #444;
  color: #eee;
  border-color: #555;
}

.dark-mode .tvd__add-btn {
  background-color: #555;
  color: #eee;
}

.dark-mode .tvd__toast {
  background-color: #555;
  color: #eee;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .app-controls {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .search-filter {
    flex-grow: 1;
    flex-wrap: wrap;
  }
  
  .search-input, .filter-select {
    flex-grow: 1;
  }
}

/* New styles for templates and sharing buttons */
.board-actions {
  display: flex;
  gap: 10px;
}

.board-action-btn {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.board-action-btn:hover {
  background-color: #e0e0e0;
}

.dark-mode .board-action-btn {
  background-color: #444;
  color: #eee;
}

.dark-mode .board-action-btn:hover {
  background-color: #555;
}

@media (max-width: 992px) {
  .app-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .board-actions, .search-filter {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>