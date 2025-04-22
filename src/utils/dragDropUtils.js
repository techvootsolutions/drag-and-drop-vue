/**
 * Resets drag-related CSS classes on elements
 * @param {HTMLElement|null} element - The dragged element to reset
 * @param {string} selector - CSS selector for elements with drag-over class
 */
export const resetDragClass = (element, selector = '.drag-over') => {
    if (element) {
      element.classList.remove('dragging');
    }
    
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.remove('drag-over');
    });
  };
  
  /**
   * Handles setting up drag image and data transfer
   * @param {DragEvent} event - The drag event
   * @param {any} data - Data to serialize and transfer
   */
  export const handleDragImage = (event, data) => {
    if (!event.dataTransfer) return;
    
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
  };
  