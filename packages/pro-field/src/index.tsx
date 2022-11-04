import {
  unref,
  defineComponent,
  PropType,
  ref,
  ExtractPropTypes,
  VNode,
  type App,
  type Plugin,
  type DefineComponent,
} from 'vue';
import {
  pickProProps,
  omitUndefined,
  type ProFieldRequestData,
  ProFieldTextType,
  ProFieldValueType,
  ProFieldValueObjectType,
  VueNode,
} from '@ant-design-vue/pro-utils';
import { isValidElement } from 'ant-design-vue/es/_util/props-util';
import { cloneVNodes } from 'ant-design-vue/es/_util/vnode';
import { warning } from 'ant-design-vue/es/vc-util/warning';
import { omit } from 'lodash-es';
import type { NameType } from './components/typings';

import {
  baseProFieldFC,
  proRenderFieldPropsType,
  proFieldFC,
  proFieldFCRenderProps,
  type ProFieldFCRenderProps,
  ProFieldFC,
  BaseProFieldFC,
  ProRenderFieldPropsType,
} from './components/typings';

export {
  baseProFieldFC,
  proRenderFieldPropsType,
  proFieldFC,
  proFieldFCRenderProps,
  type ProFieldFCRenderProps,
  type ProFieldFC,
  type BaseProFieldFC,
  type ProRenderFieldPropsType,
};

// pro-field
import { textFieldProps, type TextFieldProps } from './components/Text/types';
import FieldText from './components/Text';
export { FieldText, textFieldProps, type TextFieldProps };

import { passwordTextProps, type PasswordTextProps } from './components/Password/types';
import FieldPassword from './components/Password';
export { FieldPassword, passwordTextProps, type PasswordTextProps };

import { searchSelectProps, type SearchSelectProps } from './components/Select/SearchSelect/types';
import FieldSelect from './components/Select';
export { FieldSelect, searchSelectProps, type SearchSelectProps };

import { fieldDatePickerProps, type FieldDatePickerProps } from './components/DatePicker/types';
import FieldDatePicker, { slots as fieldDatePickerSlots } from './components/DatePicker';
export { FieldDatePicker, fieldDatePickerProps, fieldDatePickerSlots, FieldDatePickerProps };

// style
import './default.less';
import './style.less';

export const renderProps = {
  ...omit(proFieldFCRenderProps, 'text'),
  ...proRenderFieldPropsType,
  emptyText: {
    type: String as PropType<VueNode>,
  },
  // 请求参数
  params: {
    type: Object as PropType<Record<string, any>>,
  },
  // 请求
  request: {
    type: Function as PropType<ProFieldRequestData>,
  },
};

export type RenderProps = Partial<ExtractPropTypes<typeof renderProps>>;

export const proFieldProps = {
  ...renderProps,
  text: {
    type: String as PropType<ProFieldTextType>,
  },
  valueType: {
    type: String as PropType<ProFieldValueType | ProFieldValueObjectType>,
  },
};

export type ProFieldPropsType = Partial<ExtractPropTypes<typeof proFieldProps>>;

const defaultRenderText = (
  dataValue: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps
  // valueTypeMap: Record<string, ProRenderFieldPropsType>
): VueNode => {
  if (valueType === 'date') {
    const { fieldProps } = props;
    return (
      <FieldDatePicker
        fieldProps={{
          ...fieldProps,
          mode: 'date',
        }}
        {...props}
        text={dataValue}
      />
    );
  }
  if (valueType === 'select') {
    let text = '';
    if (dataValue instanceof Array) {
      text = dataValue.join(',');
    } else {
      text = dataValue as string;
    }
    return <FieldSelect {...props} text={text} />;
  }
  if (valueType === 'password') {
    return <FieldPassword {...props} text={dataValue as string} />;
  }
  return <FieldText {...props} text={dataValue as string} />;
};

const ProField = defineComponent({
  name: 'ProField',
  inheritAttrs: false,
  props: proFieldProps,
  setup(props) {
    return () => {
      const { readonly, mode, text, valueType, formItemProps, fieldProps, renderFormItem } = props;
      const formItemName = formItemProps?.name as NameType;
      const formModel = formItemProps?.model;
      if (!formModel) {
        warning(false, 'model is required for validateFields to work.');
        return Promise.reject('Form `model` is required for validateFields to work.');
      }
      const modelValue = formModel[formItemName];

      if (!(formItemName in Object.keys(formModel))) {
        warning(
          false,
          `The ${formItemName} attribute was not found in the model of the Form, Please set the name attribute of the form item correctly`
        );
      }
      const inputValue = ref(modelValue);
      const omitFormItemProps = omitUndefined(formItemProps || {});

      // TODO：待优化
      const omitFieldProps = omitUndefined({
        ...fieldProps,
        value: unref(inputValue),
        'onUpdate:value'(value: any) {
          inputValue.value = value;
          fieldProps?.['onUpdate:value']?.(value);
        },
      });
      return (
        <>
          {defaultRenderText(
            mode === 'edit' ? omitFieldProps?.value ?? text ?? '' : text ?? omitFieldProps?.value ?? '',
            valueType || 'text',
            {
              ...props,
              mode: readonly ? 'read' : mode,
              renderFormItem: renderFormItem
                ? (...restProps) => {
                    const newDom = renderFormItem?.(...restProps) as VNode | JSX.Element;
                    if (isValidElement(newDom))
                      return cloneVNodes(newDom, {
                        ...omitFieldProps,
                        ...((newDom.props as any) || {}),
                      });
                    return newDom;
                  }
                : undefined,
              fieldProps: pickProProps(omitFieldProps || {}),
              formItemProps: pickProProps(omitFormItemProps || {}),
            }
          )}
        </>
      );
    };
  },
});

ProField.install = (app: App) => {
  app.component(ProField.name, ProField);
  return app;
};

export default ProField as DefineComponent<ProFieldPropsType> & Plugin;
