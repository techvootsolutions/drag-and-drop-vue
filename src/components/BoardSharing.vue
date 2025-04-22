<template>
  <div class="board-sharing">
    <h3 class="sharing-title">Share Board</h3>
    
    <div class="sharing-options">
      <div class="sharing-link">
        <input 
          type="text" 
          v-model="shareLink" 
          class="sharing-link-input" 
          readonly
        />
        <button class="sharing-link-copy" @click="copyLink">
          <i class="fa-solid fa-copy"></i>
        </button>
      </div>
      
      <div class="sharing-permissions">
        <label class="sharing-label">Access level:</label>
        <select v-model="accessLevel" class="sharing-select">
          <option value="view">View only</option>
          <option value="comment">Can comment</option>
          <option value="edit">Can edit</option>
        </select>
      </div>
      
      <button class="sharing-generate" @click="generateLink">
        Generate Link
      </button>
    </div>
    
    <div class="sharing-collaborators">
      <h4>Collaborators</h4>
      
      <div class="collaborator-list">
        <div v-for="(collaborator, index) in collaborators" :key="index" class="collaborator-item">
          <div class="collaborator-avatar">
            <span>{{ getInitials(collaborator.name) }}</span>
          </div>
          <div class="collaborator-info">
            <div class="collaborator-name">{{ collaborator.name }}</div>
            <div class="collaborator-access">{{ getAccessLabel(collaborator.access) }}</div>
          </div>
          <div class="collaborator-actions">
            <select v-model="collaborator.access" class="collaborator-select">
              <option value="view">View only</option>
              <option value="comment">Can comment</option>
              <option value="edit">Can edit</option>
            </select>
            <button class="collaborator-remove" @click="removeCollaborator(index)">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="collaborator-add">
        <input 
          type="email" 
          v-model="newCollaboratorEmail" 
          placeholder="Email address"
          class="collaborator-email"
        />
        <select v-model="newCollaboratorAccess" class="collaborator-access-select">
          <option value="view">View only</option>
          <option value="comment">Can comment</option>
          <option value="edit">Can edit</option>
        </select>
        <button class="collaborator-add-btn" @click="addCollaborator">
          Invite
        </button>
      </div>
    </div>
    
    <div class="sharing-export">
      <h4>Export Board</h4>
      <div class="export-options">
        <button class="export-btn" @click="exportBoard('json')">
          <i class="fa-solid fa-file-code"></i> Export as JSON
        </button>
        <button class="export-btn" @click="exportBoard('csv')">
          <i class="fa-solid fa-file-csv"></i> Export as CSV
        </button>
        <button class="export-btn" @click="exportBoard('pdf')">
          <i class="fa-solid fa-file-pdf"></i> Export as PDF
        </button>
      </div>
    </div>
    
    <div class="sharing-import">
      <h4>Import Board</h4>
      <div class="import-option">
        <label for="import-file" class="import-label">
          <i class="fa-solid fa-file-import"></i> Import from file
        </label>
        <input 
          id="import-file" 
          type="file" 
          accept=".json,.csv" 
          @change="importBoard"
          style="display: none;"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps({
  boardId: {
    type: String,
    required: true
  },
  boardData: {
    type: Object,
    required: true
  }
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['import-board', 'export-complete', 'add-collaborator', 'remove-collaborator']);

// Generate a unique board ID if not available
const uniqueId = computed(() => {
  return props.boardId || Math.random().toString(36).substring(2, 15);
});

// Sharing link state
const shareLink = ref('');
const accessLevel = ref('view');

// Collaborators state
const collaborators = ref([
  { name: 'John Doe', email: 'john@example.com', access: 'edit' },
  { name: 'Jane Smith', email: 'jane@example.com', access: 'comment' }
]);
const newCollaboratorEmail = ref('');
const newCollaboratorAccess = ref('view');

// Generate a shareable link
const generateLink = () => {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();
  params.set('id', uniqueId.value);
  params.set('access', accessLevel.value);
  
  // Generate a short token for security (in a real app, this would be more secure)
  const token = Math.random().toString(36).substring(2, 10);
  params.set('token', token);
  
  shareLink.value = `${baseUrl}/shared-board?${params.toString()}`;
  
  // Show a success message (this would use a toast in a real app)
  alert('Shareable link generated!');
};

// Copy the shareable link to clipboard
const copyLink = () => {
  if (shareLink.value) {
    navigator.clipboard.writeText(shareLink.value)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
        // Fallback selection method
        const el = document.querySelector('.sharing-link-input');
        el.select();
        document.execCommand('copy');
      });
  } else {
    alert('Generate a link first');
  }
};

// Get access level label
const getAccessLabel = (access) => {
  switch (access) {
    case 'view': return 'View only';
    case 'comment': return 'Can comment';
    case 'edit': return 'Can edit';
    default: return 'Unknown access';
  }
};

