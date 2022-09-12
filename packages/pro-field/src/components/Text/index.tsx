import { defineComponent, type App, type Plugin, type DefineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import { textFieldPorps, type TextFieldPorps } from './types';
import 'ant-design-vue/es/input/style/index.less';

const FieldText = defineComponent({
  name: 'FieldText',
  inheritAttrs: false,
  props: textFieldPorps,
  slots: ['render', 'renderFormItem'],
  setup(props, { slots }) {
    const render = props.render ?? slots?.render;
    const renderFormItem = props.renderFormItem ?? slots?.renderFormItem;

    return () => {
      if (props.mode === 'read') {
        const dom = (
          <>
            {props.fieldProps?.prefix}
            {props.text ?? (props.emptyText || '-')}
            {props.fieldProps?.suffix}
          </>
        );
        if (render) {
          return render(props.text, { mode: props.mode, fieldProps: props.fieldProps }, dom) ?? props.emptyText;
        }
        return dom;
      }
      if (props.mode === 'edit' || props.mode === 'update') {
        const dom = <Input type={props.type} allowClear {...props.fieldProps} />;

        if (renderFormItem) {
          return renderFormItem(props.text, { mode: props.mode, fieldProps: props.fieldProps }, dom);
        }
        return dom;
      }
      return null;
    };
  },
});

FieldText.install = (app: App) => {
  app.component(FieldText.name, FieldText);
  return app;
};

export default FieldText as DefineComponent<TextFieldPorps> & Plugin;
