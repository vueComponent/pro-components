import { defineComponent, type App, type Plugin, type DefineComponent } from 'vue';
import { Input } from 'ant-design-vue';
import { textFieldProps, type TextFieldProps } from './types';
import 'ant-design-vue/es/input/style/index.less';

const FieldText = defineComponent({
  name: 'FieldText',
  inheritAttrs: false,
  props: textFieldProps,
  slots: ['render', 'renderFormItem'],
  setup(props, { slots }) {
    return () => {
      const { type, mode, text, emptyText, fieldProps } = props;
      const placeholder = fieldProps.placeholder || '请输入';
      const render = props.render ?? slots?.render;
      const renderFormItem = props.renderFormItem ?? slots?.renderFormItem;
      if (mode === 'read') {
        const dom = (
          <>
            {fieldProps?.prefix}
            {text ?? (emptyText || '-')}
            {fieldProps?.suffix}
          </>
        );
        if (render) {
          return render(text, { mode, fieldProps }, dom) ?? emptyText;
        }
        return dom;
      }
      if (mode === 'edit' || mode === 'update') {
        const renderDom = <Input {...fieldProps} type={type} allowClear placeholder={placeholder} />;
        if (renderFormItem) {
          return renderFormItem(text, { mode, fieldProps }, renderDom);
        }
        return renderDom;
      }
      return null;
    };
  },
});

FieldText.install = (app: App) => {
  app.component(FieldText.name, FieldText);
  return app;
};

export default FieldText as DefineComponent<TextFieldProps> & Plugin;
