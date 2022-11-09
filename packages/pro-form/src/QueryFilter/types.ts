import type { ExtractPropTypes, PropType } from 'vue';
import type { CSSProperties } from '@vue/runtime-dom';
import { baseFormProps } from '../BaseForm/types';
import type { default as QueryFilter } from './QuertFilter';
import type { FormProps } from 'ant-design-vue/es/form';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import type { ButtonProps } from 'ant-design-vue';
import type { SpanConfig } from './components/form-action/utils/span-config';

export const baseFormPropsKeys = Object.keys(baseFormProps);

export const queryFilterProps = {
  ...baseFormProps,
  /**表单布局 */
  layout: {
    type: String as PropType<FormProps['layout']>,
    default: 'horizontal',
  },
  /**
   * @name 查询表单栅格间隔
   *
   * @example searchGutter={24}
   * */
  searchGutter: {
    type: Number as PropType<RowProps['gutter']>,
    default: 24,
  },
  /** 自定义样式 */
  style: {
    type: Object as PropType<CSSProperties>,
  },
  /**
   * @name 配置列数，一般而言是 8 的倍数
   *
   * @example 配置一行4个
   * span={6}
   *
   * @example 配置一行3个
   * span={6}
   *
   * @example 根据屏幕宽度配置
   * span={xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6}
   * */
  span: {
    type: [Number, Object] as PropType<SpanConfig>,
  },
  /**自定义折叠状态下默认显示的表单控件数量，没有设置或小于 0，则显示一行控件; 数量大于等于控件数量则隐藏展开按钮 */
  defaultColsNumber: {
    type: Number as PropType<number>,
    default: undefined,
  },
  /** 是否折叠超出的表单项，用于受控模式*/
  collapsed: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  /**默认状态下是否折叠超出的表单项 */
  defaultCollapsed: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**是否能够查询收起的数据，如果设置为 false，收起后的表单数据将会丢失 */
  preserve: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * @name 每一行之前要不要有分割线
   * @description 只有在 `layout` 为 `vertical` 时生效
   */
  split: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  /** 提交按钮的props*/
  submitButtonProps: {
    type: Object as PropType<ButtonProps>,
  },
  /** 切换表单折叠状态时的回调*/
  onCollapsed: {
    type: Function as PropType<(collapsed: boolean) => void>,
  },
};
export type QueryFilterProps = Partial<ExtractPropTypes<typeof queryFilterProps>>;
export type QueryFilternstance = InstanceType<typeof QueryFilter>;
