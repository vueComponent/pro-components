import { defineComponent, PropType, ExtractPropTypes, VNode, type App, type Plugin, type DefineComponent } from 'vue';
import { pickProProps, omitUndefined } from '@ant-design-vue/pro-utils';
import { isValidElement } from 'ant-design-vue/es/_util/props-util';
import { cloneVNodes } from 'ant-design-vue/es/_util/vnode';
import { omit } from 'lodash-es';
import FieldText from './components/Text';

// type
import type {
  ProFieldTextType,
  ProFieldValueType,
  ProFieldValueObjectType,
  ProFieldRequestData,
  VueNode,
} from '@ant-design-vue/pro-utils';
import { proFieldFCRenderProps, proRenderFieldPropsType, type ProRenderFieldPropsType } from './components/typings';

export const renderProps = {
  ...omit(proFieldFCRenderProps, 'text'),
  ...proRenderFieldPropsType,
  /** 从服务器读取选项 */
  request: {
    type: Function as PropType<ProFieldRequestData>,
  },
  emptyText: {
    type: String as PropType<VueNode>,
  },
  visible: {
    type: Boolean as PropType<boolean>,
  },
  onVisible: {
    type: Function as PropType<(visible: boolean) => void>,
  },
};

export type RenderProps = Partial<ExtractPropTypes<typeof renderProps>>;

export const proFieldPropsType = {
  ...renderProps,
  text: {
    type: String as PropType<ProFieldTextType>,
  },
  valueType: {
    type: String as PropType<ProFieldValueType | ProFieldValueObjectType>,
  },
};

export type ProFieldPropsType = Partial<ExtractPropTypes<typeof proFieldPropsType>>;

const defaultRenderText = (
  dataValue: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps,
  valueTypeMap: Record<string, ProRenderFieldPropsType>
): VueNode => {
  console.log(valueType, valueTypeMap);
  return <FieldText text={dataValue as string} {...props} />;
};

const ProField = defineComponent({
  name: 'ProField',
  inheritAttrs: false,
  props: proFieldPropsType,
  setup(props) {
    return () => {
      const { text, valueType = 'text', mode = 'read', onChange, renderFormItem, value, readonly, ...rest } = props;
      const fieldProps = (value !== undefined || onChange || rest?.fieldProps) && {
        value,
        // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
        ...omitUndefined(rest?.fieldProps || {}),
        onChange: (...restParams: any[]) => {
          // rest?.fieldProps?.onChange?.();
          onChange?.(...restParams);
        },
      };
      return (
        <>
          {defaultRenderText(
            mode === 'edit' ? fieldProps?.value ?? text ?? '' : text ?? fieldProps?.value ?? '',
            valueType || 'text',
            {
              ...rest,
              mode: readonly ? 'read' : mode,
              renderFormItem: renderFormItem
                ? (...restProps) => {
                    const newDom = renderFormItem(...restProps) as VNode | JSX.Element;
                    // renderFormItem 之后的dom可能没有props，这里会帮忙注入一下
                    if (isValidElement(newDom))
                      return cloneVNodes(newDom, {
                        placeholder: rest.placeholder,
                        ...fieldProps,
                        ...((newDom.props as any) || {}),
                      });
                    return newDom;
                  }
                : undefined,
              placeholder: rest.placeholder,
              fieldProps: pickProProps(fieldProps || {}),
            },
            {}
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
