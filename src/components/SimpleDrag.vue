<template>
  <section>
    <ul class="tvd__column__list">
      <li
        class="tvd__column__item"
        v-for="(data, index) in response.data"
        :key="index"
      >
      <!-- section title -->
        <div class="tvd__column__title--wrapper">
          <h2>{{ data.title }}</h2>

          <i
            class="tvd__column__item--cta fa-solid fa-plus tvd__cursor-pointer"
            @click.prevent="showAddCardUI(index)"
          ></i>
          <!-- <i class="tvd__icons fa-solid fa-ellipsis"></i> -->
        </div>
        <ul
          class="tvd__card__list"
          @drop.prevent="dropItem(index, $event)"
          @dragover.prevent="allowDrop"
        >
          <li
            class="tvd__card__item"
            v-for="(item, itemindex) in data.data"
            :key="itemindex"
            :draggable="true"
            @dragstart="dragStart(index, itemindex)"
            @dragover.prevent="internalAllowDrop"
            @drop.prevent="internalDrop(index, itemindex)"
          >
            <div class="tvd__card__field">
              <!-- card title -->
              <span
                v-if="item && item.title"
                v-html="item.title"
                class="tvd__card__tag"
                @click="openModal(item, index, itemindex, false)"
              ></span>
              <div>
                <button
                  @click="openModal(item, index, itemindex, true)"
                  class="tvd__edit_card"
                >
                  <i class="fa-solid fa-pen-to-square tvd__icons"></i>
                </button>
                <button
                  @click="openDeleteModal(index, itemindex)"
                  class="tvd__delete_card"
                >
                  <i class="tvd__icons fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
            <div class="tvd__card__field" v-if="item && item.deadlineDate">
              <span>{{ item.deadlineDate }}</span>
            </div>
            <!-- card description -->
            <div class="tvd__card__field" v-if="item && item.description">
              <span class="tvd__description" v-html="item.description"></span>
            </div>
            <div class="tvd__card__actions">
              <li class="tvd__card__actions--wrapper">
                <!-- <i class="icons fa-solid fa-align-left"></i>
                <i class="icons fa-regular fa-comment"></i> -->
                <div class="tvd__card__avatars">
                  <li class="tvd__card__avatars--item">
                    <!-- <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuXwdzjy8m5Awd5zZ6GknOv2dVo0xYeHEvJu3JGU3SlXEH7y1WV4GIpgSlAmQIN4a0qBI&usqp=CAU"
                      alt="Man standing near balcony"
                      class="tvd__avatar__image"
                    /> -->
                  </li>
                </div>
              </li>
            </div>
          </li>
          <li class="tvd__card__item" v-if="addingCard == index">
            <button class="tvd_close_addcard" @click="closeCard()">
              <i class="tvd__icons fa-solid fa-xmark"></i>
            </button>
            <slot name="cardForm" />
            <div v-if="!$slots.cardForm">
              <input
                v-model="newCard.title"
                type="text"
                placeholder="Card Title"
                class="tvd__add-input"
              />
              <textarea
                v-model="newCard.description"
                placeholder="Card Description"
                class="tvd__add-textarea"
              ></textarea>
              <button class="tvd__add-btn" @click.prevent="addCard(index)">
                <h6>{{ addCardTitle }}</h6>
              </button>
            </div>
            <slot name="editForm" />
          </li>
        </ul>
        <button class="tvd__add-btn" @click.prevent="showAddCardUI(index)">
          <h6>{{ addCardTitle }}</h6>
        </button>
      </li>
      <li class="tvd__column__item" v-if="addinglist">
        <div class="tvd__card__item">
          <button class="tvd__close_section" @click="closeNewList()">
            <i class="tvd__icons fa-solid fa-xmark"></i>
          </button>
          <input
            v-model="newList.listTitle"
            type="text"
            placeholder="Section Title"
            class="tvd__add-input"
          />
          <button class="tvd__add-btn" @click.prevent="addList()">
            <h6>{{ addSectionTitle }}</h6>
          </button>
        </div>
      </li>
      <li class="tvd__column__item">
        <button class="tvd__add-btn" @click.prevent="showAddListUI()">
          <h6>{{ addSectionTitle }}</h6>
        </button>
      </li>
    </ul>
    <EditModal
      :isEdit="isEdit"
      :isOpen="isModalOpened"
      @modal-close="closeModal"
      @edit-data="editdata"
      name="first-modal"
      :data="geteditData"
    />
    <DeleteConfirmation
      deleteMessage="Are you sure you want to Delete the Card?"
      :isOpenDeleteModal="isOpenDeleteModal"
      @modal-close="closeDeleteModal"
      @confirm-delete="deleteCard()"
      name="delete-confirmation-modal"
    />
  </section>
</template>
<script setup>
import EditModal from "./Modal/EditModal.vue";
import DeleteConfirmation from "./Modal/DeleteConfirmation.vue";
import { ref, defineProps, defineEmits } from "vue";

