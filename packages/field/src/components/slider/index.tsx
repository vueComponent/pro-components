import { defineComponent } from 'vue'
import { anyType, omit } from '@v-c/utils'
import { Slider } from 'ant-design-vue'
import { proFieldFC } from '../../typing'

const FieldSlider = defineComponent({
  name: 'ProFieldSlider',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: anyType()
    })
  },
  setup(props, { slots }) {
    return () => {
      const { text, mode, render, renderFormItem, fieldProps } = props
      if (mode === 'read') {
        const dom = text ?? props?.value
        if (render) {
          return render(text, { mode, ...fieldProps }, <>{dom}</>)
        }
        return <>{dom}</>
      }
      if (mode === 'edit' || mode === 'update') {
        const valProps = {
          value: text ?? props?.value,
          'onUpdate:value': (val: number | number[]) => {
            props?.['onUpdate:value']?.(val)
            fieldProps?.['onUpdate:value']?.(val)
          }
        }
        const dom = (
          <Slider
            {...omit(fieldProps, ['value', 'onUpdate:value'])}
            {...valProps}
            style={{
              minWidth: 120,
              ...fieldProps?.style
            }}
          />
        )
        if (renderFormItem) {
          return renderFormItem(text, { mode, ...fieldProps }, dom, slots)
        }
        return dom
      }
      return null
    }
  }
})

export default FieldSlider
