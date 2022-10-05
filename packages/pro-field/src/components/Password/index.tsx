import { ref, defineComponent, type App, DefineComponent, Plugin } from 'vue';
import { Space, InputPassword } from 'ant-design-vue';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { passwordTextProps, type PasswordTextProps } from './types';

const FieldPassword = defineComponent({
  name: 'FieldPassword',
  inheritAttrs: false,
  props: passwordTextProps,
  slots: ['render', 'renderFormItem'],
  setup(props, { slots }) {
    return () => {
      const { mode, text, fieldProps } = props;
      const placeholder = fieldProps.placeholder || '请输入';
      const render = props.render ?? slots.render;
      const renderFormItem = props.renderFormItem ?? slots?.renderFormItem;

      const visible = ref(props.visible);

      if (mode === 'read') {
        let dom = <>-</>;
        if (text) {
          dom = (
            <Space>
              <span>{visible.value ? text : '＊ ＊ ＊ ＊ ＊'}</span>
              <a onClick={() => (visible.value = !visible.value)}>
                {visible.value ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </a>
            </Space>
          );
        }
        if (render) {
          return render(text, { mode, fieldProps }, dom);
        }
        return dom;
      }
      if (mode === 'edit' || mode === 'update') {
        const renderDom = <InputPassword {...props.fieldProps} allowClear placeholder={placeholder} />;
        if (renderFormItem) {
          return renderFormItem(text, { mode, fieldProps }, renderDom);
        }
        return renderDom;
      }
      return null;
    };
  },
});

FieldPassword.install = (app: App) => {
  app.component(FieldPassword.name, FieldPassword);
  return app;
};

export default FieldPassword as DefineComponent<PasswordTextProps> & Plugin;
