<template>
  <PageContainer title="Page 1" sub-title="is a sub-title.">
    <span>page-content</span>
    <a-button @click="handleClick">Button</a-button>
  </PageContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Button, message } from 'ant-design-vue';

export default defineComponent({
  components:{
    [Button.name]: Button,
  },
  setup() {
    const handleClick= () => {
      message.info('clicked')
    }
    return {
      handleClick,
    }
  },
})
</script>
