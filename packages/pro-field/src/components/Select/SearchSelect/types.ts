import type { ExtractPropTypes, PropType } from 'vue';
import { selectProps, type DefaultOptionType } from 'ant-design-vue/es/select';
import type { VueNode, ProFieldRequestData } from '@ant-design-vue/pro-utils';

const omitSelectProps = selectProps();

export const searchSelectProps = {
  ...omitSelectProps,
  request: {
    type: Function as PropType<ProFieldRequestData>,
  },
  option: {
    type: Function as PropType<(props: DefaultOptionType) => VueNode>,
  },
  default: {
    type: Function as PropType<(props: DefaultOptionType) => VueNode>,
  },
};

export type SearchSelectProps = Partial<ExtractPropTypes<typeof searchSelectProps>>;
