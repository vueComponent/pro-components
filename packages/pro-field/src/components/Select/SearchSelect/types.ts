import type { ExtractPropTypes } from 'vue';
import { selectProps } from 'ant-design-vue/es/select';

const omitSelectProps = selectProps();

export const searchSelectProps = {
  ...omitSelectProps,
};

export type SearchSelectProps = Partial<ExtractPropTypes<typeof searchSelectProps>>;
