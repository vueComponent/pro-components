import { defineComponent } from 'vue'
import { useIntl } from '@ant-design-vue/pro-provider'
import { Input } from 'ant-design-vue'
import { stringType } from '@v-c/utils'
import { proFieldFC } from '../../typing'

const FieldTextArea = defineComponent({
  name: 'ProFieldTextArea',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: stringType()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()

    return () => {
      const { text, mode, render, renderFormItem, fieldProps } = props

      if (mode === 'read') {
        const dom = (
          <span
            style={{
              display: 'inline-block',
              padding: '4px 11px',
              lineHeight: '1.5715',
              maxWidth: '100%',
              whiteSpace: 'pre-wrap'
            }}
          >
            {text ?? '-'}
          </span>
        )
        if (render) {
          return render(text, { mode, ...fieldProps }, dom)
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <Input.TextArea
            v-slots={slots}
            rows={3}
            onKeyPress={(e: any) => {
              if (e.key === 'Enter') e.stopPropagation()
            }}
            placeholder={intl.value.getMessage(
              'tableForm.inputPlaceholder',
              '请输入'
            )}
            {...{ ...attrs, ...fieldProps }}
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

export default FieldTextArea
