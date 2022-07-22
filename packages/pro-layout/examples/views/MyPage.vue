<template>
  <PageContainer fixed-header :title="(route.meta.title as string)">
    <template #tags>
      <Tag>tag1</Tag>
      <Tag color="pink">tag2</Tag>
    </template>
    <Result
      status="404"
      :style="{
        height: '100%',
      }"
      title="Hello World"
      sub-title="Sorry, you are not authorized to access this page."
    >
      <template #extra>
        <Button type="primary">Back Home</Button>
      </template>
    </Result>
  </PageContainer>
</template>

<script setup lang="ts">
import { Button, Tag, Result } from 'ant-design-vue';
import { PageContainer } from '@ant-design-vue/pro-layout';

import { useRoute } from 'vue-router';

const route = useRoute();
</script>
