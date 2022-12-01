import { LOCAL_INPUT_TEXT } from '@/consts/local';
import Dom from '@/consts/dom';
import TodoVO from '@/model/vos/TodoVO.js';
import { disableButtonWhenTextInvalid } from '@/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty } from '@/utils/stringUtils.js';
import { $, wrapDevOnlyConsoleLog } from '@/utils/generalUtils.js';
import TodoView from '@/view/TodoView.js';
import TodoServerService from '@/services/TodoServerService.js';
import ErrorView from '@/view/ErrorView.js';

let listOfTodos = [];
let selectedTodoVO = null;
let selectedTodoViewItem = null;
const todoServerService = new TodoServerService(import.meta.env.VITE_DATA_SERVER_ADDRESS);

const isTodoSelected = (todoVO) => hasSelectedTodo() && selectedTodoVO.id === todoVO.id;
const hasSelectedTodo = () => !!selectedTodoVO;
const findTodoById = (id) => listOfTodos.find((vo) => vo.id === id);
const findTodoIndex = (todoVO) => listOfTodos.indexOf(todoVO);
const addTodo = (todoVO) => listOfTodos.push(todoVO);
const removeTodo = (todoVO) => listOfTodos.splice(findTodoIndex(todoVO), 1);
const replaceTodo = (todoVO, newTodoVO) => listOfTodos.splice(findTodoIndex(todoVO), 1, newTodoVO);

wrapDevOnlyConsoleLog();

todoServerService
  .requestTodos()
  .then(initializeTodoListAndRender)
  .catch((error) => ($(Dom.APP).innerHTML = ErrorView.createTodoListRetrieveError(error)))
  .finally(() => ($(Dom.APP).style.visibility = 'visible'));

$(Dom.BTN_CREATE_TODO).addEventListener('click', onBtnCreateTodoClick);
$(Dom.INPUT_TODO_TITLE).addEventListener('keyup', onInpTodoTitleKeyup);
$(Dom.LIST_OF_TODOS).addEventListener('change', onTodoListChange);
$(Dom.LIST_OF_TODOS).addEventListener('click', onTodoDomItemClicked);

function initializeTodoListAndRender(todoList) {
  console.log('> initializeTodoList:', todoList);
  listOfTodos = todoList;
  $(Dom.LOADER_SPINNER).remove();
  $(Dom.INPUT_TODO_TITLE).value = localStorage.getItem(LOCAL_INPUT_TEXT);
  disableEnable_CreateTodoButtonOnTitleText();
  render_TodoListInContainer();
}

async function onTodoDomItemClicked(event) {
  const domElement = event.target;
  console.log('> onTodoDomItemClicked', domElement);

  if (!TodoView.isDomElementTodoView(domElement)) {
    const isDeleteButton = TodoView.isDomElementDeleteButton(domElement);
    console.log('> \t isDeleteButton:', isDeleteButton);
    if (isDeleteButton) {
      const todoId = TodoView.getTodoIdFromDeleteButton(domElement);
      console.log('> \t todoId:', todoId);
      const todoVO = findTodoById(todoId);
      if (todoVO && confirm(`Delete: ${todoVO.title}?`)) {
        console.log('> \t Delete confirmed:', todoVO);
        const todoView = TodoView.getTodoViewFromDeleteButton(domElement);
        TodoView.disableTodoListItem(todoView);
        if (isTodoSelected(todoVO)) {
          reset_SelectedTodo();
        }
        todoServerService
          .deleteTodo(todoId)
          .then(() => {
            console.log('> \t Deleted', todoVO);
            removeTodo(todoVO);
            render_TodoListInContainer();
          })
          .catch(alert);
      }
    }
    return;
  }

  const clickedTodoVO = findTodoById(domElement.id);
  const isClickedTodoSelected = isTodoSelected(clickedTodoVO);

  if (hasSelectedTodo()) reset_SelectedTodo();

  if (!isClickedTodoSelected) {
    selectedTodoVO = clickedTodoVO;
    selectedTodoViewItem = domElement;
    TodoView.addHighlightTodoView(selectedTodoViewItem);
    $(Dom.BTN_CREATE_TODO).innerText = 'Update';
    $(Dom.INPUT_TODO_TITLE).value = clickedTodoVO.title;
    checkDisable_CreateTodoButtonFromInput(clickedTodoVO.title);
  }
}

