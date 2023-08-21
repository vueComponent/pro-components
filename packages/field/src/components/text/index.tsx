import { useIntl } from '@ant-design-vue/pro-provider'
import { stringType, vNodeType } from '@v-c/utils'
import { defineComponent, shallowRef, watchPostEffect } from 'vue'
import { Input } from 'ant-design-vue'
import { proFieldFC } from '../../typing'

const FieldText = defineComponent({
  name: 'ProFieldText',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: stringType(),
      emptyText: vNodeType()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()
    const inputRef = shallowRef<HTMLInputElement>()

    watchPostEffect(() => {
      if (props.fieldProps?.autoFocus) {
        inputRef.value?.focus()
      }
    })

    return () => {
      const {
        text,
        mode,
        render,
        renderFormItem,
        fieldProps,
        emptyText = '-'
      } = props
      const { prefix = '', suffix = '' } = fieldProps || {}

      if (mode === 'read') {
        const dom = (
          <>
            {prefix}
            {text ?? emptyText}
            {suffix}
          </>
        )

        if (render) {
          return render(text, { mode, ...fieldProps }, dom, slots) ?? emptyText
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const placeholder = intl.value.getMessage(
          'tableForm.inputPlaceholder',
          '请输入'
        )
        const dom = (
          <Input
            ref={inputRef}
            placeholder={placeholder}
            allowClear
            v-slots={slots}
            {...{
              ...attrs,
              ...fieldProps
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

export default FieldText
