<template>
  <FieldText
    :field-props="{
      value: value,
      size: 'large',
      placeholder: ' 12313213',
    }"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { FieldText } from '@ant-design-vue/pro-field';
const value = ref('1232');
</script>
