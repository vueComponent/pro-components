import {
    computed,
    defineComponent,
    unref,
    type App,
    type Plugin,
    type DefineComponent,
    watch,
    toRaw
} from 'vue';
import { Form } from 'ant-design-vue';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons-vue';
import { baseFormProps, baseFormEmit, type BaseFormPropsType } from './types';
import { useFormState } from './hooks/useFormState';
import { useFromEvents } from './hooks/useFormEvents';
import { useFormMethods } from './hooks/useFormMethods';
import { createFromInstance } from './hooks/useFormInstance';
import type { BaseFormType } from './hooks';
import { Submitter } from './components/Submitter';

const BaseForm = defineComponent({
    name: 'BaseForm',
    inheritAttrs: false,
    props: baseFormProps,
    emits: baseFormEmit,
    setup(props, { attrs, emit, expose, slots }) {
        const fromState = useFormState({ props, attrs });
        const { model, formInstanceRef, getFormProps, RowWrapper } = fromState;
        let baseModel = unref(model);
        const formMethods = useFormMethods();
        const { handleFormValues } = formMethods;

        const formEvents = useFromEvents({ ...fromState, handleFormValues, props, emit });

        const instance = {
            ...fromState,
            ...formEvents,
            ...formMethods
        } as BaseFormType;

        createFromInstance(instance);

        expose(instance);

        const submitterProps = computed(() => {
            return typeof props.submitter === 'boolean' || !props.submitter ? {} : props.submitter;
        });
        watch(
            () => baseModel,
            curr => {
                emit('valuesChange', curr);
            },
            {
                deep: true
            }
        );

        const submitterNode = () => {
            if (!props.submitter) return undefined;
            return (
                <Submitter
                    {...submitterProps.value}
                    resetButtonProps={{}}
                    submitButtonProps={submitterProps.value.submitButtonProps || {}}
                    onSubmit={formEvents.submit}
                    onReset={formEvents.resetForm}
                    searchConfig={{
                        submitText: '查询'
                    }}
                    v-slots={{
                        submitIcon: () => <SearchOutlined />,
                        resetIcon: () => <UndoOutlined />
                    }}
                />
            );
        };

        return () => {
            // Slot "default" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.
            const children = slots?.default?.();
            const content = computed(() => {
                const wrapItems = unref(getFormProps).grid ? (
                    <RowWrapper>{children}</RowWrapper>
                ) : (
                    children
                );
                if (props.contentRender) {
                    return props.contentRender(wrapItems as any, submitterNode());
                }
                return wrapItems;
            });
            return (
                <Form ref={formInstanceRef} {...unref(getFormProps)} model={baseModel}>
                    {unref(content)}
                </Form>
            );
        };
    }
});

BaseForm.install = (app: App) => {
    app.component(BaseForm.name, BaseForm);
    return app;
};

export default BaseForm as DefineComponent<BaseFormPropsType> & Plugin;
