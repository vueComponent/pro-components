import { defineComponent, type App, DefineComponent, Plugin, ExtractPropTypes } from 'vue';
import { commonFormProps } from '../BaseForm/types';
import { BaseForm } from '../BaseForm/index';
import { Action } from '../QueryFilter/components/form-action/action';

export const proFormPorps = {
  ...commonFormProps,
};

export type ProFormPorps = Partial<ExtractPropTypes<typeof proFormPorps>>;

const ProForm = defineComponent({
  name: 'ProForm',
  inheritAttrs: false,
  props: proFormPorps,
  setup(props, { slots }) {
    return () => {
      return (
        <BaseForm {...props} layout={'vertical'}>
          {slots?.default?.()}
          <Action collapseRender={false} />
        </BaseForm>
      );
    };
  },
});

ProForm.install = (app: App) => {
  app.component(ProForm.name, ProForm);
  return app;
};

export default ProForm as DefineComponent<ProFormPorps> & Plugin;
