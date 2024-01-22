<template>
  <section v-if="response">
    <ul class="tvd__column__list">
      <li class="tvd__column__item" v-for="(data, index) in response" :key="index">
        <div class="tvd__column__title--wrapper">
          <h2 v-if="editSectionTitle !== index && data.title">{{ data.title }}</h2>
          <div v-if="editSectionTitle === index" class="tvd__section-title">
            <input v-model="data.title" type="text" placeholder="Section Title" class="tvd__add-input"/>
            <button class="tvd__edit_card" @click="saveEdit(index, data)">
              <i class="tvd__icons fa-solid fa-check"></i>
            </button>
            <button class="tvd__edit_card" @click="closeEditSection()">
              <i class="tvd__icons fa-solid fa-xmark"></i>
            </button>
          </div>
          <div v-if="editSectionTitle === index"></div>
          <button v-else class="tvd__edit_card" @click="showEditCardUI(index, data)">
            <i class="fa-solid fa-pen-to-square tvd__icons"></i>
          </button>
          <div>
            <i class="tvd__column__item--cta fa-solid fa-plus tvd__cursor-pointer" @click.prevent="showAddCardUI(index)"></i>
          </div>
        </div>
        <ul class="tvd__card__list" v-if="data.data" @drop.prevent="dropItem(index, $event)" @dragover.prevent="allowDrop">
          <template v-for="(item, itemindex) in data.data" :key="itemindex">
            <li :class="['tvd__card__item', { 'card-dragged': isDragging && draggedIndex === index }]"
                v-if="Object.keys(item).length > 0 && !$slots.customCard"
                :draggable="true"
                @dragstart="dragStart(index, itemindex)"
                @dragover.prevent="internalAllowDrop"
                @drop.prevent="internalDrop(index, itemindex)">
              <div class="tvd__card__field">
                <span v-if="item && item.title" v-html="item.title" class="tvd__card__tag" @click="openModal(item, index, itemindex, false)"></span>
                <div class="tvd__card-button-wrapper">
                  <button @click="openModal(item, index, itemindex, true)" class="tvd__edit_card">
                    <i class="fa-solid fa-pen-to-square tvd__icons"></i>
                  </button>
                  <button @click="openDeleteModal(index, itemindex)" class="tvd__delete_card">
                    <i class="tvd__icons fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <div class="tvd__card__field" v-if="item && item.deadlineDate">
                <span>{{ item.deadlineDate }}</span>
              </div>
              <div class="tvd__card__field" v-if="item && item.description">
                <span class="tvd__description" v-html="item.description"></span>
              </div>
              <div class="tvd__card__actions">
                <li class="tvd__card__actions--wrapper">
                  <div class="tvd__card__avatars">
                    <li class="tvd__card__avatars--item"></li>
                  </div>
                </li>
              </div>
            </li>
            <li class="tvd__card__item" v-if="$slots.customCard" :draggable="true" @dragstart="dragStart(index, itemindex)"
                @dragover.prevent="internalAllowDrop" @drop.prevent="internalDrop(index, itemindex)">
              <slot :item="item" name="customCard"></slot>
            </li>
          </template>
          <li class="tvd__card__item" v-if="addingCard == index">
            <button class="tvd_close_addcard" @click="closeCard()">
              <i class="tvd__icons fa-solid fa-xmark"></i>
            </button>
            <slot name="cardForm" />
            <div v-if="!$slots.cardForm">
              <input v-model="newCard.title" type="text" placeholder="Card Title" class="tvd__add-input"/>
              <textarea v-model="newCard.description" placeholder="Card Description" class="tvd__add-textarea"></textarea>
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
          <input v-model="newList.listTitle" type="text" placeholder="Section Title" class="tvd__add-input"/>
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
    <EditModal :isEdit="isEdit" :isOpen="isModalOpened" @modal-close="closeModal" @edit-data="editdata" name="first-modal" :data="geteditData" />
    <DeleteConfirmation deleteMessage="Are you sure you want to Delete the Card?" :isOpenDeleteModal="isOpenDeleteModal" @modal-close="closeDeleteModal"
                        @confirm-delete="deleteCard()" name="delete-confirmation-modal" />
  </section>
  <section v-else>
    <slot name="noData" />
    <p v-if="!$slots.noData">No Data</p>
  </section>
