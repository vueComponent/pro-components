import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TimePickerProps } from 'ant-design-vue/es/time-picker/time-picker';
import { proFieldFC } from '../typings';

export const fieldTimePickerProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<TimePickerProps<Dayjs>>,
  },
};

export type FieldTimePickerProps = Partial<ExtractPropTypes<typeof fieldTimePickerProps>>;