// Get user initials for the avatar
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Add a new collaborator
const addCollaborator = () => {
  if (!newCollaboratorEmail.value || !newCollaboratorEmail.value.includes('@')) {
    alert('Please enter a valid email address');
    return;
  }
  
  // Check if the email already exists
  if (collaborators.value.some(c => c.email === newCollaboratorEmail.value)) {
    alert('This email is already in the collaborators list');
    return;
  }
  
  // Generate a name from the email (in a real app, this would be the user's actual name)
  const name = newCollaboratorEmail.value.split('@')[0]
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  
  const newCollaborator = {
    name,
    email: newCollaboratorEmail.value,
    access: newCollaboratorAccess.value
  };
  
  collaborators.value.push(newCollaborator);
  emit('add-collaborator', newCollaborator);
  
  // Reset the input fields
  newCollaboratorEmail.value = '';
  newCollaboratorAccess.value = 'view';
};

// Remove a collaborator
const removeCollaborator = (index) => {
  const collaborator = collaborators.value[index];
  collaborators.value.splice(index, 1);
  emit('remove-collaborator', collaborator);
};

// Export the board in various formats
const exportBoard = (format) => {
  const boardDataCopy = JSON.parse(JSON.stringify(props.boardData));
  
  if (format === 'json') {
    // Create and download a JSON file
    const dataStr = JSON.stringify(boardDataCopy, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadFile(blob, `kanban-board-${uniqueId.value}.json`);
  } 
  else if (format === 'csv') {
    // Convert board data to CSV format
    let csv = 'Section,Title,Description,Priority,Deadline,Tags\n';
    
    boardDataCopy.data.forEach(section => {
      section.data.forEach(card => {
        const description = card.description.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML
        const tags = card.tags ? card.tags.join(';') : '';
        
        csv += `"${section.title}","${card.title}","${description}","${card.priority}","${card.deadlineDate}","${tags}"\n`;
      });
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadFile(blob, `kanban-board-${uniqueId.value}.csv`);
  }
  else if (format === 'pdf') {
    // In a real app, you would generate a PDF
    // For simplicity in this example, we'll just show an alert
    alert('PDF export would be implemented here in a real application');
  }
  
  emit('export-complete', { format });
};

// Helper function to download a file
const downloadFile = (blob, filename) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import a board from a file
const importBoard = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      if (file.name.endsWith('.json')) {
        const importedData = JSON.parse(e.target.result);
        emit('import-board', importedData);
      } 
      else if (file.name.endsWith('.csv')) {
        // In a real app, you would parse the CSV here
        alert('CSV import would be implemented here in a real application');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import board: ' + error.message);
    }
  };
  
  reader.onerror = () => {
    alert('Failed to read the file');
  };
  
  if (file.name.endsWith('.json')) {
    reader.readAsText(file);
  } else if (file.name.endsWith('.csv')) {
    reader.readAsText(file);
  } else {
    alert('Unsupported file format. Please use JSON or CSV.');
  }
  
  // Reset the input
  event.target.value = null;
};
</script>

<style>
.board-sharing {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.sharing-title {
  font-size: 20px;
  margin-bottom: 15px;
}

.sharing-options {
  margin-bottom: 20px;
}

.sharing-link {
  display: flex;
  margin-bottom: 15px;
}

.sharing-link-input {
  flex-grow: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.sharing-link-copy {
  padding: 8px 12px;
  background-color: #4a6cff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.sharing-permissions {
  margin-bottom: 15px;
}

.sharing-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.sharing-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.sharing-generate {
  width: 100%;
  padding: 10px;
  background-color: #4a6cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.sharing-collaborators {
  margin-top: 25px;
}

.collaborator-list {
  margin-bottom: 15px;
}

.collaborator-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.collaborator-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4a6cff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.collaborator-info {
  flex-grow: 1;
}

.collaborator-name {
  font-weight: 500;
}

.collaborator-access {
  font-size: 12px;
  color: #777;
}

.collaborator-actions {
  display: flex;
  align-items: center;
}

.collaborator-select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
}

.collaborator-remove {
  background: none;
  border: none;
  color: #e53935;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 4px;
}

.collaborator-remove:hover {
  background-color: rgba(229, 57, 53, 0.1);
}

.collaborator-add {
  display: flex;
  gap: 8px;
}

.collaborator-email {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.collaborator-access-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 120px;
}

.collaborator-add-btn {
  padding: 8px 15px;
  background-color: #4a6cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sharing-export, .sharing-import {
  margin-top: 25px;
}

.export-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.export-btn, .import-label {
  padding: 8px 15px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.export-btn:hover, .import-label:hover {
  background-color: #e0e0e0;
}

/* Dark Mode Styles */
.dark-mode .board-sharing {
  background-color: #333;
  color: #eee;
}

.dark-mode .sharing-link-input {
  background-color: #444;
  border-color: #555;
  color: #eee;
}

.dark-mode .sharing-select,
.dark-mode .collaborator-select,
.dark-mode .collaborator-email,
.dark-mode .collaborator-access-select {
  background-color: #444;
  border-color: #555;
  color: #eee;
}

.dark-mode .collaborator-item {
  background-color: #444;
}

.dark-mode .collaborator-access {
  color: #bbb;
}

.dark-mode .export-btn,
.dark-mode .import-label {
  background-color: #444;
  color: #eee;
}

.dark-mode .export-btn:hover,
.dark-mode .import-label:hover {
  background-color: #555;
}

@media (max-width: 768px) {
  .collaborator-add, .export-options {
    flex-direction: column;
  }
  
  .export-btn, .import-label {
    width: 100%;
  }
}
</style>