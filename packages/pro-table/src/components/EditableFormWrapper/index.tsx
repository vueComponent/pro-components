import { ProForm } from '@ant-design-vue/pro-form';
import { defineComponent, reactive, unref, watchEffect } from 'vue';
export const editableFormWrapperProps = {
    model: Object,
    onValuesChange: Function
};
export const EditableFormWrapper = defineComponent({
    name: 'EditableFormWrapper',
    props: editableFormWrapperProps,
    setup(props, { slots, emit }) {
        let modelValue = reactive({ model: {} });
        watchEffect(() => {
            modelValue.model = props.model || {};
        });
        return () => {
            return (
                <ProForm
                    onValuesChange={values => {
                        if (props.onValuesChange) {
                            props?.onValuesChange(values);
                        }
                    }}
                    model={modelValue.model}
                >
                    {slots.default?.()}
                </ProForm>
            );
        };
    }
});
