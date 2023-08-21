import { anyType, booleanType, numberType } from '@v-c/utils'
import { defineComponent } from 'vue'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'

export const proFormSliderProps = {
  ...proFormFieldItemProps,
  range: booleanType(),
  min: numberType(),
  max: numberType(),
  step: numberType(),
  marks: anyType(),
  vertical: anyType()
}
/**
 * 文本选择组件
 *
 * @param
 */
const ProFormSlider = defineComponent({
  name: 'ProFormSlider',
  inheritAttrs: false,
  props: {
    ...proFormSliderProps
  },
  setup(props, { slots }) {
    // TODO
    return () => {
      const {
        fieldProps,
        proFieldProps,
        min,
        max,
        step,
        marks,
        vertical,
        fieldConfig,
        range,
        ...rest
      } = props
      return (
        <ProField
          valueType="slider"
          fieldProps={{
            ...fieldProps,
            min,
            max,
            step,
            marks,
            vertical,
            range,
            style: fieldProps?.style
          }}
          proFieldProps={proFieldProps}
          fieldConfig={{
            ignoreWidth: true,
            ...fieldConfig
          }}
          v-slots={slots}
          {...rest}
        />
      )
    }
  }
})

export default ProFormSlider
