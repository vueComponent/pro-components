import { defineComponent, ExtractPropTypes, PropType } from 'vue';
import { formItemProps } from 'ant-design-vue/es/form';
import { FormItem, Col } from 'ant-design-vue';
import type { ColProps } from 'ant-design-vue/es/col';

export const proFormItemProps = {
  ...formItemProps,
  colProps: {
    type: Object as PropType<ColProps>,
  },
  proFormFieldKey: {
    type: String as PropType<string>,
  },
};

export type ProFormItemProps = Partial<ExtractPropTypes<typeof proFormItemProps>>;

const ProFormItem = defineComponent({
  props: proFormItemProps,
  setup(props, { slots }) {
    return () => {
      return (
        <Col {...props.colProps}>
          <FormItem key={props.proFormFieldKey} {...props}>
            {slots?.default?.()}
          </FormItem>
        </Col>
      );
    };
  },
});

export default ProFormItem;
