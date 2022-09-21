import { defineComponent, computed, unref, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import { searchSelectSlots } from '@ant-design-vue/pro-field';
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
};

export type ProFormSelectProps = Partial<ExtractPropTypes<typeof props>>;

export const ProFormSelect = defineComponent({
  name: 'ProFormSelect',
  inheritAttrs: false,
  props,
  slots: searchSelectSlots,
  setup(props, { slots }) {
    const formItemProps = {
      ...props.formItemProps,
      ...pick(props, Object.keys(proFormItemProps)),
    };

    const notFoundContent = getSlot(slots, props, 'notFoundContent');
    const suffixIcon = getSlot(slots, props, 'suffixIcon');
    const itemIcon = getSlot(slots, props, 'itemIcon');
    const removeIcon = getSlot(slots, props, 'removeIcon');
    const clearIcon = getSlot(slots, props, 'clearIcon');
    const dropdownRender = getSlot(slots, props, 'dropdownRender');
    const option = getSlot(slots, props, 'option');
    const placeholder = getSlot(slots, props, 'placeholder');
    const tagRender = getSlot(slots, props, 'tagRender');
    const maxTagPlaceholder = getSlot(slots, props, 'maxTagPlaceholder');
    const optionLabel = getSlot(slots, props, 'optionLabel');

    const options = computed(() => {
      return props.options || props.fieldProps?.options;
    });

    return () => {
      return (
        <ProFormField
          valueType={'select'}
          fieldProps={{
            ...props.fieldProps,
            options: unref(options),
            notFoundContent,
            suffixIcon,
            itemIcon,
            removeIcon,
            clearIcon,
            dropdownRender,
            option,
            placeholder,
            tagRender,
            maxTagPlaceholder,
            optionLabel,
          }}
          filedConfig={{ valueType: 'select' }}
          colProps={props.colProps}
          formItemProps={formItemProps}
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
