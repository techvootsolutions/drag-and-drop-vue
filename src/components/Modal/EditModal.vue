<template>
  <div v-if="isOpen" class="tvd__modal-mask">
    <div class="tvd__modal-wrapper">
      <div class="tvd__modal-container" ref="target">
        <div class="tvd__modal-header">
          <h6>{{ isEdit ? "Edit Card" : "Show Card" }}</h6>
          <button class="tvd__close_editmodal tvd__modal-close" @click="$emit('modal-close');toggleEdit('all', false);"><i class="tvd__icons fa-solid fa-xmark"></i></button>
        </div>
        <hr class="tvd__hr" />
        <div class="tvd__modal-body">
          <!-- <div v-if="!isEdit"> -->
          <div>
            <div class="tvd__show_card" v-if="getData.event && getData.event.title">
              <h6 v-if="!editTitle">{{ getData.event.title }}</h6> <i class="fa-solid fa-pen-to-square tvd__icons tvd__ms-2" v-if="!editTitle" @click="toggleEdit('title', true)"></i>
              <div class="tvd__form-group" v-if="editTitle"><input class="tvd__form-control" type="text" @blur="toggleEdit('title',false)" @change="UpdateData('title')" v-model="title" /></div>
            </div>
            <div class="tvd__show_card" v-if="getData.event && getData.event.deadlineDate">
              <span><b>DeadLine: </b></span>
              <span v-if="!editDeadline">{{ getData.event.deadlineDate }}</span> <i class="fa-solid fa-pen-to-square tvd__icons tvd__ms-2" v-if="!editDeadline" @click="toggleEdit('deadline',true)"></i>
              <div class="tvd__form-group" v-if="editDeadline"><input class="tvd__form-control" type="date"  @blur="toggleEdit('deadline',false)" @change="UpdateData('deadline')" v-model="duedate" /></div>
            </div>
            <div class="tvd__show_card tvd__show_card_desc" v-if="getData.event && getData.event.description">
              <span class="tvd__show_card_desc_title"><b>Description: </b>  <i class="fa-solid fa-pen-to-square tvd__icons tvd__ms-2" v-if="!editDesc" @click="toggleEdit('desc',true)" ></i></span>
              <div class="tvd__form-group" v-if="editDesc"><label class="tvd__form-label">Description</label><textarea class="tvd__form-control" rows="4" cols="41" width="100%" wrap="soft" @blur="toggleEdit('desc',false)" @change="UpdateData('desc')" v-model="description"></textarea></div>
              <span class="tvd__show_card_desc_html" v-if="!editDesc" style="white-space: pre-wrap;" v-html="getData.event.description"></span>
            </div>
            <div class="tvd__image" >
              <template v-if="getData.event && getData.event.attachment">
                <div v-for="(attachmentItem, index) in getData.event.attachment" :key="index">
                  <div class="tvd__attachment" v-if="attachmentItem.type.includes('image')">
                    <a :href="attachmentItem.url" target="_blank">
                      <img :src="attachmentItem.url" :alt="`Image Attachment ${index + 1}`" style="max-width: 100%" class="tvd__img_attachment" />
                    </a>
                    <button @click="openDeleteModal(index)" class="tvd__delete_attachment">
                      <i class="tvd__icons tvd__delete_file fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div class="tvd__attachment" v-else-if="attachmentItem.type.includes('video')">
                    <a href="#" @click="openVideoInNewTab(attachmentItem.url)">
                      <video controls :src="attachmentItem.url" style="max-width: 100%" class="tvd__img_attachment"></video>
                    </a>
                    <button @click="openDeleteModal(index)" class="tvd__delete_attachment">
                      <i class="tvd__icons tvd__delete_file fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div class="tvd__attachment" v-else-if="attachmentItem.type.includes('pdf')">
                    <!-- <p>PDF Attachment</p> -->
                    <!-- <div class="tvd__pdf_attachment"> -->
                      <a :href="attachmentItem.url">
                        <i class="tvd__img_attachment tvd__pdf_attachment-icon fa-solid fa-file-pdf"></i>
                        <!-- {{ getFileNameFromUrl(attachmentItem.url) }} -->
                      </a>
                      <button @click="openDeleteModal(index)" class="tvd__delete_attachment">
                      <i class="tvd__icons tvd__delete_file fa-solid fa-xmark"></i>
                    </button>
                    <!-- </div> -->
                    <!-- <p>{{ attachmentItem.type }}: Not supported for preview</p> -->
                  </div>
                </div>
              </template>
              <div class="tvd__form-group"><label class="tvd__icons tvd__img_attachment"><i class="fa-solid fa-folder-plus"></i><input class="tvd__form-control tvd__d-none" type="file" multiple @change="handleFileChange" /> </label></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { watch, defineProps, defineEmits, ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
const props = defineProps({isOpen:{type:Boolean,default:false},isEdit:{type:Boolean,default:false},data:{default:()=>({})},type:String});
const title = ref("");const description = ref("");const duedate = ref(null);const attachment = ref([]);const emit = defineEmits(["modal-close"],["edit-data"]);const target = ref(null);
const handleFileChange = async(event) => {
  const selectedFiles = event.target.files;
  if (selectedFiles && selectedFiles.length > 0) {
    const newAttachments = await Promise.all(
      Array.from(selectedFiles).map(async (file) => {
        const type = file.type;
        if (isFileTypeSupported(type)) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                type,
                file,
                url: reader.result,
              });
            };
            reader.readAsDataURL(file);
          });
        } else {
          console.warn(`Unsupported file type: ${type}`);
          return null;
        }
      })
    );
    const filteredAttachments = newAttachments.filter((attachment) => attachment !== null);
    if (filteredAttachments.length > 0) {
      attachment.value = filteredAttachments;
      UpdateData();
    }
  } else {
    console.error("Selected files are not an array or empty:", selectedFiles);
  }
};
const openDeleteModal = (index) => {
  getData.value.event.attachment.splice(index, 1);
  UpdateData();
}
const openVideoInNewTab = (linkUrl) => {window.open(linkUrl, "_blank");};
const isFileTypeSupported = (type) => {
  const supportedTypes = ["image/", "video/", "application/pdf"];
  return supportedTypes.some((supportedType) => type.startsWith(supportedType));
};
// const getFileNameFromUrl = (url) => {
//   const parts = url.split('/');
//   return parts[parts.length - 1];
// }
onClickOutside(target, () => {
  if (props.isOpen) {
    emit("modal-close");
    toggleEdit('all', false);
  }
});
const getData = computed(() => {return props.data;});

const UpdateData = () => {
  const editData = {
    title: title.value,
    description: description.value,
    deadlineDate: duedate.value ? duedate.value : new Date().toISOString(),
    attachment: attachment.value
      ? getData.value.event.attachment.concat(attachment.value)
      : [],
    arrayindex: getData.value.arrayindex,
    itemindex: getData.value.itemindex,
  };
  emit("edit-data", editData);
  attachment.value = [];
};

const editTitle = ref(false); 
const editDeadline = ref(false); 
const editDesc = ref(false);

const toggleEdit = (key, val) => {
if(key == 'title') {
  editTitle.value = val;
}
else if(key == 'deadline') {
  editDeadline.value = val;
}
else if(key == 'desc') {
  editDesc.value = val;
} 
else if(key == 'all') {
  editDeadline.value = val;
  editDesc.value = val;
  editTitle.value = val;
}
};

watch(getData, async (val) => {
  if (val) {
    title.value = val.event.title;
    description.value = val.event.description;
    duedate.value = val.event.deadlineDate;
    // attachment.value = val.event.attachment;
  }
});
</script>
