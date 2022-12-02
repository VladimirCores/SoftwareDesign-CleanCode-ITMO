<script setup lang="ts">
import { onMounted, reactive, watch, computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { alpha, helpers, minLength, required, and, or } from '@vuelidate/validators';
import TodoVO from '@/model/vos/TodoVO';
import Spinner from '@/components/Spinner.vue';
import type { ITodoVO } from '@/model/vos/TodoVO';

interface State {
  todos: ITodoVO[];
  selected?: ITodoVO | null;
  isLoading: boolean;
}

const LOCAL_KEY_TODOS = 'todos';
const LOCAL_KEY_TEXT = 'text';

const getLocalText = () => localStorage.getItem(LOCAL_KEY_TEXT) || '';
const getTodoIndex = (todo: ITodoVO): number => state.todos.indexOf(todo);

const domBtnAction = ref(null);
const titleText = ref(getLocalText());
const state: State = reactive({
  todos: JSON.parse(localStorage.getItem(LOCAL_KEY_TODOS) as string) || [],
  selected: null,
  isLoading: false
});

const cyrilicValidator = helpers.regex(/^[А-Яа-яёЁ]+$/i);
const validator = useVuelidate(
  {
    titleText: {
      isValid: and(required, minLength(3), or(alpha, cyrilicValidator)),
    },
  },
  { titleText },
);

const validate = () => validator.value.$validate();

const isTodoSelected = (todo: ITodoVO) => state.selected === todo;
const isSelectedActive = () => !!state.selected;
const isTodoNotSelected = () => !isSelectedActive();
const isActionButtonDisabled = computed(() => {
  return validator.value.titleText.$error || (isSelectedActive() && titleText.value === state.selected.title);
});

const onTodoListItemClicked = (todo: ITodoVO) => {
  console.log('> onTodoListItemClicked', todo);
  const isSelected = isTodoSelected(todo);
  state.selected = isSelected ? null : todo;
  titleText.value = isSelected ? getLocalText() : todo.title;
  (domBtnAction.value! as HTMLElement).innerText = isSelected ? 'Create' : 'Update';
};
const onDeleteTodo = (todo: ITodoVO) => {
  console.log('> onTodoListItemClicked', todo);
  if (isTodoSelected(todo)) onTodoListItemClicked(todo);
  state.todos.splice(getTodoIndex(todo), 1);
}
const onCreateButtonClick = () => {
  console.log('> onCreateButtonClick', state);
  if (isSelectedActive()) {
    (state.selected! as ITodoVO).title = titleText.value;
    state.todos.splice(getTodoIndex(state.selected), 1, state.selected!);
    onTodoListItemClicked(state.selected);
  } else {
    state.todos.push(TodoVO.createFromTitle(titleText.value));
    titleText.value = '';
  }
  validate();
};

watch(state.todos, (value) => localStorage.setItem(LOCAL_KEY_TODOS, JSON.stringify(value)));
watch(titleText, (value) => isTodoNotSelected() && localStorage.setItem(LOCAL_KEY_TEXT, value));
onMounted(
  () => (
    validate(),
    setTimeout(() => {
      state.isLoading = false;
    }, 1000)
  ),
);
</script>
<template>
  <Spinner v-if="state.isLoading"/>
  <main v-else>
    <input v-model="titleText" @keyup.enter="onCreateButtonClick" @keyup="validate"/>
    <button ref="domBtnAction" @click="onCreateButtonClick" :disabled="isActionButtonDisabled">Create</button>
    <ol>
      <li
        v-for="todo in state.todos"
        @click.self="onTodoListItemClicked(todo)"
        :class="{ selected: state.selected === todo }"
        :key="todo.id"
      >
        {{ todo.title }}
        <button @click.once="onDeleteTodo(todo)" class="delete">x</button>
      </li>
    </ol>
  </main>
</template>
<style lang="scss" scoped>
.selected {
  background-color: #f1f1f1;
  outline: 1px solid #ccc;
}
.delete {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  zoom: 0.5;
}
li {
  padding: 0.25rem;
  margin: 0.25rem 0;
  user-select: none;
  position: relative;
  box-sizing: border-box;
  &:hover {
    background-color: #fcfcfc;
    & > button {
      &.delete {
        display: block;
      }
    }
  }
}

</style>
