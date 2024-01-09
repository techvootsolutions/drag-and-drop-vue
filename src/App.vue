<template>
  <div>
    <SimpleDrag
      :isCustomEdit="false"
      :responseData="response"
      :isModalOpened="modalOpened"
      addCardTitle="+Add Card"
      addSectionTitle="Add Section"
      @add-card="addNewCard"
      @edit-card="editData"
      @delete-card="deleteCard"
    >
      <!-- <template v-slot:cardForm>
      <input type="shreya" />
    </template> -->
    </SimpleDrag>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import DragNDrop from 'drag-n-drop-vue';
import SimpleDrag from "./components/SimpleDrag.vue";

const response = ref({
  data: [
    {
      title: "Section 1",
      drop_col_id: "",
      data: [
        { 
          title: 'Card 1',
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'<p>",
          attachment: null,
          deadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), 
        },
        { 
          title: 'Card 2',
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'<p>",
          attachment: null,
          deadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          },
        { 
          title: "Card 3",
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'<p>",
          attachment: null,
          deadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        },
      ],
    },
    {
      title: "Section 2",
      data: [
        { 
          title: 66, 
          description: "<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'<p>",
          attachment: null,
          deadlineDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          }
      ],
    },
    {
      title: "Section 3",
      data: [],
    },
  ],
});
const modalOpened = ref(false);
const addNewCard = () => {};
const editData = (event) => {
  const arrayIndex = event.arrayindex;
  const itemIndex = event.itemindex;
  response.value.data[arrayIndex].data[itemIndex].title = event.title;
  response.value.data[arrayIndex].data[itemIndex].description = event.description;
  response.value.data[arrayIndex].data[itemIndex].deadlineDate = event.deadlineDate;
  response.value.data[arrayIndex].data[itemIndex].attachment = event.attachment;
};
const deleteCard = (event) => {
  const arrayIndex = event.arrayindex;
  const itemIndex = event.itemindex;
  response.value.data[arrayIndex].data.splice(itemIndex, 1);
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
