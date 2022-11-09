import type { ExtractPropTypes, PropType } from 'vue';
import { selectProps, type DefaultOptionType } from 'ant-design-vue/es/select';
import type { VueNode, ProFieldRequestData } from '@ant-design-vue/pro-utils';

const omitSelectProps = selectProps();

type FetchDataType = (value: string) => void;

type ResetDataType = () => void;

export const searchSelectProps = {
  ...omitSelectProps,
  /**
   * 当搜索关键词发生变化时是否请求远程数据
   *
   * @default true
   */
  fetchDataOnSearch: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  request: {
    type: Function as PropType<ProFieldRequestData>,
  },
  option: {
    type: Function as PropType<(props: DefaultOptionType) => VueNode>,
  },
  default: {
    type: Function as PropType<(props: DefaultOptionType) => VueNode>,
  },
  // 刷新数据
  fetchData: {
    type: Function as PropType<FetchDataType>,
  },
  // 清空数据
  resetData: {
    type: Function as PropType<ResetDataType>,
  },
};

export type SearchSelectProps = Partial<ExtractPropTypes<typeof searchSelectProps>>;
