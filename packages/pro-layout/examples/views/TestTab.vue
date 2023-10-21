<template>
  <PageContainer
    :loading="loading"
    fixed-header
    :title="(route.meta.title as string)"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tab-change="tabChange"
    :breadcrumb="false"
    :tabProps="{
      hideAdd: true,
      tabPosition: 'top',
      type: 'editable-card',
      tabBarGutter: 8,
      tabBarStyle: { margin: '0', height: '32px', lineHeight: '32px' },
      onEdit: tabEdit,
    }"
  >
    <template #tags>
      <Tag>tag1</Tag>
      <Tag color="pink">tag2</Tag>
    </template>
    <Result
      status="info"
      :style="{
        height: '100%',
      }"
      title="show tabs"
      sub-title="pro-layout可使用 tabRender 插槽自定义标签页"
    >
      <template #extra>
        <Button type="primary">ME {{ tabActiveKey }}</Button>
      </template>
    </Result>
  </PageContainer>
</template>

<script setup lang="ts">
import { Button, Tag, Result } from "ant-design-vue";
import { PageContainer } from "@ant-design-vue/pro-layout";

import { useRoute } from "vue-router";
import { reactive, ref } from "vue";

const route = useRoute();

let loading = ref<boolean>(false)
let tabList = reactive(
  Array.from({ length: 54 }, (_, i) => ({ key: "/tab" + i, tab: "tab" + i }))
);
let tabActiveKey = ref("/tab1");
function tabChange(key: string) {
  console.log("tabChange", key);
  tabActiveKey.value = key;
}
function tabEdit(key: string) {
  console.log("tabEdit", key);
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000);
}
</script>