</template>
<script setup>
import EditModal from "./Modal/EditModal.vue";
import DeleteConfirmation from "./Modal/DeleteConfirmation.vue";
import { ref, defineProps, defineEmits } from "vue";
const isModalOpened = ref(false);
const isDragging = ref(false);
const draggedIndex = ref(null);
const draggedItem = ref(null);
const draggedArray = ref(null);
const isEdit = ref(false);
let addingCard = ref(null);
let editSectionTitle = ref(null);
let addinglist = ref(null);
const props = defineProps({
  responseData: { type: Array, required: true },
  addCardTitle: { type: String, default: "Add Card" },
  addSectionTitle: { type: String, default: "Add Section" },
  isOpenDeleteModal: { type: Boolean, default: false },
  isCustomEdit: { type: Boolean, default: false },
});
const emit = defineEmits(["add-card", "edit-card", "delete-card", "dragstart", "dropItem", "column-added", "edit-section-title"]);
const response = ref(props.responseData);
const isOpenDeleteModal = ref(props.isOpenDeleteModal);
const geteditData = ref({});
const deleteCardData = ref({});
const newCard = ref({ title: "", description: "" });
const newList = ref({ listTitle: "" });
const openModal = (event, arrayindex, itemindex, val) => {
  isEdit.value = val;
  geteditData.value = { event, arrayindex, itemindex };
  if (props.isCustomEdit == true) {
    emit("edit-card", { data: geteditData.value, oldData: response.value[arrayindex].data[itemindex], response: response.value });
    return;
  }
  document.body.classList.add("tvd__modal-open");
  isModalOpened.value = true;
};
const openDeleteModal = (arrayindex, itemindex) => {
  deleteCardData.value = { itemindex, arrayindex };
  if (props.isCustomEdit === true) {
    const deletecontent = response.value[deleteCardData.value.arrayindex].data[deleteCardData.value.itemindex];
    emit("delete-card", { data: deletecontent, event: deleteCardData.value, response: response.value });
    return;
  }
  document.body.classList.add("tvd__modal-open");
  isOpenDeleteModal.value = true;
};
const closeModal = () => {
  document.body.classList.remove("tvd__modal-open");
  isModalOpened.value = false;
};
const closeDeleteModal = () => {
  document.body.classList.remove("tvd__modal-open");
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
    if (!response.value[index] || !response.value[index].data) {
      response.value[index] = { data: [] };
    }
    response.value[index].data.push({
      title: `${newCard.value.title}`,
      description: `<p>${newCard.value.description}</p>`,
      deadlineDate: new Date().toISOString(),
      attachment: [],
    });
    emit("add-card", { index: index, value: response.value[index].data[response.value[index].data.length - 1], updatedValue: response.value });
    newCard.value.title = "";
    newCard.value.description = "";
    addingCard.value = null;
  }
};
const addList = () => {
  if (newList.value.listTitle.trim() !== "") {
    if (!response.value) {
      response.value = { data: [] };
    }
    response.value.push({ title: `${newList.value.listTitle}`, data: [] });
    emit("column-added", { response: response.value });
    newList.value.listTitle = "";
    addinglist.value = null;
  }
};
const editdata = (event) => {
  const arrayIndex = event.arrayindex;
  const itemIndex = event.itemindex;
  const datatoUpdate = response.value[arrayIndex].data[itemIndex];
  response.value[arrayIndex].data[itemIndex].title = event.title;
  response.value[arrayIndex].data[itemIndex].description = event.description;
  response.value[arrayIndex].data[itemIndex].deadlineDate = event.deadlineDate;
  response.value[arrayIndex].data[itemIndex].attachment = event.attachment;
  emit("edit-card", { data: event, newData: response.value[arrayIndex].data[itemIndex], oldData: datatoUpdate, response: response.value });
  // document.body.classList.remove("tvd__modal-open");
  // isModalOpened.value = false;
};
const deleteCard = () => {
  document.body.classList.remove("tvd__modal-open");
  const deletecontent = response.value[deleteCardData.value.arrayindex].data[deleteCardData.value.itemindex];
  response.value[deleteCardData.value.arrayindex].data.splice(deleteCardData.value.itemindex, 1);
  emit("delete-card", { data: deletecontent, event: deleteCardData.value, response: response.value });
  isOpenDeleteModal.value = false;
};
const dragStart = (arrayIndex, itemIndex) => {
  draggedItem.value = itemIndex;
  draggedArray.value = arrayIndex;
  isDragging.value = true;
  draggedIndex.value = arrayIndex;
  emit("dragstart", response.value[arrayIndex].data[itemIndex]);
};
const allowDrop = (event) => {
  event.preventDefault();
};
const internalAllowDrop = (event) => {
  event.preventDefault();
};
const internalDrop = (targetArrayIndex, targetIndex) => {
  isDragging.value = false;
  draggedIndex.value = null;
  if (draggedItem.value === null || draggedArray.value === null) return;
  if (draggedArray.value === targetArrayIndex) {
    const targetArray = response.value[targetArrayIndex];
    const draggedItemObj = targetArray.data.splice(draggedItem.value, 1)[0];
    targetArray.data.splice(targetIndex, 0, draggedItemObj);
  }
};

const dropItem = (targetArrayIndex, event) => {
  event.preventDefault();
  if (draggedItem.value === null || draggedArray.value === null) return;
  const targetArray = response.value[targetArrayIndex];
  const targetList = event.target.parentElement;
  if (targetList && targetList.children !== null) {
    const targetIndex = Array.from(targetList && targetList.children).indexOf(event.target);
    if (targetIndex === targetList && targetList.children.length - 1) {
      const sourceArrayIndex = draggedArray.value;
      if (sourceArrayIndex !== targetArrayIndex) {
        const sourceArray = response.value[sourceArrayIndex];
        targetArray.data.push(sourceArray.data[draggedItem.value]);
        sourceArray.data.splice(draggedItem.value, 1);
      }
    } else {
      const sourceArrayIndex = draggedArray.value;
      if (sourceArrayIndex !== targetArrayIndex) {
        const sourceArray = response.value[sourceArrayIndex];
        targetArray.data.splice(targetIndex, 0, sourceArray.data[draggedItem.value]);
        sourceArray.data.splice(draggedItem.value, 1);
      }
    }
  }
  emit("dropItem", response.value);
  draggedItem.value = null;
  draggedArray.value = null;
};
const showEditCardUI = (index) => {
  if (editSectionTitle.value === null) {
    editSectionTitle.value = index;
  }
};
const saveEdit = (index, data) => {
  if (data.title.trim() !== "") {
    editSectionTitle.value = null;
    emit("edit-section-title", { index, newTitle: data.title });
  } else {
    alert("Section title cannot be empty!");
  }
};
const closeEditSection = () => {
  editSectionTitle.value = null;
};
</script>
