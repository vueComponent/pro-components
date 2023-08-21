import { defineComponent } from 'vue'
import { someType } from '@v-c/utils'
import { Rate } from 'ant-design-vue'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

const FieldRate = defineComponent({
  name: 'FieldRate',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: someType([String, Number])
    })
  },
  setup(props, { attrs, slots }) {
    return () => {
      const { text, mode, render, renderFormItem, fieldProps } = props

      if (mode === 'read') {
        const dom = (
          <Rate
            allowHalf
            disabled
            {...useMergeProps(attrs, fieldProps)}
            value={text}
          />
        )
        if (render) {
          return render(text, { mode, ...attrs, ...fieldProps }, <>{dom}</>)
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <Rate
            allowHalf
            {...useMergeProps(attrs, fieldProps)}
            v-slots={slots}
          />
        )
        if (renderFormItem) {
          return renderFormItem(
            text,
            { mode, ...attrs, ...fieldProps },
            dom,
            slots
          )
        }
        return dom
      }
      return null
    }
  }
})

export default FieldRate
