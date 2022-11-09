import type { EmitsOptions, SetupContext, CSSProperties, PropType, ExtractPropTypes } from 'vue';
import type { VueNode, ProFieldValueType, ProFieldRequestData } from '@ant-design-vue/pro-utils';
import type { ProFormItemProps } from './components/FormItem';
import type { ProFieldPropsType } from '@ant-design-vue/pro-field';
import type { ColProps } from 'ant-design-vue/es/col';
import type { RowProps } from 'ant-design-vue/es/row';

export type EmitFn<E = EmitsOptions> = SetupContext<E>['emit'];

export type Recordable<T = any> = Record<string, T>;

// 下面是内部组件ProField全部属性
// /** 值的类型 */
// text: {
//   type: String as PropType<VueNode>,
// },
// fieldProps: {
//   type: Object as PropType<InputProps>,
// },
// /** 模式类型 */
// mode: {
//   type: String as PropType<ProFieldFCMode>,
//   default: 'edit',
// },
/** 简约模式 */
// plain: {
//   type: Boolean as PropType<boolean>,
// },
// /** 轻量模式 */
// light: {
//   type: Boolean as PropType<boolean>,
// },
// /** Label */
// label: {
//   type: String as PropType<VueNode>,
// },
// render: {
//   type: Function as PropType<
//     (text: any, props: Omit<ProFieldFCRenderProps, 'value' | 'onChange'>, dom: VueNode) => VueNode
//   >,
// },
// renderFormItem: {
//   type: Function as PropType<(text: any, props: ProFieldFCRenderProps, dom: VueNode) => VueNode>,
// },
// mode: {
//   type: String as PropType<ProFieldFCMode>,
// },
// readonly: {
//   type: Boolean as PropType<boolean>,
// },
// placeholder: {
//   type: String as PropType<string | string[]>,
// },
// onChange: {
//   type: Function as PropType<(...rest: any[]) => void>,
// },
// value: PropTypes.any,
/** 从服务器读取选项 */
// request: {
//   type: Function as PropType<ProFieldRequestData>,
// },
// emptyText: {
//   type: String as PropType<VueNode>,
// },
// visible: {
//   type: Boolean as PropType<boolean>,
// },
// onVisible: {
//   type: Function as PropType<(visible: boolean) => void>,
// },
// text: {
//   type: String as PropType<ProFieldTextType>,
// },
// valueType: {
//   type: String as PropType<ProFieldValueType | ProFieldValueObjectType>,
// },

export const proFormGridConfig = {
  grid: {
    type: Boolean as PropType<boolean>,
  },
  /**
   * @default
   * { xs: 24 }
   */
  colProps: {
    type: Object as PropType<ColProps>,
  },
  /**
   * @default
   * { gutter: 8 }
   */
  rowProps: {
    type: Object as PropType<RowProps>,
  },
};

export type ProFormGridConfig = Partial<ExtractPropTypes<typeof proFormGridConfig>>;

// 暴露给外部使用的ProField属性
export interface ProFieldProps {
  light?: boolean;
  emptyText?: VueNode;
  label?: VueNode;
  mode?: 'read' | 'edit';
  render?: any;
  readonly?: boolean;
}

export const fieldProps = {
  style: {
    type: Object as PropType<CSSProperties>,
  },
  width: {
    type: String,
  },
};

export type FieldProps = Partial<ExtractPropTypes<typeof fieldProps>>;

export type ProFormItemCreateConfig = {
  valueType?: ProFieldValueType;
} & ProFormItemProps;

export const extendsProps = {
  /**
   * 表单占用格子数
   */
  colSize: {
    type: Number,
  },
  filedConfig: {
    type: Object as PropType<ProFormItemCreateConfig>,
  },
  // 请求参数
  params: {
    type: Object as PropType<Recordable>,
  },
  /** 从服务器读取选项 */
  request: {
    type: Function as PropType<ProFieldRequestData>,
  },
};

export type ExtendsProps = Partial<ExtractPropTypes<typeof extendsProps>>;

export type ProFormFieldItemProps<T = Record<string, any>> = {
  /**
   * @name 设置到控件上的属性
   *
   * @example 设置select 多选
   * <ProFormSelect fieldProps={{mode:"multiple"}} />
   * @example 设置select 多选
   * <ProFormText fieldProps={{placeholder:"请输入！"}} />
   */
  fieldProps?: FieldProps & T;
} & Omit<ProFieldPropsType, 'valueType'> &
  Pick<ProFormGridConfig, 'colProps'> &
  ProFormItemProps &
  ExtendsProps;