async function onTodoListChange(event) {
  console.log('> onTodoListChange -> event:', event);
  const target = event.target;
  if (TodoView.isDomElementCompleteCheckbox(target)) {
    const todoView = TodoView.getTodoViewFromCompleteCheckbox(target);
    const todoId = TodoView.getTodoIdFromCompleteCheckbox(target);
    const todoVO = findTodoById(todoId);
    console.log('> onTodoListChange -> todoVO:', todoId, todoVO);
    todoVO.isCompleted = !!target.checked;
    TodoView.disableTodoListItem(todoView);
    await todoServerService
      .updateTodo(todoVO)
      .then((updatedTodoVO) => {
        console.log('> onTodoListChange -> updated:', updatedTodoVO);
        replaceTodo(todoVO, updatedTodoVO);
      })
      .catch(alert);
    TodoView.enableTodoListItem(todoView);
  }
}

async function onBtnCreateTodoClick() {
  const titleText = $(Dom.INPUT_TODO_TITLE).value;
  console.log('> onBtnCreateTodoClick:', { titleText });
  const isTitleTextValid = isStringNotNumberAndNotEmpty(titleText);

  if (isTitleTextValid) {
    await createUpdate_TodoWithTitleText(titleText);
  }
}

async function onInpTodoTitleKeyup(e) {
  const inputValue = $(Dom.INPUT_TODO_TITLE).value;
  console.log('> onInpTodoTitleKeyup:', inputValue);
  checkDisable_CreateTodoButtonFromInput(inputValue);
  if (e.key === 'Enter' && $(Dom.BTN_CREATE_TODO).disabled === false) {
    await createUpdate_TodoWithTitleText(inputValue);
  }
}

function checkDisable_CreateTodoButtonFromInput(inputValue) {
  console.log('> checkDisable_CreateTodoButtonFromInput:', { inputValue });
  if (hasSelectedTodo()) {
    disableEnable_CreateTodoButtonOnTitleText(() => {
      return isStringNotNumberAndNotEmpty(inputValue) && selectedTodoVO.title !== inputValue;
    });
  } else {
    localStorage.setItem(LOCAL_INPUT_TEXT, inputValue);
    disableEnable_CreateTodoButtonOnTitleText();
  }
}

function render_TodoListInContainer() {
  console.log('> render_TodoListInContainer:', { listOfTodos });
  let output = '';
  for (let index in listOfTodos) {
    const todoVO = listOfTodos[index];
    output += TodoView.createSimpleViewFromVO(index, todoVO);
  }
  $(Dom.LIST_OF_TODOS).innerHTML = output;
}

function reset_SelectedTodo() {
  console.log('> resetSelectedTodo -> selectedTodoVO:', selectedTodoVO);
  $(Dom.BTN_CREATE_TODO).innerText = 'Create';
  $(Dom.INPUT_TODO_TITLE).value = localStorage.getItem(LOCAL_INPUT_TEXT);
  TodoView.removeHighlightTodoView(selectedTodoViewItem);
  disableEnable_CreateTodoButtonOnTitleText();
  selectedTodoViewItem = null;
  selectedTodoVO = null;
}

function clear_InputTextAndLocalStorage() {
  console.log('> clear_InputTextAndLocalStorage');
  $(Dom.INPUT_TODO_TITLE).value = '';
  localStorage.removeItem(LOCAL_INPUT_TEXT);
}

function disableEnable_CreateTodoButtonOnTitleText(validateInputMethod = isStringNotNumberAndNotEmpty) {
  const textToValidate = $(Dom.INPUT_TODO_TITLE).value;
  console.log('> disableEnable_CreateTodoButtonOnTodoInputTitle:', { textToValidate });
  disableButtonWhenTextInvalid($(Dom.BTN_CREATE_TODO), textToValidate, validateInputMethod);
}

function createUpdate_TodoWithTitleText(titleText) {
  $(Dom.BTN_CREATE_TODO).disabled = true;
  $(Dom.INPUT_TODO_TITLE).disabled = true;
  return (
    hasSelectedTodo()
      ? todoServerService.updateTodo(((selectedTodoVO.title = titleText), selectedTodoVO)).then((updatedTodoVO) => {
          console.log('> onBtnCreateTodoClick: updated =', updatedTodoVO);
          replaceTodo(selectedTodoVO, updatedTodoVO);
          reset_SelectedTodo();
        })
      : todoServerService.saveTodo(TodoVO.createFromTitle(titleText)).then((createdTodoVO) => {
          console.log('> onBtnCreateTodoClick: saved =', createdTodoVO);
          addTodo(createdTodoVO);
        })
  )
    .catch(alert)
    .finally(() => {
      console.log('> onBtnCreateTodoClick: finally');
      $(Dom.BTN_CREATE_TODO).disabled = false;
      $(Dom.INPUT_TODO_TITLE).disabled = false;
      clear_InputTextAndLocalStorage();
      render_TodoListInContainer();
      disableEnable_CreateTodoButtonOnTitleText();
    });
}
