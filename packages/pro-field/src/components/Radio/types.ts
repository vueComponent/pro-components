import type { ExtractPropTypes, PropType } from "vue";
import type { RadioGroupProps } from "ant-design-vue/es/radio/Group";
import { proFieldFC } from "../typings";

export const fieldRadioProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<RadioGroupProps>,
  },
};

export type FieldRadioProps = Partial<ExtractPropTypes<typeof fieldRadioProps>>;
