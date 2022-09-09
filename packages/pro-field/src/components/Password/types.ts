import type { PropType, ExtractPropTypes } from 'vue';
import { proFieldFC } from '../typings';

export const passwordTextProps = {
  ...proFieldFC,
  /**
   * 是否显示密码
   */
  visible: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};

export type PasswordTextProps = Partial<ExtractPropTypes<typeof passwordTextProps>>;
