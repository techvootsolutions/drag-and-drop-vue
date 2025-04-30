# drag-and-drop-vue

A powerful drag-and-drop kanban board component for Vue 3.x with rich card features.

## Demo

Check out the demo project here: [drag-and-drop-vue-demo](https://github.com/tvshreyanshi/drag-and-dop-test-package)

- [About](#about)
- [Features](#features)
- [Use Cases](#use-cases)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#available-props)
- [Events](#events)
- [Slots](#slots)

## About

**`drag-and-drop-vue`** is a feature-rich and customizable Kanban board component built with Vue 3. It allows you to manage tasks visually by dragging and dropping cards between sections. The component supports advanced card features like priority levels, deadlines, comments, attachments, and tagging—making it ideal for project management tools, to-do applications, CRMs, and productivity dashboards.

This package is fully reactive, supports dark mode, and provides built-in events and slots for deep customization.


## Features

- Create and manage multiple sections (columns)
- Real-time drag-and-drop interaction with Vue 3 reactivity
- Custom form slot for card creation/editing
- Fully customizable card layout using slots
- Drag and drop cards between sections
- Easy integration into existing Vue 3 projects
- Rich card features:
  - Title and description
  - Priority levels (urgent, high, medium, low)
  - Deadline dates
  - File attachments (images, documents)
  - Comments system
  - Tags/labels
- Dark mode support
- Search and filter capabilities

## Use Cases

- Task and project management boards
- Product development pipelines
- Bug tracking systems
- Personal to-do lists
- CRM systems
- Agile/scrum boards

## Installation
```bash
npm i dragandropvue
```

Then import and register the component:
```javascript
import { SimpleDragVue } from 'dragandropvue';

export default {
  components: {
    SimpleDragVue
  }
}
```

## Usage

Basic usage example:

```html
<template>
  <SimpleDragVue
    :responseData="boardData"
    :isModalOpened="modalOpened"
    addCardTitle="+Add Card"
    addSectionTitle="Add Section"
    @add-card="handleAddCard"
    @edit-card="handleEditCard"
    @delete-card="handleDeleteCard"
    @add-comment="handleAddComment"
    @add-tag="handleAddTag"
    @remove-tag="handleRemoveTag"
    @move-card="handleMoveCard"
  />
</template>

<script>
export default {
  data() {
    return {
      boardData: {
        data: [
          {
            title: "To Do",
            data: [
              {
                title: "Design Updates",
                description: "<p>Update the homepage design</p>",
                attachment: null,
                deadlineDate: "Apr 20, 2025",
                priority: "high",
                comments: [],
                tags: ["design", "frontend"]
              }
            ]
          },
          {
            title: "In Progress",
            data: []
          },
          {
            title: "Done",
            data: []
          }
        ]
      },
      modalOpened: false
    }
  },
  methods: {
    handleAddCard(event) {
      // Handle new card addition
    },
    handleEditCard(event) {
      // Handle card editing
    },
    // ... other event handlers
  }
}
</script>
```

## Available Props

| Prop              | Type            | Default     | Description                                          |
|-------------------|-----------------|-------------|------------------------------------------------------|
| responseData      | Array\|Object   | required    | Board data structure with sections and cards         |
| addSectionTitle   | String          | "Add Section"| Text for the add section button                     |
| addCardTitle      | String          | "+Add Card" | Text for the add card button                        |
| isCustomEdit      | Boolean         | false       | Enable custom edit functionality                     |
| isModalOpened     | Boolean         | false       | Control edit modal visibility                        |

## Events

| Event         | Output                           | Description                                    |
|---------------|----------------------------------|------------------------------------------------|
| add-card      | { index, value }                | Emitted when a new card is added              |
| edit-card     | { arrayIndex, itemIndex, ... }  | Emitted when a card is edited                 |
| delete-card   | { arrayIndex, itemIndex }       | Emitted when a card is deleted                |
| add-comment   | { arrayIndex, itemIndex, comment}| Emitted when a comment is added to a card     |
| add-tag       | { arrayIndex, itemIndex, tag }  | Emitted when a tag is added to a card         |
| remove-tag    | { arrayIndex, itemIndex, tag }  | Emitted when a tag is removed from a card     |
| move-card     | { sourceSection, targetSection, sourceIndex, targetIndex } | Emitted when a card is moved |

## Card Features

### Attachments
Cards support file attachments with the following features:
- Image preview
- File download
- Size and type information
- Multiple attachments per card

```html
<!-- Example of card with attachment -->
<script>
const card = {
  title: "Task with attachment",
  attachment: {
    name: "design.jpg",
    type: "image/jpeg",
    size: 1024000,
    date: "2025-04-16",
    data: "base64-encoded-data"
  }
}
</script>
```

### Comments
Each card can have multiple comments with:
- Author information
- Timestamp
- Comment text
- Thread-like display

### Tags/Labels
Cards support multiple tags for easy categorization and filtering:
- Add/remove tags
- Custom tag colors
- Filter cards by tags

### Priority Levels
Cards can be assigned different priority levels:
- Urgent
- High
- Medium
- Low

Each priority level comes with its own visual indicator.

## Slots

Use slots to customize card content:

```html
<template v-slot:cardForm>
  <!-- Custom form fields -->
  <input type="text" placeholder="Custom field" />
  <select>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
  </select>
</template>
```

## Development

```bash
# Compile and hot-reload for development
npm run serve

# Compile and minify for production
npm run build

# Lint and fix files
npm run lint
```