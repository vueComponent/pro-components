<template>
  <page-container title="Page 1" sub-title="is a sub-title.">
    <template #content>
      <div>
        container.content
        <h1>{{ text }}</h1>
      </div>
    </template>
    <span>page-content</span>
    <a-button @click="handleClick">Button</a-button>
  </page-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Button, message } from 'ant-design-vue';

export default defineComponent({
  components: {
    [Button.name]: Button,
  },
  setup() {
    const text = ref<string>('1');
    const handleClick = () => {
      message.info('clicked');
      text.value = `${Math.random()}`;
    };
    return {
      handleClick,

      text,
    };
  },
});
</script>
