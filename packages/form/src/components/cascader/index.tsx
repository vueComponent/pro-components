import { defineComponent } from 'vue'
import { proFormFieldItemProps, proFormFieldRemoteProps } from '../../typing'
import ProField from '../field'
import { useFieldContextInject } from '../../field-context'

const ProFormCascader = defineComponent({
  name: 'ProFormCascader',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps,
    ...proFormFieldRemoteProps
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { fieldProps, request, params, proFieldProps, ...rest } = props
      const context = useFieldContextInject()
      return (
        <ProField
          fieldProps={
            {
              getPopupContainer: context.value.getPopupContainer,
              ...fieldProps
            } as any
          }
          {...{
            valueType: 'cascader',
            request,
            fieldConfig: { customLightMode: true }
          }}
          params={params}
          proFieldProps={proFieldProps}
          {...attrs}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})

export default ProFormCascader
