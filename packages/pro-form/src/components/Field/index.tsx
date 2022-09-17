import { unref, defineComponent, FunctionalComponent } from 'vue';
import ProField, { type ProFieldPropsType } from '@ant-design-vue/pro-field';
import ProFormItem from '../FormItem';
import type { ProFormFieldItemProps } from '../../typings';
import { useGridHelpers } from '../../helpers';
import { useFormInstance } from '../../BaseForm/hooks/useFormInstance';

type NameType = string | number;

export type ProFormFieldProps<FiledProps = Record<string, any>> = ProFormFieldItemProps<FiledProps> &
  Pick<ProFieldPropsType, 'valueType'>;

const ProFormField = defineComponent<ProFormFieldProps>({
  name: 'BaseProFormField',
  inheritAttrs: false,
  props: ['valueType', 'fieldProps', 'filedConfig', 'formItemProps', 'colProps'] as any,
  setup(props, { attrs }) {
    const formContext = useFormInstance();
    return () => {
      const valueType = props.valueType || 'text';
      const FormItem: FunctionalComponent = () => {
        return (
          <ProFormItem
            v-slots={{
              default: () => (
                <ProField
                  {...props}
                  {...attrs}
                  valueType={valueType}
                  mode={formContext.getFormProps.value.readonly ? 'read' : 'edit'}
                  fieldProps={{
                    ...props.fieldProps,
                    'onUpdate:value'(value) {
                      // 更新form的model数据
                      (formContext.model.value || {})[props.formItemProps?.name as NameType] = value;
                    },
                  }}
                  formItemProps={{
                    ...props.formItemProps,
                    model: formContext.model.value,
                  }}
                />
              ),
            }}
            {...attrs}
          />
        );
      };
      const { ColWrapper } = unref(useGridHelpers({ colProps: props.colProps }));
      return <ColWrapper>{FormItem}</ColWrapper>;
    };
  },
});

export default ProFormField;
