# drag-and-drop-vue

- [Install](#install)
- [Usage](#usage)
- [Props](#available-props)
- [Events](#events)

The main usage of this package is for drag-and-drop functionality. The user create multiple sections and in that sections provide the facilities to create multiple cards. all cards are swapable and also drag and drop in any section. 
The user can also Edit and Delete card. 

## install
```
npm i dragandropvue
```
``` javascript
import { SimpleDragVue } from 'dragandropvue';

export default {
  // ...
  components: {
    SimpleDragVue
  }
  // ...
}
```
### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
## Usage

<SimpleDragVue />

*value* prop if passed should be a response object

``` html

<script>
data() {
    return {
      response: {
        data: [
    {
      title: "Section 1",
      drop_col_id: "",
      data: [
        { 
          title: 'Card 1',
          description: "<p>Description Of card<p>",
          attachment: null,
          deadlineDate: Deadline Date, 
        },
        { 
          title: 'Card 2',
          description: "<p>Description Of card<p>",
          attachment: null,
          deadlineDate: Deadline Date,
          },
        { 
          title: "Card 3",
          description: "<p>Description Of card<p>",
          attachment: null,
          deadlineDate: Deadline Date,
        },
      ],
    },
    {
      title: "Section 2",
      data: [
        { 
          title: 66, 
          description: "<p>Description Of card<p>",
          attachment: null,
          deadlineDate: Deadline Date,
        }
      ],
    },
    {
      title: "Section 3",
      data: [],
    },
  ],
      },
      modalOpened: false
    }
  },

</script>
<SimpleDragVue
  :responseData="response"
  :isModalOpened="modalOpened"
  addCardTitle="+Add Card"
  addSectionTitle="Add Section"
/>
```
Emits events

``` html
<SimpleDragVue
  :responseData="response"
  :isModalOpened="modalOpened"
  addCardTitle="+Add Card"
  addSectionTitle="Add Section"
  @add-card="addNewCardEvent"
  @edit-card="editCardEvent"
>
```

## Available props


| Prop                          | Type            | Default     | Description                              |
|-------------------------------|-----------------|-------------|------------------------------------------|
| responseData                  | Array\|Object   |             | Array or Object value of card data       |
| addSectionTitle               | Text            |             | Section Title property                   |
| addCardTitle                  | Text            |             | Card Title property                      |
| isCustomEdit                  | Boolean         | False       | Custome Edit Functionality               |


## Events

These events are emitted on actions in the datepicker

| Event             | Output     | Description                          |
|-------------------|------------|--------------------------------------|
| add-card          |            | The Card is Added                    |
| edit-card         |            | The Card is Edited                   |
| delete-card       |            | The Card is Deleted                  |


## Slots

Slots will help you customize content. 

Sometimes you need to add your custom field in card.
An example would be to use custom input field :
``` html

<template v-slot:cardForm>
  <input type="text" />
</template>
```

