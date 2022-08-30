import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import type { PropType, ExtractPropTypes, VNodeChild, VNode } from 'vue';

export type ProFieldFCMode = 'read' | 'edit' | 'update';

export type VueNode = VNodeChild | VNode | JSX.Element;

export const baseProFieldFC = {
  fieldProps: {
    type: Object as PropType<InputProps>,
  },
  /** 模式类型 */
  mode: {
    type: String as PropType<ProFieldFCMode>,
    default: 'edit',
  },
};

export type ProFieldFCRenderProps = {
  mode?: ProFieldFCMode;
  readonly?: boolean;
  placeholder?: string | string[];
  value?: any;
  onChange?: (...rest: any[]) => void;
} & BaseProFieldFC;

export const proRenderFieldPropsType = {
  render: {
    type: Function as PropType<
      (text: any, props: Omit<ProFieldFCRenderProps, 'value' | 'onChange'>, dom: VueNode) => VueNode
    >,
  },
  renderFormItem: {
    type: Function as PropType<(text: any, props: ProFieldFCRenderProps, dom: VueNode) => VueNode>,
  },
};

export const proFieldFC = {
  ...baseProFieldFC,
  ...proRenderFieldPropsType,
};

export type ProFieldFC = Partial<ExtractPropTypes<typeof proFieldFC>>;

export type BaseProFieldFC = Partial<ExtractPropTypes<typeof baseProFieldFC>>;

export type ProRenderFieldPropsType = Partial<ExtractPropTypes<typeof proRenderFieldPropsType>>;
