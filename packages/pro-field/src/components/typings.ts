import type { PropType, ExtractPropTypes } from "vue";
import type {
  ProFieldFCMode,
  VueNode,
  ProFieldTextType,
  ProSchemaValueEnumObj,
  ProSchemaValueEnumMap,
} from "@ant-design-vue/pro-utils";
import type { FormItemProps, FormProps } from "ant-design-vue";

// BaseProFieldProps
export const baseProFieldFC = {
  /** 值的类型 */
  text: {
    type: [String, Number, Array, Object] as PropType<ProFieldTextType>,
  },
  fieldProps: {
    type: Object as PropType<any>,
  },
  /** 模式类型 */
  mode: {
    type: String as PropType<ProFieldFCMode>,
    default: "edit",
  },
  /** 简约模式 */
  plain: {
    type: Boolean as PropType<boolean>,
  },
  /** 轻量模式 */
  light: {
    type: Boolean as PropType<boolean>,
  },
  /** 映射值的类型 */
  valueEnum: {
    type: Object as PropType<ProSchemaValueEnumObj | ProSchemaValueEnumMap>,
  },
  /** Label */
  label: {
    type: String as PropType<VueNode>,
  },
  // 预留formItemProps口子
  formItemProps: {
    type: Object as PropType<
      FormItemProps & {
        model?: FormProps["model"];
      }
    >,
  },
};

export const proRenderFieldPropsType = {
  render: {
    type: Function as PropType<
      (
        text: ProFieldTextType,
        props: ProFieldFCRenderProps,
        dom: ProFieldTextType
      ) => VueNode
    >,
  },
  renderFormItem: {
    type: Function as PropType<
      (
        text: ProFieldTextType,
        props: ProFieldFCRenderProps,
        dom: ProFieldTextType
      ) => VueNode
    >,
  },
};

export const proFieldFC = {
  ...baseProFieldFC,
  ...proRenderFieldPropsType,
};

export const proFieldFCRenderProps = {
  ...baseProFieldFC,
  mode: {
    type: String as PropType<ProFieldFCMode>,
  },
  readonly: {
    type: Boolean as PropType<boolean>,
  },
};

// RenderProps
export type ProFieldFCRenderProps = Partial<
  ExtractPropTypes<typeof proFieldFCRenderProps>
>;

export type ProFieldFC = Partial<ExtractPropTypes<typeof proFieldFC>>;

export type BaseProFieldFC = Partial<ExtractPropTypes<typeof baseProFieldFC>>;

export type ProRenderFieldPropsType = Partial<
  ExtractPropTypes<typeof proRenderFieldPropsType>
>;
