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
  VueText,
} from '@ant-design-vue/pro-utils';
import { isValidElement } from 'ant-design-vue/es/_util/props-util';
import { cloneVNodes } from 'ant-design-vue/es/_util/vnode';
import { warning } from 'ant-design-vue/es/vc-util/warning';
import { omit } from 'lodash-es';

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

import { fieldRangePickerProps, type FieldRangePickerProps } from './components/RangePicker/types';
import FieldRangePicker, { slots as rangePickerSlots } from './components/RangePicker';
export { FieldRangePicker, fieldRangePickerProps, rangePickerSlots, FieldRangePickerProps };

import { fieldTimePickerProps, type FieldTimePickerProps } from './components/TimePicker/types';
import FieldTimePicker, { slots as timePickerSlots } from './components/TimePicker';
export { FieldTimePicker, fieldTimePickerProps, timePickerSlots, FieldTimePickerProps };

import { fieldTimeRangePickerProps, type FieldTimeRangePickerProps } from './components/TimeRangePicker/types';
import FieldTimeRangePicker, { slots as timeRangePickerSlots } from './components/TimeRangePicker';
export { FieldTimeRangePicker, fieldTimeRangePickerProps, timeRangePickerSlots, FieldTimeRangePickerProps };

import { fieldRadioProps, type FieldRadioProps } from './components/Radio/types';
import FieldRadio from './components/Radio';
export { FieldRadio, fieldRadioProps, FieldRadioProps };


// style
import './default.less';
import './style.less';

export const renderProps = {
  ...omit(proFieldFCRenderProps, 'text'),
  ...proRenderFieldPropsType,
  emptyText: {
    type: String as PropType<VueNode>,
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
  // 日期
  if (valueType === 'date') {
    const { fieldProps } = props;
    return (
      <FieldDatePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          mode: 'date',
        }}
        text={dataValue}
      />
    );
  }

  // 周
  if (valueType === 'dateWeek') {
    const { fieldProps } = props;
    return (
      <FieldDatePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          format: 'YYYY-wo',
          picker: 'week',
        }}
        text={dataValue}
      />
    );
  }

  // 月
  if (valueType === 'dateMonth') {
    const { fieldProps } = props;
    return (
      <FieldDatePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          format: 'YYYY-MM',
          picker: 'month',
        }}
        text={dataValue}
      />
    );
  }

  // 季度
  if (valueType === 'dateQuarter') {
    const { fieldProps } = props;
    return (
      <FieldDatePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          format: 'YYYY-[Q]Q',
          picker: 'quarter',
        }}
        text={dataValue}
      />
    );
  }

  // 年
  if (valueType === 'dateYear') {
    const { fieldProps } = props;
    return (
      <FieldDatePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          format: 'YYYY',
          picker: 'year',
        }}
        text={dataValue}
      />
    );
  }

  // 日期范围
  if (valueType === 'dateRange') {
    const { fieldProps } = props;
    return (
      <FieldRangePicker
        {...props}
        fieldProps={{
          ...fieldProps,
        }}
        text={dataValue}
      />
    );
  }

  // 如果是日期加时间类型的值
  if (valueType === 'dateTime') {
    const { fieldProps } = props;
    return (
      <FieldDatePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          picker: 'date',
          format: 'YYYY-MM-DD HH:mm:ss',
          showTime: true,
        }}
        text={dataValue}
      />
    );
  }

  // 如果是日期加时间类型的值的值
  if (valueType === 'dateTimeRange') {
    const { fieldProps } = props;
    return (
      <FieldRangePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          picker: 'date',
          format: 'YYYY-MM-DD HH:mm:ss',
          showTime: true,
        }}
        text={dataValue}
      />
    );
  }

  // 如果是时间类型的值
  if (valueType === 'time') {
    const { fieldProps } = props;
    return (
      <FieldTimePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          format: 'HH:mm:ss',
        }}
        text={dataValue}
      />
    );
  }

  // 如果是时间类型的值
  if (valueType === 'timeRange') {
    const { fieldProps } = props;
    return (
      <FieldTimeRangePicker
        {...props}
        fieldProps={{
          ...fieldProps,
          format: 'HH:mm:ss',
        }}
        text={dataValue}
      />
    );
  }

  if (valueType === 'radio' || valueType === 'radioButton') {
    const { fieldProps } = props
    return (
      <FieldRadio 
        {...props}
        fieldProps={{
          ...fieldProps,
        }}
        text={dataValue as string} 
      />
    )
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
      const formItemName = formItemProps?.name as VueText;
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
