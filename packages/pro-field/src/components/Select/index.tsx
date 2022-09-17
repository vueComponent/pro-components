import { defineComponent, type App, DefineComponent, Plugin, PropType, ExtractPropTypes } from 'vue';
import type { SelectProps } from 'ant-design-vue';
import SearchSelect from './SearchSelect';
import { proFieldFC } from '../typings';

export const fieldSelectProps = {
  ...proFieldFC,
  fieldProps: {
    type: Object as PropType<SelectProps>,
  },
};
export type FieldSelectProps = Partial<ExtractPropTypes<typeof fieldSelectProps>>;

const FieldSelect = defineComponent({
  props: fieldSelectProps,
  setup(props) {
    const children = () => {
      if (props.mode === 'read') {
        const dom = <>{props.text}</>;
        if (props.render) {
          return props.render(props.text, { mode: props.mode, fieldProps: props.fieldProps }, dom) || null;
        }
        return dom;
      }
      if (props.mode === 'edit' || props.mode === 'update') {
        const renderDom = () => {
          return (
            <SearchSelect
            // TODO: 处理options
            // options={[] as any}
            // optionItemRender={(item) => {
            //   return item.label;
            // }}
            // {...props.fieldProps}
            />
          );
        };
        const dom = renderDom();
        if (props.renderFormItem) {
          return props.renderFormItem(props.text, { mode: props.mode, fieldProps: props.fieldProps }, dom) || null;
        }
        return dom;
      }
      return null;
    };

    return () => children();
  },
});

FieldSelect.install = (app: App) => {
  app.component(FieldSelect.name, FieldSelect);
  return app;
};

export default FieldSelect as DefineComponent<FieldSelectProps> & Plugin;
