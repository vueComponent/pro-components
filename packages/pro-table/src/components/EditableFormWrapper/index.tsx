import { ProForm } from '@ant-design-vue/pro-form';
import { defineComponent, reactive, ref, toRaw, unref, watch, watchEffect } from 'vue';
export const editableFormWrapperProps = {
  model: Object,
  onValuesChange: Function,
};
export const EditableFormWrapper = defineComponent({
  name: 'EditableFormWrapper',
  props: editableFormWrapperProps,
  setup(props, { slots, emit }) {
    let modelValue = ref({});

    watchEffect(() => {
      modelValue.value = toRaw(props.model) || {};
    });

    return () => {
      return <ProForm model={modelValue}>{slots.default?.()}</ProForm>;
    };
  },
});
