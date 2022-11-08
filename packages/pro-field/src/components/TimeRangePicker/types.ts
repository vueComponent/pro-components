import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TimeRangePickerProps } from 'ant-design-vue/es/time-picker/time-picker';
import { proFieldFC } from '../typings';

export const fieldTimeRangePickerProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<TimeRangePickerProps<Dayjs>>,
  },
};

export type FieldTimeRangePickerProps = Partial<ExtractPropTypes<typeof fieldTimeRangePickerProps>>;
