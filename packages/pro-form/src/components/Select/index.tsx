import { defineComponent, computed, unref, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import { getSlot, type VueNode } from '@ant-design-vue/pro-utils';
import { pick } from 'lodash-es';
import type { SelectProps, DefaultOptionType } from 'ant-design-vue/es/select';
import ProFormField, { proFormFieldProps } from '../Field';
import { proFormItemProps } from '../FormItem';

const props = {
  ...proFormFieldProps,
  fieldProps: {
    type: Object as PropType<Omit<SelectProps, 'value'>>,
  },
  options: {
    type: Array as PropType<SelectProps['options']>,
  },
  option: {
    type: Function as PropType<(props: DefaultOptionType) => VueNode>,
  },
  default: {
    type: Function as PropType<(props: DefaultOptionType) => VueNode>,
  },
};

export type ProFormSelectProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormSelect = defineComponent({
  name: 'ProFormSelect',
  inheritAttrs: false,
  props,
  slots: ['notFoundContent', 'suffixIcon'],
  setup(props, { slots }) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
    };

    const notFoundContent = getSlot<() => VueNode>(slots, props, 'notFoundContent');
    const suffixIcon = getSlot<() => VueNode>(slots, props, 'suffixIcon');
    const itemIcon = getSlot<() => VueNode>(slots, props, 'itemIcon');
    const removeIcon = getSlot<() => VueNode>(slots, props, 'removeIcon') as any;
    const clearIcon = getSlot<() => VueNode>(slots, props, 'clearIcon');
    const dropdownRender = getSlot(slots, props, 'dropdownRender');
    const placeholder = getSlot<() => VueNode>(slots, props, 'placeholder') as any;
    const tagRender = getSlot(slots, props, 'tagRender');
    const maxTagPlaceholder = getSlot(slots, props, 'maxTagPlaceholder');
    const children = getSlot(slots, props, 'default');

    const options = computed(() => {
      return props.options || props.fieldProps?.options;
    });

    return () => {
      const { request, params, colProps, fieldProps } = props;
      return (
        <ProFormField
          valueType={'select'}
          fieldProps={{
            options: unref(options),
            notFoundContent,
            suffixIcon,
            itemIcon,
            removeIcon,
            clearIcon,
            dropdownRender,
            placeholder: placeholder?.(),
            tagRender,
            maxTagPlaceholder,
            default: children,
            ...fieldProps,
          }}
          filedConfig={{ valueType: 'select' }}
          colProps={colProps}
          formItemProps={formItemProps}
          request={request}
          params={params}
          {...formItemProps}
        />
      );
    };
  },
});

ProFormSelect.install = (app: App) => {
  app.component(ProFormSelect.name, ProFormSelect);
  return app;
};

export default ProFormSelect as DefineComponent<ProFormSelectProps> & Plugin;
