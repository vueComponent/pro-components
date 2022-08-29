import type { PropType, ExtractPropTypes, VNodeChild, VNode } from 'vue';
import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import { proFieldFC } from '../types';

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
    type: [String, Object] as PropType<VNodeChild | VNode | JSX.Element>,
  },
};

export type TextFieldPorps = Partial<ExtractPropTypes<typeof textFieldPorps>>;
