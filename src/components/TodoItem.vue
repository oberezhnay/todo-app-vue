<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['delete', 'update']);

const editing = ref(false);
const titleField = ref(null);
const newTitle = ref(props.todo.title);

const startEditing = async () => {
  newTitle.value = props.todo.title;
  editing.value = true;

  await nextTick();
  
  if (titleField.value) {
    titleField.value.focus();
  } 
};

const rename = () => {
  if (!editing.value) {
    return;
  }

  editing.value = false;

  if (newTitle.value.trim() === props.todo.title) {
    return;
  }

  if (newTitle.value.trim() === '') {
    emit('delete');
  } else {
    emit('update', { ...props.todo, title: newTitle.value });
  }
}
</script>

<template>
  <div 
    :class="['todo', { completed: todo.completed }]"
  >
    <label class="todo__status-label">
      <input
        type="checkbox"
        class="todo__status"
        :checked="todo.completed"
        @change="emit('update', { ...todo, completed: !todo.completed })"
      />
    </label>

    <form v-if="editing" @submit.prevent="rename">
      <input
        type="text"
        class="todo__title-field"
        placeholder="Empty todo will be deleted"
        v-model="newTitle"
        ref="titleField"
        @blur="editing = false"
        @keyup.escape="editing = false"
      />
    </form>

    <template v-else>
      <span 
        class="todo__title"
        @dblclick="startEditing"
      >
        {{ props.todo.title }}
      </span>
      <button 
        type="button" 
        class="todo__remove" 
        @click="emit('delete')"
      >
        ×
      </button>
    </template>

    <div class="modal overlay" :class="{'is-active': false}">
      <div class="modal-background has-background-white-ter" ></div>
      <div class="loader" ></div>
    </div>
  </div>
</template>