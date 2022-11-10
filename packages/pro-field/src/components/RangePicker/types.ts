import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';
import { rangePickerProps, type CommonProps } from 'ant-design-vue/es/date-picker/generatePicker/props';
import { proFieldFC } from '../typings';

const rangeProps = rangePickerProps<Dayjs>();

export type RangePickerProps = Partial<ExtractPropTypes<typeof rangeProps>>;

export const fieldRangePickerProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<CommonProps<Dayjs> & RangePickerProps>,
  },
};

export type FieldRangePickerProps = Partial<ExtractPropTypes<typeof fieldRangePickerProps>>;

export type RangePickerValueType = [string, string] | [Dayjs, Dayjs];

export type RangesType = Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>;
