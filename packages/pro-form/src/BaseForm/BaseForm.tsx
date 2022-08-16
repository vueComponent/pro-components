import { defineComponent, unref, type App, type Plugin, type DefineComponent } from 'vue';
import { Form } from 'ant-design-vue';
import { baseFormProps, baseFormEmit, type BaseFormPropsType } from './types';
import { useFormState } from './hooks/useFormState';
import { useFromEvents } from './hooks/useFormEvents';
import { useFormMethods } from './hooks/useFormMethods';
import { createFromInstance } from './hooks/useFormInstance';

const BaseForm = defineComponent({
  name: 'BaseForm',
  inheritAttrs: false,
  props: baseFormProps,
  emits: baseFormEmit,
  setup(props, { attrs, emit, expose, slots }) {
    const fromState = useFormState({ props, attrs });
    const { model, formInstanceRef, getFormProps } = fromState;

    const formMethods = useFormMethods();
    const { handleFormValues } = formMethods;

    const formEvents = useFromEvents({ ...fromState, handleFormValues, props, emit });

    const instance = {
      ...fromState,
      ...formEvents,
      ...formMethods,
    };
    createFromInstance(instance);

    expose(instance);
    return () => {
      return (
        <Form ref={formInstanceRef} {...unref(getFormProps)} model={unref(model)}>
          {slots?.default?.()}
        </Form>
      );
    };
  },
});

BaseForm.install = (app: App) => {
  app.component(BaseForm.name, BaseForm);
  return app;
};

export default BaseForm as DefineComponent<BaseFormPropsType> & Plugin;
