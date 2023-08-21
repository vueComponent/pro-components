import { defineComponent } from 'vue'
import { anyType } from '@v-c/utils'
import ProFormField from '../field'
import { proFormFieldItemProps } from '../../typing'

/**
 * 分段控制器
 *
 * @param
 */
const ProFormSegmented = defineComponent({
  name: 'ProFormSegmented',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps,
    options: anyType()
  },
  setup(props, { slots }) {
    return () => {
      const { fieldProps, params, proFieldProps, fieldConfig, ...rest } = props

      return (
        <ProFormField
          valueType="segmented"
          fieldProps={fieldProps}
          params={params}
          fieldConfig={{ customLightMode: true, ...fieldConfig }}
          proFieldProps={proFieldProps}
          v-slots={slots}
          {...rest}
        />
      )
    }
  }
})

export default ProFormSegmented
