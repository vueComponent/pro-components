<template>
  <Space :style="props.style" class="btn-search">
    <Submitter
      :reset-button-props="{}"
      :submit-button-props="props.submitButtonProps || {}"
      @submit="submit"
      @reset="resetForm"
    >
      <template #submitIcon>
        <SearchOutlined />
      </template>
      <template #resetIcon>
        <UndoOutlined />
      </template>
    </Submitter>
    <Button v-if="props.collapseRender" class="expand" type="link" @click="onCollapsed">
      {{ !props.collapsed ? '收起' : '展开' }}
      <UpOutlined v-if="!props.collapsed" />
      <DownOutlined v-else-if="props.collapsed" />
    </Button>
  </Space>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Space, Button } from 'ant-design-vue';
import type { CSSProperties } from '@vue/runtime-dom';
import { SearchOutlined, UndoOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import { useFormInstance } from '../../../BaseForm/hooks/useFormInstance';
import { Submitter } from '../../../BaseForm/components/Submitter';
import type { ButtonProps } from 'ant-design-vue/es/button';

type ActionsProps = {
  // 样式
  style?: CSSProperties;
  // 是否展开
  collapsed?: boolean;
  // 收起按钮的 render
  collapseRender?: boolean;
  /** 提交按钮的props*/
  submitButtonProps?: ButtonProps;
};

const { submit, resetForm } = useFormInstance();

const props = withDefaults(defineProps<ActionsProps>(), {
  style: undefined,
  collapsed: false,
  collapseRender: true,
  submitButtonProps: undefined,
});

const emit = defineEmits<{
  (e: 'collapsed', collapsed: boolean): void;
}>();

const onCollapsed = () => {
  emit('collapsed', !props.collapsed);
};
</script>

<style lang="less" scoped>
.btn-search {
  display: flex;
  align-items: flex-start;
  justify-content: end;
  margin-bottom: 10px;
  .ant-btn-link {
    padding: 0;
  }
}
</style>
