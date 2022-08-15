import type { PropType, ExtractPropTypes, VNode } from 'vue';
import { formProps, type FormProps } from 'ant-design-vue/es/form';
import type { Options } from 'scroll-into-view-if-needed';
import type BaseFrom from './BaseForm';
import type { SubmitterProps } from './components/Submitter/types';
import { isObject } from '@ant-design-vue/pro-utils';
import type { Recordable } from '../typings';

/** baseForm基础props */
export const commonFormProps = {
  ...formProps(),
  /**提交失败自动滚动到第一个错误字段 */
  scrollToFirstError: {
    type: [Boolean, Object] as PropType<boolean | Options | FormProps['scrollToFirstError']>,
  },
  submitter: {
    type: Object as PropType<false | SubmitterProps>,
  },
  /**表单提交 */
  onFinish: {
    type: Function as PropType<(fromModel: Recordable<any>) => void>,
  },
  /**表单提交 */
  onSubmit: {
    type: Function as PropType<(fromModel: Recordable<any>) => void>,
  },
  /**重置表单 */
  onReset: {
    type: Function as PropType<(fromModel: Recordable<any>) => void>,
  },
};

export const baseFormProps = {
  ...commonFormProps,
  contentRender: {
    type: Function as PropType<(items: VNode[], submitter: SubmitterProps | undefined) => VNode>,
  },
  /** 是否回车提交 默认为true */
  isKeyPressSubmit: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
};

export const baseFormEmit = {
  finish: (values: Recordable<any>) => isObject(values),
  submit: (values: Recordable<any>) => isObject(values),
};

export type BaseFormEmit = typeof baseFormEmit;

export type CommonFormProps = Partial<ExtractPropTypes<typeof commonFormProps>>;

// 属性全部转化为可选的
export type BaseFormPropsType = Partial<ExtractPropTypes<typeof baseFormProps>>;

export type BaseFromInstance = InstanceType<typeof BaseFrom>;
