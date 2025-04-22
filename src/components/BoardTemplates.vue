<template>
  <div class="board-templates">
    <h3 class="templates-title">Board Templates</h3>
    <div class="templates-grid">
      <div 
        v-for="(template, index) in templates" 
        :key="index" 
        class="template-item"
        @click="loadTemplate(template)"
      >
        <div class="template-preview">
          <i :class="template.icon"></i>
        </div>
        <div class="template-info">
          <h4>{{ template.name }}</h4>
          <p>{{ template.description }}</p>
        </div>
      </div>
      
      <div class="template-item save-template" @click="saveCurrentAsTemplate">
        <div class="template-preview">
          <i class="fa-solid fa-save"></i>
        </div>
        <div class="template-info">
          <h4>Save Current Board</h4>
          <p>Save your board as a template</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps({
  currentBoard: {
    type: Object,
    required: true
  }
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['load-template', 'save-template']);

// Sample templates - in a real app these could be loaded from a database
const templates = ref([
  {
    name: 'Task Management',
    description: 'Sections: To Do, In Progress, Done',
    icon: 'fa-solid fa-tasks',
    data: {
      data: [
        { title: 'To Do', data: [] },
        { title: 'In Progress', data: [] },
        { title: 'Done', data: [] }
      ]
    }
  },
  {
    name: 'Project Management',
    description: 'Sections: Planning, Development, Testing, Deployment',
    icon: 'fa-solid fa-project-diagram',
    data: {
      data: [
        { title: 'Planning', data: [] },
        { title: 'Development', data: [] },
        { title: 'Testing', data: [] },
        { title: 'Deployment', data: [] }
      ]
    }
  },
  {
    name: 'Idea Board',
    description: 'Sections: Ideas, Researching, Validated, Implemented',
    icon: 'fa-solid fa-lightbulb',
    data: {
      data: [
        { title: 'Ideas', data: [] },
        { title: 'Researching', data: [] },
        { title: 'Validated', data: [] },
        { title: 'Implemented', data: [] }
      ]
    }
  }
]);

// Load a template
const loadTemplate = (template) => {
  if (confirm('Loading a template will replace your current board. Continue?')) {
    emit('load-template', template.data);
  }
};

// Save the current board as a template
const saveCurrentAsTemplate = () => {
  const templateName = prompt('Enter a name for your template:');
  if (templateName) {
    const templateDescription = prompt('Enter a description for your template:');
    const newTemplate = {
      name: templateName,
      description: templateDescription || 'Custom template',
      icon: 'fa-solid fa-star',
      data: JSON.parse(JSON.stringify(props.currentBoard))
    };
    
    templates.value.push(newTemplate);
    emit('save-template', newTemplate);
    
    // In a real app, you would save this to localStorage or a database
    localStorage.setItem('boardTemplates', JSON.stringify(templates.value));
  }
};
</script>

<style>
.board-templates {
  margin: 20px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.templates-title {
  font-size: 20px;
  margin-bottom: 15px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.template-item {
  display: flex;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.template-preview {
  margin-right: 15px;
  font-size: 24px;
  color: #4a6cff;
  display: flex;
  align-items: center;
}

.template-info h4 {
  margin: 0 0 5px;
  font-size: 16px;
}

.template-info p {
  margin: 0;
  font-size: 12px;
  color: #777;
}

.save-template {
  border: 2px dashed #ddd;
}

/* Dark mode styles */
.dark-mode .board-templates {
  background-color: #333;
}

.dark-mode .template-item {
  background-color: #444;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.dark-mode .template-info h4 {
  color: #eee;
}

.dark-mode .template-info p {
  color: #bbb;
}

.dark-mode .save-template {
  border-color: #555;
}

@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }
}
</style>