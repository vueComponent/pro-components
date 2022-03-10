<template>
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
      <a-button type="primary" @click="handleClick">Back Home</a-button>
    </template>
  </a-result>
</template>

<script lang="ts" setup>
import { Result as AResult, Button as AButton, message } from 'ant-design-vue'

const handleClick = () => {
  console.log('info')
  message.info('BackHome button clicked!')
}
</script>
