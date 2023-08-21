import { useIntl } from '@ant-design-vue/pro-provider'
import { Image, Input } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { numberType, someType, stringType } from '@v-c/utils'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

const FieldImage = defineComponent({
  name: 'FieldImage',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: stringType(),
      width: numberType(),
      placeholder: someType<string | string[]>([String, Array])
    })
  },
  setup(props, { attrs, slots }) {
    const intl = useIntl()
    return () => {
      const {
        mode: type,
        render,
        renderFormItem,
        fieldProps,
        placeholder,
        width,
        ...rest
      } = props
      const text = props?.text ?? props?.value
      const placeholderValue =
        placeholder ||
        intl.value.getMessage('tableForm.inputPlaceholder', '请输入')
      const mergeProps = useMergeProps(rest, attrs, fieldProps)
      if (type === 'read') {
        const dom = <Image width={width || 32} src={text} {...mergeProps} />
        if (render) {
          return render(text, { mode: type, ...mergeProps }, dom)
        }
        return dom
      }
      if (type === 'edit' || type === 'update') {
        const dom = (
          <Input
            placeholder={placeholderValue}
            {...mergeProps}
            v-slots={slots}
          />
        )
        if (renderFormItem) {
          return renderFormItem(text, { mode: type, ...mergeProps }, dom, slots)
        }
        return dom
      }
      return null
    }
  }
})

export default FieldImage
