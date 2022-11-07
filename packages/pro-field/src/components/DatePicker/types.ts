import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';
import type { CommonProps, DatePickerProps } from 'ant-design-vue/es/date-picker/generatePicker/props';
import { proFieldFC } from '../typings';

export const fieldDatePickerProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<CommonProps<Dayjs> & DatePickerProps<Dayjs>>,
  },
  picker: {
    type: String as PropType<CommonProps<Dayjs>['picker']>,
  },
};

export type FieldDatePickerProps = Partial<ExtractPropTypes<typeof fieldDatePickerProps>>;
