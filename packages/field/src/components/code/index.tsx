import { Input } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { stringType } from '@v-c/utils'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

const languageFormat = (text: string, language: string) => {
  if (typeof text !== 'string') {
    return text
  }
  try {
    if (language === 'json') {
      return JSON.stringify(JSON.parse(text), null, 2)
    }
  } catch (error) {
    // console.log(error)
  }
  return text
}

/**
 * 代码片段组件 这个组件为了显示简单的配置，复杂的请使用更加重型的组件
 *
 * @param
 */
const FieldCode = defineComponent({
  name: 'FieldCode',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: stringType(),
      language: stringType<'json' | 'text'>()
    })
  },
  setup(props, { slots, attrs }) {
    return () => {
      const {
        text,
        mode,
        render,
        language = 'text',
        renderFormItem,
        plain,
        fieldProps
      } = props
      const code = languageFormat(text, language)
      const restProps = useMergeProps(attrs, fieldProps)
      if (mode === 'read') {
        const dom = (
          <pre
            {...restProps}
            style={{
              padding: 16,
              overflow: 'auto',
              fontSize: '85%',
              lineHeight: 1.45,
              backgroundColor: '#f6f8fa',
              borderRadius: 3,
              width: 'min-content',
              ...fieldProps.style
            }}
          >
            <code>{code}</code>
          </pre>
        )
        if (render) {
          return render(code, { mode, ...restProps }, dom)
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        let dom = <Input.TextArea rows={5} {...restProps} />
        if (plain) {
          dom = <Input {...restProps} />
        }
        if (renderFormItem) {
          return (
            renderFormItem(code, { mode, ...restProps }, dom, slots) ?? null
          )
        }
        return dom
      }
      return null
    }
  }
})

export default FieldCode
