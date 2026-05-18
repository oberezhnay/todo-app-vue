<script setup>
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import 'bulma/css/bulma.css';
import './styles/index.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import originalTodos from './data/todos.js';
import StatusFilter from './components/StatusFilter.vue';
import TodoItem from './components/TodoItem.vue';
import * as todoApi from './api/todos.js';
import Message from './components/Message.vue';

const todos = ref([]);
const title = ref('');
const errorMessage = ref(null);
const status = ref('all');


onMounted(async () => {
  try {
    todos.value = await todoApi.getTodos();
  } catch (error) {
    errorMessage.value.show('Unable to load todos');
  }
});

const activeTodos = computed(() => 
  todos.value.filter(todo => !todo.completed)
);

const visibleTodos = computed(() => {
  if (status.value === 'active') {
    return activeTodos.value;
  } else if (status.value === 'completed') {
    return todos.value.filter(todo => todo.completed);
  }
  return todos.value;
});

const toggleAlltodos = () => {
  const allCompleted = todos.value.every(todo => todo.completed);
  todos.value.forEach(todo => {
    todo.completed = !allCompleted;
    updateTodo(todo);
  });
};

const addTodo = async () => {
  if (title.value.trim() === '') {
    errorMessage.value.show('Title should not be empty');
    return;
  }

  try {
    const newTodo = await todoApi.createTodo(title.value);

    todos.value.push(newTodo);
    title.value = '';
  } catch (error) {
    errorMessage.value.show('Unable to add a todo');
  }
};

const deleteTodo = async todoId => {
  try {
    await todoApi.deleteTodo(todoId);
    todos.value = todos.value.filter(todo => todo.id !== todoId);
  } catch (error) {
    errorMessage.value.show('Unable to delete a todo');
  }
};

const updateTodo = async ({ id, title, completed }) => {
  try {
    const updatedTodo = await todoApi.updateTodo({ id, title, completed });
    const currentTodo = todos.value.find(todo => todo.id === id);
    if (currentTodo) {
      Object.assign(currentTodo, updatedTodo);
    }
  } catch (error) {
    errorMessage.value.show('Unable to update a todo');
  }
};
</script>

<template>
  <div class="todoapp">
      <h1 class="todoapp__title">todos {{ todos.length }}</h1>

      <div class="todoapp__content">
        <header class="todoapp__header">

          <button
            v-if="todos.length > 0"
            type="button"
            class="todoapp__toggle-all"
            :class="{ active: todos.every(todo => todo.completed) }"
            @click="toggleAlltodos"
          >
          </button>

          <form @submit.prevent="addTodo">
            <input
              type="text"
              class="todoapp__new-todo"
              placeholder="What needs to be done?"
              v-model="title"
              @input="errorMessage.value.hide"
            />
          </form>
        </header>

        <TransitionGroup 
          tag="section"
          name="todolist"
          class="todoapp__main"
          v-if="todos.length > 0"
        >
          <TodoItem
            v-for="todo of visibleTodos"
            :key="todo.id"
            :todo="todo"
            @delete="deleteTodo(todo.id)"
            @update="updateTodo($event)"
          />
        </TransitionGroup>

        <footer class="todoapp__footer">
          <span class="todo-count">
            {{ activeTodos.length }} item(s) left
          </span>

          <StatusFilter v-model="status" />

          <button
            type="button"
            class="todoapp__clear-completed"
            :disabled="activeTodos.length === todos.length"
            @click="todos = activeTodos"
          >
            Clear completed
          </button>
        </footer>
      </div>

      <Message 
        :hidden="!errorMessage" 
        class="is-warning"
        @close="errorMessage = ''"
      >
        <template #header>
          <p>Error</p>
        </template>

        <template #default>
          <p>{{ errorMessage }}</p>
        </template>
      </Message>
    </div>
</template>

<style scoped>
  .todolist-enter-active,
  .todolist-leave-active {
    max-height: 60px;
    transition: all 0.5s ease;
  }
  .todolist-enter-from,
  .todolist-leave-to {
    opacity: 0;
    max-height: 0;
    transform: scaleY(0);
  }
</style>
