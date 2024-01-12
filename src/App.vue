<template>
  <div>
    <DragAndDropVue
      :isCustomEdit="false"
      :responseData="response"
      addSectionTitle="Add Section"
      @dragstart="dragEvent"
      @dropItem="dropEvent"
      @add-card="addNewCard"
      @edit-card="editData"
      @delete-card="deleteCard"
      @column-added="addCol"

    >
    <template v-slot:customCard="{ item }">
      {{ item }}
      <p>{{item.title}}</p>
    </template>
      <!-- <template v-slot:cardForm>
      <input type="text" />
    </template> -->
    </DragAndDropVue>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DragAndDropVue from "./components/SimpleDrag.vue";

const response = ref([
  // {
  //   title: "Section 1",
  //   data: [
  //     {
  //       // name:'dev'
  //       title: "Card 1",
  //       description: "<p>Description<p>",
  //       attachment: null,
  //       deadlineDate: "Jan 11, 2024",
  //     },
  //     {
  //       title: "Card 2",
  //       description: "<p>Description<p>",
  //       attachment: null,
  //       deadlineDate: "Jan 11, 2024",
  //     },
  //     {
  //       title: "Card 3",
  //       description: "<p>Description<p>",
  //       attachment: null,
  //       deadlineDate: "Jan 11, 2024",
  //     },
  //   ],
  // },
  // {
  //   title: "Section 2",
  //   data: [
  //     {
  //       title: 66,
  //       description: "<p>Description<p>",
  //       attachment: null,
  //       deadlineDate: "Jan 11, 2024",
  //     },
  //   ],
  // },
  // {
  //   title: "Section 3",
  //   data: [],
  // },
]);
const addNewCard = () => {};
const addCol = () => {};
const editData = (event) => {
  console.log(event);
  //   const arrayIndex = event.arrayindex;
  //   const itemIndex = event.itemindex;
  //   response.value[arrayIndex].data[itemIndex].title = event.title;
  //   response.value[arrayIndex].data[itemIndex].description =
  //     event.description;
  //   response.value[arrayIndex].data[itemIndex].deadlineDate =
  //     event.deadlineDate;
  //   response.value[arrayIndex].data[itemIndex].attachment = event.attachment;
};
const deleteCard = (event) => {
  console.log("delete ", event);
  //   const arrayIndex = event.arrayindex;
  //   const itemIndex = event.itemindex;
  //   response.value[arrayIndex].data.splice(itemIndex, 1);
};

const dragEvent = (event) => {
  console.log("event", event);
};

const dropEvent = (event) => {
  console.log("drop event", event);
};
</script>

