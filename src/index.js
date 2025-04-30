// Import components
import SimpleDrag from "./components/SimpleDrag.vue";
import EditModal from "./components/Modal/EditModal.vue";
import DeleteConfirmation from "./components/Modal/DeleteConfirmation.vue";
import BoardSection from "./components/BoardSection.vue";
import BoardCard from "./components/BoardCard.vue";
import AddListForm from "./components/AddListForm.vue";
import AddSectionButton from "./components/AddSectionButton.vue";
import DragDropManager from "./components/DragDropManager.vue";
import SectionHeader from "./components/section/SectionHeader.vue";
import EmptyState from "./components/section/EmptyState.vue";
import NewCardForm from "./components/section/NewCardForm.vue";
import BoardTemplates from "./components/BoardTemplates.vue";
import BoardSharing from "./components/BoardSharing.vue";

import { resetDragClass, handleDragImage } from './utils/dragDropUtils.js';
import './assets/css/style.css';
import './assets/css/drag-drop-styles.css';
// Export components
export {
  SimpleDrag,
  EditModal,
  DeleteConfirmation,
  BoardSection,
  BoardCard,
  AddListForm,
  AddSectionButton,
  DragDropManager,
  SectionHeader,
  EmptyState,
  NewCardForm,
  resetDragClass,
  handleDragImage,
  BoardTemplates,
  BoardSharing,
};

// Export default
export default {
  SimpleDrag,
  EditModal,
  DeleteConfirmation,
  BoardSection,
  BoardCard,
  AddListForm,
  AddSectionButton,
  DragDropManager,
  SectionHeader,
  EmptyState,
  NewCardForm,
  resetDragClass,
  handleDragImage,
  BoardTemplates,
  BoardSharing,
};