import { defineComponent } from 'vue'
import { proFormFieldItemProps, proFormFieldRemoteProps } from '../../typing'
import ProFormField from '../field'

export const proFormTreeSelectProps = {
  ...proFormFieldItemProps,
  ...proFormFieldRemoteProps
}

/**
 * 树下拉选择框
 *
 * @param
 */
const ProFormTreeSelect = defineComponent({
  name: 'ProFormTreeSelect',
  inheritAttrs: false,
  props: {
    ...proFormTreeSelectProps
  },
  setup(props, { slots }) {
    const { fieldProps, request, params, proFieldProps, fieldConfig, ...rest } =
      props
    return () => {
      return (
        <ProFormField
          valueType="treeSelect"
          fieldProps={fieldProps}
          request={request}
          params={params}
          fieldConfig={{ customLightMode: true, ...fieldConfig }}
          proFieldProps={proFieldProps}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})

export default ProFormTreeSelect
