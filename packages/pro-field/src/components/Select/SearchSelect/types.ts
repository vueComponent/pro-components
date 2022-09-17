import type { PropType, ExtractPropTypes } from 'vue';
import { selectProps, type LabeledValue } from 'ant-design-vue/es/select';
import type { RequestOptionsType, VueNode } from '@ant-design-vue/pro-utils';

const omitSelectProps = selectProps();

// 支持 key, value, label，兼容 UserSearch 中只填写了 key 的情况。
export type KeyLabel = Partial<LabeledValue> & RequestOptionsType;

/** 用户扩展数据后的值类型 */
export type DataValueType<T> = KeyLabel & T;

export type OptionItemRender<T> = (item: DataValueType<T>) => VueNode;

export const searchSelectProps = {
  ...omitSelectProps,
  options: {
    type: Array as PropType<RequestOptionsType[]>,
  },
  /** 自定义选项渲染 */
  optionItemRender: {
    type: Function as PropType<OptionItemRender<any>>,
  },
};

export type SearchSelectProps = Partial<ExtractPropTypes<typeof searchSelectProps>>;
