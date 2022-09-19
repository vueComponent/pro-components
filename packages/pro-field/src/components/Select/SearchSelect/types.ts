import type { ExtractPropTypes, PropType } from 'vue';
import { selectProps, type DefaultOptionType } from 'ant-design-vue/es/select';

const omitSelectProps = selectProps();

export const searchSelectProps = {
  ...omitSelectProps,
  option: {
    type: Function as PropType<(props: DefaultOptionType) => void>,
  },
};

export type SearchSelectProps = Partial<ExtractPropTypes<typeof searchSelectProps>>;
