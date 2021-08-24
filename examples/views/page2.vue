<template>
  <PageContainer :title="$route.meta.title">
    <template #tags>
      <a-tag>tag1</a-tag>
      <a-tag color="pink">tag2</a-tag>
    </template>
    <a-result
      status="404"
      :style="{
        height: '100%',
        background: '#fff',
      }"
      title="Hello World"
      sub-title="Sorry, you are not authorized to access this page."
    >
      <template #extra>
        <a-button type="primary">Back Home</a-button>
      </template>
    </a-result>
  </PageContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Tag, Result } from 'ant-design-vue';

export default defineComponent({
  components: {
    [Tag.name]: Tag,
    [Result.name]: Result,
  },
  setup() {
    return {};
  },
});
</script>
