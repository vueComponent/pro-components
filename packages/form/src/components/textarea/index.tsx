import { defineComponent } from 'vue'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'

/**
 * 文本组件
 *
 * @param
 */
const ProFormTextarea = defineComponent({
  name: 'ProFormTextarea',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props, { slots }) {
    return () => {
      const { fieldProps, proFieldProps, ...rest } = props

      return (
        <ProField
          valueType="textarea"
          fieldProps={fieldProps}
          proFieldProps={proFieldProps}
          {...rest}
          v-slots={slots}
        />
      )
    }
  }
})

export default ProFormTextarea
