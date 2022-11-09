import type { PropType, ExtractPropTypes } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import type { VueNode } from '@ant-design-vue/pro-utils';
import { proFieldFC } from '../typings';

export const textFieldProps = {
  ...proFieldFC,
  // 这里预留一个原生的input type属性
  type: {
    type: String as PropType<InputProps['type']>,
    default: 'text',
  },
  emptyText: {
    type: [String, Object] as PropType<VueNode>,
  },
};

export type TextFieldProps = Partial<ExtractPropTypes<typeof textFieldProps>>;
