import type { InputProps } from 'ant-design-vue/es/input/inputProps';
import type { PropType, ExtractPropTypes } from 'vue';
import type { ProFieldFCMode, VueNode } from '@ant-design-vue/pro-utils';

// BaseProFieldProps
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

// RenderProps
export type ProFieldFCRenderProps = {
  mode?: ProFieldFCMode;
  readonly?: boolean;
  placeholder?: string | string[];
  value?: any;
  onChange?: (...rest: any[]) => void;
} & BaseProFieldFC;

export type ProFieldFC = Partial<ExtractPropTypes<typeof proFieldFC>>;

export type BaseProFieldFC = Partial<ExtractPropTypes<typeof baseProFieldFC>>;

export type ProRenderFieldPropsType = Partial<ExtractPropTypes<typeof proRenderFieldPropsType>>;
