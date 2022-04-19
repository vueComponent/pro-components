<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ConfigProvider } from 'ant-design-vue';

const getPopupContainer = (triggerNode?: HTMLElement): HTMLElement => {
  // if (dialogContext) {
  //   return dialogContext.getDialogWrap()
  // }
  if (triggerNode) {
    return (triggerNode?.parentNode as HTMLElement) || document.body;
  }
  return document.body;
};
</script>

<template>
  <ConfigProvider :get-popup-container="getPopupContainer">
    <RouterView />
  </ConfigProvider>
</template>

<style>
#app {
  height: 100%;
}
</style>
