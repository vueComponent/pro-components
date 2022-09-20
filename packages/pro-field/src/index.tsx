import {
  ref,
  defineComponent,
  PropType,
  ExtractPropTypes,
  VNode,
  type App,
  type Plugin,
  type DefineComponent,
} from 'vue';
import { pickProProps, omitUndefined } from '@ant-design-vue/pro-utils';
import { isValidElement } from 'ant-design-vue/es/_util/props-util';
import { cloneVNodes } from 'ant-design-vue/es/_util/vnode';
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
import { textFieldPorps, type TextFieldPorps } from './components/Text/types';
import FieldText from './components/Text';
export { FieldText, textFieldPorps, type TextFieldPorps };

import { passwordTextProps, type PasswordTextProps } from './components/Password/types';
import FieldPassword from './components/Password';
export { FieldPassword, passwordTextProps, type PasswordTextProps };

import { searchSelectProps, type SearchSelectProps } from './components/Select/SearchSelect/types';
import FieldSelect from './components/Select';
import { slots as searchSelectSlots } from './components/Select/SearchSelect';
export { FieldSelect, searchSelectProps, searchSelectSlots, type SearchSelectProps };

// utils-type
import type { ProFieldTextType, ProFieldValueType, ProFieldValueObjectType, VueNode } from '@ant-design-vue/pro-utils';

// style
import './default.less';
import './style.less';

export const renderProps = {
  ...omit(proFieldFCRenderProps, 'text'),
  ...proRenderFieldPropsType,
  emptyText: {
    type: String as PropType<VueNode>,
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
    const inputValue = ref((props.formItemProps?.model || {})[props.formItemProps?.name as NameType]);
    const formItemProps = omitUndefined(props?.formItemProps || {});
    return () => {
      // TODO：待优化
      const fieldProps = omitUndefined({
        ...props?.fieldProps,
        value: inputValue.value,
        'onUpdate:value'(value: string) {
          inputValue.value = value;
          props.fieldProps?.['onUpdate:value']?.(value);
        },
      });
      return (
        <>
          {defaultRenderText(
            props.mode === 'edit' ? fieldProps?.value ?? props.text ?? '' : props.text ?? fieldProps?.value ?? '',
            props.valueType || 'text',
            {
              ...props,
              mode: props.readonly ? 'read' : props.mode,
              renderFormItem: props.renderFormItem
                ? (...restProps) => {
                    const newDom = props.renderFormItem?.(...restProps) as VNode | JSX.Element;
                    if (isValidElement(newDom))
                      return cloneVNodes(newDom, {
                        ...fieldProps,
                        ...((newDom.props as any) || {}),
                      });
                    return newDom;
                  }
                : undefined,
              fieldProps: pickProProps(fieldProps || {}),
              formItemProps: pickProProps(formItemProps || {}),
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
