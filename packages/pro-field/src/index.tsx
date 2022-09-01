// style
import './default.less';
import './style.less';

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

import { textFieldPorps, type TextFieldPorps } from './components/Text/types';
import FieldText from './components/Text';
export { FieldText, textFieldPorps, type TextFieldPorps };

import { defineComponent, PropType, ExtractPropTypes, VNode, type App, type Plugin, type DefineComponent } from 'vue';
import { pickProProps, omitUndefined } from '@ant-design-vue/pro-utils';
import { isValidElement } from 'ant-design-vue/es/_util/props-util';
import { cloneVNodes } from 'ant-design-vue/es/_util/vnode';
import { omit } from 'lodash-es';

// type
import type { ProFieldTextType, ProFieldValueType, ProFieldValueObjectType, VueNode } from '@ant-design-vue/pro-utils';

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
  //TODO: 这里可以在优化下
  return <FieldText {...props} text={dataValue as string} />;
};

const ProField = defineComponent({
  name: 'ProField',
  inheritAttrs: false,
  props: proFieldProps,
  setup(props) {
    return () => {
      const fieldProps = omitUndefined(props?.fieldProps || {});
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
