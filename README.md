# drag-and-drop-vue

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Props](#available-props)
- [Events](#events)

The main usage of this package is for drag-and-drop functionality. The user create multiple sections and in that sections we provide the facilities to create multiple cards. all cards are swapable and also drag and drop in any section. 
The user can also Edit and Delete card.
the user can set there custom model for edit and delete, and there is also functionality for add custom fields in cards.

## features

- Support drag and drop between different lists.
- Support Swap functionality between two cards.
- Provide custom facility to edit and delete card model.
- User can customise the fields according to needs.

## install
```
npm i @techvootsolutions/drag-and-drop-vue
```
``` javascript
import { DragAndDropVue } from '@techvootsolutions/drag-and-drop-vue';

export default {
  // ...
  components: {
    DragAndDropVue
  }
  // ...
}
```
### Compiles and minifies for production
```
npm run build
```

## Usage

<DragAndDropVue />

*value* prop if passed should be a response object

``` html

Vue

<template>
  <div>
    <DragAndDropVue
      :responseData="response"
      :isCustomEdit="false"     // to enable custom edit and delete.
      addCardTitle="+Add Card"
      addSectionTitle="Add Section"
      @add-card="addNewCardEvent"
      @edit-card="editCardEvent"
      @delete-card="deleteCardEvent"
      @dragstart="dragEvent"
      @dropItem="dropEvent"
    />
  </div>
</template>

<script>
import { DragAndDropVue } from '@techvootsolutions/drag-and-drop-vue';

export default {
  name: "App",
  components: {
    DragAndDropVue,
  },
  data(){
    return {
      response: [
        {
          title: "Section 1",
          data: [
            {
              title: "Card 1",
              description: "<p>Description<p>",
              attachment: null,
              deadlineDate: "Jan 11, 2024",
            },
            {
              title: "Card 2",
              description: "<p>Description<p>",
              attachment: null,
              deadlineDate: "Jan 11, 2024",
            },
            {
              title: "Card 3",
              description: "<p>Description<p>",
              attachment: null,
              deadlineDate: "Jan 11, 2024",
            },
          ],
        },
        {
          title: "Section 2",
          data: [
            {
              title: 66,
              description: "<p>Description<p>",
              attachment: null,
              deadlineDate: "Jan 11, 2024",
            },
          ],
        },
        {
          title: "Section 3",
          data: [],
        },
      ]
    }
  },
  methods: {
    addNewCardEvent(event) {
      // add card event
    },
    editCardEvent(event) {
      // edit card event
    },
    deleteCardEvent(event) {
      // delete card event
    },
    dragEvent(event) {
      // drag start event
    },
    dropEvent(event) {
      // drop event
    }
  }
}

</script>

```

## Available props


| Prop                          | Type            | Default     | Description                              |
|-------------------------------|-----------------|-------------|------------------------------------------|
| responseData                  | Array           |             | Array or Object value of card data       |
| addSectionTitle               | Text            |             | Section Title property                   |
| addCardTitle                  | Text            |             | Card Title property                      |
| isCustomEdit                  | Boolean         | False       | Custom Edit Functionality, if need to do |
                                                                  custom edit and delete event outside.    


## Events

These events are emitted on actions in the datepicker

### `@add-card`
Event to be emitted by component on add card.

```jsx
<DragAndDropVue @add-card="addCard" />
```
```ts
addCard(event) {
  // add card event
}
```

### `@edit-card`
Event to be emitted by component on edit card.

```jsx
<DragAndDropVue @edit-card="editCard" />
```
```ts
editCard(event) {
  // edit card event
}
```

### `@delete-card`
Event to be emitted by component on delete card.

```jsx
<DragAndDropVue @delete-card="deleteCard" />
```
```ts
deleteCard(event) {
  // delete card event
}
```

### `@dragstart`
Event to be emitted by component on drag start.

```jsx
<DragAndDropVue @dragstart="dragStart" />
```
```ts
dragStart(event) {
  // drag start event
}
```
### `@dropItem`
Event to be emitted by component on drop card.

```jsx
<DragAndDropVue @dropItem="dropCard" />
```
```ts
dropCard(event) {
  // drop event
}
```

## Slots

Slots will help you customize add card content. 

Sometimes you need to add your custom field in card.
An example would be to use custom input field :
when you use this slot then you are not able to get add-card event.

``` html
<DragAndDropVue
  :responseData="response"
  :isCustomEdit="false"     // to enable custom edit and delete.
  addCardTitle="+Add Card"
  addSectionTitle="Add Section"
  @edit-card="editCardEvent"
  @delete-card="deleteCardEvent"
>
  <template v-slot:cardForm>
    <input type="text" />
  </template>
</DragAndDropVue>
```

