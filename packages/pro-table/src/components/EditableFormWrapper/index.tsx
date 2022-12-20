import { ProForm } from '@ant-design-vue/pro-form';
import { defineComponent, unref } from 'vue';
export const editableFormWrapperProps = {
    model: Object
};
export const EditableFormWrapper = defineComponent({
    name: 'EditableFormWrapper',
    props: editableFormWrapperProps,
    setup(props, { slots }) {
        const modelValue = unref(props.model || {});
        console.log('modelValue', modelValue);

        return () => {
            return <ProForm model={modelValue}>{slots.default?.()}</ProForm>;
        };
    }
});
