import { defineComponent } from 'vue'
import { proFormFieldItemProps } from '../../typing'
import ProField from '../field'

/**
 * 评分组件
 *
 * @param
 */
const ProFormRate = defineComponent({
  name: 'ProFormRate',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props) {
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props
      return (
        <ProField
          valueType="rate"
          fieldProps={fieldProps}
          proFieldProps={proFieldProps}
          fieldConfig={{
            ignoreWidth: true,
            ...fieldConfig
          }}
          {...rest}
        />
      )
    }
  }
})

export default ProFormRate
