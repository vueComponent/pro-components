<template>
  <PageContainer :title="$route.meta.title">
    <template #tags>
      <a-tag>tag1</a-tag>
      <a-tag color="pink">tag2</a-tag>
    </template>
    <span>page2</span>
  </PageContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Tag } from 'ant-design-vue';

export default defineComponent({
  components: {
    [Tag.name]: Tag,
  },
  setup() {
    return {}
  },
})
</script>
