const setDisabledToListItems = (domTodoView, list, isDisabled) =>
  list.forEach((key) => {
    TodoView.getChildFromTodoViewByType(domTodoView, key).disabled = isDisabled;
  });

class TodoView {
  static TODO_VIEW_ITEM = 'todo-item';
  static TODO_VIEW_ITEM_DELETE = 'todo-item-delete';
  static TODO_VIEW_ITEM_COMPLETE = 'todo-item-complete';

  static TODO_VIEW_LIST_OF_DISABLEABLE = [TodoView.TODO_VIEW_ITEM_COMPLETE, TodoView.TODO_VIEW_ITEM_DELETE];

  static isDomElementTodoView(domElement) {
    return domElement.dataset.type === TodoView.TODO_VIEW_ITEM;
  }

  static isDomElementDeleteButton(domElement) {
    return domElement.dataset.type === TodoView.TODO_VIEW_ITEM_DELETE;
  }

  static isDomElementCompleteCheckbox(domElement) {
    return domElement.dataset.type === TodoView.TODO_VIEW_ITEM_COMPLETE;
  }

  static getTodoViewFromDeleteButton(domDeleteButton) {
    return domDeleteButton.parentNode;
  }

  static getTodoViewFromCompleteCheckbox(domCheckbox) {
    return domCheckbox.parentNode;
  }

  static getTodoIdFromDeleteButton(domDeleteButton) {
    return TodoView.getTodoViewFromDeleteButton(domDeleteButton).id;
  }

  static getTodoIdFromCompleteCheckbox(domCheckbox) {
    return TodoView.getTodoViewFromCompleteCheckbox(domCheckbox).id;
  }

  static disableTodoListItem(domTodoView) {
    domTodoView.style.pointerEvents = 'none';
    domTodoView.style.color = 'gray';
    setDisabledToListItems(domTodoView, TodoView.TODO_VIEW_LIST_OF_DISABLEABLE, true);
  }

  static enableTodoListItem(domTodoView) {
    domTodoView.style.pointerEvents = '';
    domTodoView.style.color = 'black';
    setDisabledToListItems(domTodoView, TodoView.TODO_VIEW_LIST_OF_DISABLEABLE, false);
  }

  static getChildFromTodoViewByType(domTodoView, type) {
    return domTodoView.querySelector(`[data-type="${type}"]`);
  }

  static addHighlightTodoView(domTodoView) {
    domTodoView.style.backgroundColor = 'lightgray';
  }

  static removeHighlightTodoView(domTodoView) {
    domTodoView.style.backgroundColor = '';
  }

  static createSimpleViewFromVO(index, vo) {
    const checked = vo.isCompleted ? 'checked' : '';
    return `
      <li class="todo-item"
        style="user-select: none; width: 100%; position: relative; margin: 4px 0;" 
        data-type="${TodoView.TODO_VIEW_ITEM}" 
        id="${vo.id}"
      >
        <input
          type="checkbox" 
          data-type="${TodoView.TODO_VIEW_ITEM_COMPLETE}" 
          ${checked}
        >${vo.title}
        <button
          data-type="${TodoView.TODO_VIEW_ITEM_DELETE}" 
          class="delete-button" 
          style="position: absolute; right: 0; top: 0;"
        >x</button>
      </li>
    `;
  }
}

export default TodoView;
