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
    <!-- <template v-slot:customCard="{ item }">
      <div @click="slotclick(item)">
        {{ item }}
        <p>{{item.title}}</p>
      </div>
    </template> -->
      <!-- <template v-slot:cardForm>
      <input type="text" />
    </template> -->
    </DragAndDropVue>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DragAndDropVue from "./components/SimpleDrag.vue";
// import dummyData from '../src/assets/data/data'

// const response = ref(dummyData);

const response = ref([
  {
    title: "Section 1",
    data: [
      {
        // name:'dev'
        title: "Card 1",
        description: "<p>Description<p>",
        attachment: [
          {
            type: 'image',
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          },
          {
            type: 'image',
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
          },
          {
            type: 'video',
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }
      ],
        deadlineDate: "Jan 11, 2024",
      },
      {
        title: "Card 2",
        description: "<p>Description<p>",
        attachment: [
          {
            type: 'video',
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          },
          {
            type: 'image',
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
          },
          {
            type: 'pdf',
            url: '',
          }
        ],
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