const isModalOpened = ref(false);
const draggedItem = ref(null);
const draggedArray = ref(null);
const isEdit = ref(false);
let addingCard = ref(null);
let addinglist = ref(null);
// const slots = useSlots();

const props = defineProps({
  responseData: {
    type: Object,
    required: true,
  },
  addCardTitle: {
    type: Text,
  },
  addSectionTitle: {
    type: Text,
  },
  isOpenDeleteModal: {
    type: Boolean,
    default: false,
  },
  isCustomEdit: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["add-card", "edit-card", "delete-card"]);

const response = ref(props.responseData);
const isOpenDeleteModal = ref(props.isOpenDeleteModal);
const geteditData = ref({});
const deleteCardData = ref({});
const newCard = ref({
  title: "",
  description: "",
});
const newList = ref({
  listTitle: "",
});
const openModal = (event, arrayindex, itemindex, val) => {
  // eslint-disable-next-line no-undef
  // console.log("slot", slots.default()[0]);
  isEdit.value = val;
  geteditData.value = {
    event,
    arrayindex,
    itemindex,
  };
  if (props.isCustomEdit == true) {
    emit("edit-card", geteditData.value);
    return;
  }
  document.body.classList.add('tvd__modal-open');
  isModalOpened.value = true;
};
const openDeleteModal = (arrayindex, itemindex) => {
  deleteCardData.value = {
    itemindex,
    arrayindex,
  };
  document.body.classList.add('tvd__modal-open');
  isOpenDeleteModal.value = true;
};
const closeModal = () => {
  document.body.classList.remove('tvd__modal-open');
  isModalOpened.value = false;
};
const closeDeleteModal = () => {
  document.body.classList.remove('tvd__modal-open');
  isOpenDeleteModal.value = false;
  
};
const showAddCardUI = (index) => {
  addingCard.value = index;
};
const showAddListUI = () => {
  addinglist.value = true;
};
const closeCard = () => {
  addingCard.value = null;
};
const closeNewList = () => {
  addinglist.value = null;
};
const addCard = (index) => {
  if (newCard.value.title.trim() !== "") {
    if (!response.value.data[index]) {
      response.value.data[index] = { data: [] };
    }
    response.value.data[index].data.push({
      title: `${newCard.value.title}`,
      description: `<p>${newCard.value.description}</p>`,
    });
    emit("add-card", {
      index: index,
      value:
        response.value.data[index].data[
          response.value.data[index].data.length - 1
        ],
      updatedValue: response.value,
    });
    newCard.value.title = "";
    newCard.value.description = "";
    addingCard.value = null;
  }
};
const addList = () => {
  if (newList.value.listTitle.trim() !== "") {
    if (!response.value.data) {
      response.value.data = { data: [] };
    }
    response.value.data.push({
      title: `${newList.value.listTitle}`,
      data: [],
    });
    newList.value.listTitle = "";
    addinglist.value = null;
  }
};
const editdata = (event) => {
  emit("edit-card", event);
  document.body.classList.remove('tvd__modal-open');
  isModalOpened.value = false;
};
const deleteCard = () => {
  document.body.classList.remove('tvd__modal-open');
  emit("delete-card", deleteCardData.value);
  isOpenDeleteModal.value = false;
};

const dragStart = (arrayIndex, itemIndex) => {
  draggedItem.value = itemIndex;
  draggedArray.value = arrayIndex;
};
const allowDrop = (event) => {
  event.preventDefault();
};
const internalAllowDrop = (event) => {
  event.preventDefault();
};
const internalDrop = (targetArrayIndex, targetIndex) => {
  if (draggedItem.value === null || draggedArray.value === null) return;
  if (draggedArray.value === targetArrayIndex) {
    const targetArray = response.value.data[targetArrayIndex];
    const draggedItemObj = targetArray.data.splice(draggedItem.value, 1)[0];
    targetArray.data.splice(targetIndex, 0, draggedItemObj);
  }
};

const dropItem = (targetArrayIndex, event) => {
  event.preventDefault();
  if (draggedItem.value === null || draggedArray.value === null) return;

  const targetArray = response.value.data[targetArrayIndex];
  const targetList = event.target.parentElement;
  if (targetList && targetList.children !== null) {
    const targetIndex = Array.from(targetList && targetList.children).indexOf(
      event.target
    );
    if (targetIndex === targetList && targetList.children.length - 1) {
      const sourceArrayIndex = draggedArray.value;
      if (sourceArrayIndex !== targetArrayIndex) {
        const sourceArray = response.value.data[sourceArrayIndex];
        targetArray.data.push(sourceArray.data[draggedItem.value]);
        sourceArray.data.splice(draggedItem.value, 1);
      }
    } else {
      const sourceArrayIndex = draggedArray.value;
      if (sourceArrayIndex !== targetArrayIndex) {
        const sourceArray = response.value.data[sourceArrayIndex];
        targetArray.data.splice(
          targetIndex,
          0,
          sourceArray.data[draggedItem.value]
        );
        sourceArray.data.splice(draggedItem.value, 1);
      }
    }
  }
  draggedItem.value = null;
  draggedArray.value = null;
};
</script>


<style>
</style>