import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { formItemProps } from 'ant-design-vue/es/form';
import { FormItem } from 'ant-design-vue';

export const proFormItemProps = {
  ...formItemProps(),
  proFormFieldKey: {
    type: String as PropType<string>,
  },
};

export type ProFormItemProps = Partial<ExtractPropTypes<typeof proFormItemProps>>;

const ProFormItem = defineComponent({
  name: 'ProFormItem',
  inheritAttrs: false,
  props: proFormItemProps,
  setup(props, { slots }) {
    return () => {
      return (
        <FormItem key={props.proFormFieldKey} {...props}>
          {slots?.default?.()}
        </FormItem>
      );
    };
  },
});

export default ProFormItem;
