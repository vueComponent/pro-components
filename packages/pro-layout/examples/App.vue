<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ConfigProvider as AConfigProvider } from 'ant-design-vue';

const getPopupContainer = (triggerNode: HTMLElement): HTMLElement => {
  // if (dialogContext) {
  //   return dialogContext.getDialogWrap()
  // }
  console.log('getPopupContainer', triggerNode);
  return document.body;
};
</script>

<template>
  <a-config-provider :get-popup-container="getPopupContainer">
    <RouterView />
  </a-config-provider>
</template>

<style>
#app {
  height: 100%;
}
</style>
