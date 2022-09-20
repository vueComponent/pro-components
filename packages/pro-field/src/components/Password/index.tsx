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
    const renderDom = <InputPassword allowClear {...props.fieldProps} />;
    return () => {
      const render = props.render ?? slots.render;
      const renderFormItem = props.renderFormItem ?? slots?.renderFormItem;

      const visible = ref(props.visible);

      if (props.mode === 'read') {
        let dom = <>-</>;
        if (props.text) {
          dom = (
            <Space>
              <span>{visible.value ? props.text : '＊ ＊ ＊ ＊ ＊'}</span>
              <a onClick={() => (visible.value = !visible.value)}>
                {visible.value ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </a>
            </Space>
          );
        }
        if (render) {
          return render(props.text, { mode: props.mode, fieldProps: props.fieldProps }, dom);
        }
        return dom;
      }
      if (props.mode === 'edit' || props.mode === 'update') {
        if (renderFormItem) {
          return renderFormItem(props.text, { mode: props.mode, ...props.fieldProps }, renderDom);
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
