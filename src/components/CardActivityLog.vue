<template>
  <div class="tvd__card__activity">
    <h4 class="tvd__activity-title" @click="toggleActivity">
      <i class="fa-solid fa-history"></i> Activity Log
      <i :class="showActivity ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
    </h4>
    
    <div class="tvd__activity-list" v-if="showActivity">
      <div v-if="activities.length === 0" class="tvd__activity-empty">
        No activity to show
      </div>
      
      <div v-for="(activity, index) in activities" :key="index" class="tvd__activity-item">
        <div class="tvd__activity-icon">
          <i :class="getActivityIcon(activity.type)"></i>
        </div>
        <div class="tvd__activity-content">
          <div class="tvd__activity-message" v-html="formatActivityMessage(activity)"></div>
          <div class="tvd__activity-time">{{ formatActivityTime(activity.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// eslint-disable-next-line no-undef, no-unused-vars
const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  }
});

const showActivity = ref(false);

// Toggle activity log visibility
const toggleActivity = () => {
  showActivity.value = !showActivity.value;
};

// Helper function to get the appropriate icon for the activity
const getActivityIcon = (type) => {
  switch (type) {
    case 'created':
      return 'fa-solid fa-plus-circle';
    case 'updated':
      return 'fa-solid fa-pencil';
    case 'moved':
      return 'fa-solid fa-arrows-alt';
    case 'commented':
      return 'fa-solid fa-comment';
    case 'attachment-added':
      return 'fa-solid fa-paperclip';
    case 'attachment-removed':
      return 'fa-solid fa-unlink';
    case 'tag-added':
      return 'fa-solid fa-tag';
    case 'tag-removed':
      return 'fa-solid fa-times';
    case 'priority-changed':
      return 'fa-solid fa-flag';
    case 'deadline-changed':
      return 'fa-solid fa-calendar-alt';
    default:
      return 'fa-solid fa-info-circle';
  }
};

// Format the activity message with HTML
const formatActivityMessage = (activity) => {
  let message = `<span class="tvd__activity-user">${activity.user}</span> `;
  
  switch (activity.type) {
    case 'created':
      message += 'created this card';
      break;
    case 'updated':
      message += `updated ${activity.field ? activity.field : 'card'}`;
      if (activity.oldValue && activity.newValue) {
        message += ` from <span class="tvd__activity-value">${activity.oldValue}</span> to <span class="tvd__activity-value">${activity.newValue}</span>`;
      }
      break;
    case 'moved':
      message += `moved card from <span class="tvd__activity-value">${activity.oldValue}</span> to <span class="tvd__activity-value">${activity.newValue}</span>`;
      break;
    case 'commented':
      message += `commented: <span class="tvd__activity-value">"${activity.value}"</span>`;
      break;
    case 'attachment-added':
      message += `added attachment <span class="tvd__activity-value">${activity.value}</span>`;
      break;
    case 'attachment-removed':
      message += `removed attachment <span class="tvd__activity-value">${activity.value}</span>`;
      break;
    case 'tag-added':
      message += `added tag <span class="tvd__activity-tag">#${activity.value}</span>`;
      break;
    case 'tag-removed':
      message += `removed tag <span class="tvd__activity-tag">#${activity.value}</span>`;
      break;
    case 'priority-changed':
      message += `changed priority from <span class="tvd__activity-value">${activity.oldValue}</span> to <span class="tvd__activity-value">${activity.newValue}</span>`;
      break;
    case 'deadline-changed':
      message += `changed deadline from <span class="tvd__activity-value">${activity.oldValue}</span> to <span class="tvd__activity-value">${activity.newValue}</span>`;
      break;
    default:
      message += activity.message || 'performed an action';
  }
  
  return message;
};

// Format the activity timestamp
const formatActivityTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    // Within a week
    return date.toLocaleDateString([], { weekday: 'long' }) + ' at ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Older
    return date.toLocaleDateString() + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};
</script>

<style>
.tvd__card__activity {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.tvd__activity-title {
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.tvd__activity-list {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 5px;
}

.tvd__activity-empty {
  color: #999;
  text-align: center;
  padding: 10px;
  font-style: italic;
}

.tvd__activity-item {
  display: flex;
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.tvd__activity-icon {
  margin-right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6cff;
}

.tvd__activity-content {
  flex-grow: 1;
}

.tvd__activity-message {
  font-size: 13px;
  margin-bottom: 3px;
}

.tvd__activity-time {
  font-size: 11px;
  color: #888;
}

.tvd__activity-user {
  font-weight: 600;
  color: #4a6cff;
}

.tvd__activity-value {
  font-weight: 500;
}

.tvd__activity-tag {
  background-color: #e9efff;
  color: #4a6cff;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 12px;
}

/* Dark Mode Styles */
.dark-mode .tvd__card__activity {
  border-top-color: #444;
}

.dark-mode .tvd__activity-item {
  background-color: #3a3a3a;
}

.dark-mode .tvd__activity-empty {
  color: #aaa;
}

.dark-mode .tvd__activity-time {
  color: #aaa;
}

.dark-mode .tvd__activity-user {
  color: #a0c2ff;
}

.dark-mode .tvd__activity-tag {
  background-color: #333;
  color: #a0c2ff;
}
</style>