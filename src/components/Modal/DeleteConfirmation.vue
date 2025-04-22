<template>
  <div v-if="isOpenDeleteModal" class="tvd__modal-mask">
    <div class="tvd__modal-wrapper">
      <div class="tvd__modal-container" ref="target">
        <div class="tvd__modal-header">
          <h6>Delete Card</h6>
          <button class="tvd__close-delete tvd__modal-close" @click="$emit('modal-close')">
            <i class="tvd__icons fa-solid fa-xmark"></i>
          </button>
        </div>
        <hr class="tvd__hr"/>
        <div class="tvd__modal-body">
          <slot name="content">{{ deleteMessage }}</slot>
        </div>
        <hr class="tvd__hr"/>
        <div class="tvd__modal-footer">
          <button class="tvd__edit_btn" @click="$emit('confirm-delete')">
            Confirm
          </button>
          <button class="tvd__edit_btn" @click="$emit('modal-close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
const props = defineProps({ isOpenDeleteModal: { type: Boolean, default: false }, deleteMessage: { type: String } });
const emit = defineEmits(["modal-close"], ["confirm-delete"]);
const target = ref(null);
onClickOutside(target, () => { if (props.isOpenDeleteModal) { emit("modal-close"); } });
</script>
