import type { PropType, ExtractPropTypes } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import { proFieldFC, type VueNode } from '../typings';

export const textFieldPorps = {
  ...proFieldFC,
  text: {
    type: String as PropType<string>,
  },
  type: {
    type: String as PropType<InputProps['type']>,
    default: 'text',
  },
  emptyText: {
    type: [String, Object] as PropType<VueNode>,
  },
};

export type TextFieldPorps = Partial<ExtractPropTypes<typeof textFieldPorps>>;
