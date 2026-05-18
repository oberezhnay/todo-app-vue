<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  hidden: Boolean
});

const text = ref('');

const show = (newText) => {
  text.value = newText;
};

const hide = () => {
  text.value = '';
};

const emit = defineEmits(['close']);

defineExpose({
  show,
  hide,
});
</script>

<template>
  <article
    v-if="errorMessage"
    class="message" :class="{ 'message--hidden': hidden }"
  >
    <div class="message-header">
      <slot name="header">Message</slot>
      <button type="button" class="delete" @click="hide"></button>
    </div>
    
    <div class="message-body">
      <slot>No content</slot>
    </div>
    
  </article>
</template>

<style scoped lang="scss">
  .message {
    transform-origin: top center;
    transition-property: opacity, transform;
    transition-duration: 0.3s;

    &--hidden {
      transform: scaleY(0);
      opacity: 0;
      pointer-events: none;
    }
  }
</style>