import type { PropType, ExtractPropTypes } from 'vue';
import type { ButtonProps } from 'ant-design-vue';

type SearchConfig = {
  /**  提交按钮文案 */
  submitText?: string;
  /** 重置按钮文案 */
  resetText?: string;
};

export const submitterProps = {
  onSubmit: {
    type: Function as PropType<(value?: any) => void>,
  },
  /** 重置方法 */
  onReset: {
    type: Function as PropType<(value?: any) => void>,
  },
  /** 搜索的配置，一般用来配置文本 */
  searchConfig: {
    type: Object as PropType<SearchConfig>,
  },
  /** 提交按钮的 props */
  submitButtonProps: {
    type: [Boolean, Object] as PropType<false | (ButtonProps & { preventDefault?: boolean })>,
    default: false,
  },
  /** 重置按钮的 props */
  resetButtonProps: {
    type: [Boolean, Object] as PropType<false | (ButtonProps & { preventDefault?: boolean })>,
    default: false,
  },
};

export type SubmitterProps = Partial<ExtractPropTypes<typeof submitterProps>>;
