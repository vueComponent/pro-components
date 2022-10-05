import type { ExtractPropTypes, PropType } from 'vue';
import type { CommonProps, DatePickerProps } from 'ant-design-vue/es/date-picker/generatePicker/props';
import { proFieldFC } from '../typings';

export const fieldDatePickerProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<CommonProps<any> & DatePickerProps<any>>,
  },
};

export type FieldDatePickerProps = Partial<ExtractPropTypes<typeof fieldDatePickerProps>>;
