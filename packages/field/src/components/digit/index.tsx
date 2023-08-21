import { defineComponent } from 'vue'
import { useIntl } from '@ant-design-vue/pro-provider'
import { omit, someType, stringType } from '@v-c/utils'
import { isNil } from '@ant-design-vue/pro-utils'
import { InputNumber } from 'ant-design-vue'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

const FieldDigit = defineComponent({
  name: 'FieldDigit',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: someType([String, Number]),
      placeholder: stringType()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()
    return () => {
      const {
        text,
        mode: type,
        render,
        placeholder,
        renderFormItem,
        fieldProps,
        ...rest
      } = props

      const restProps = useMergeProps(rest, attrs, fieldProps)
      const placeholderValue =
        placeholder ||
        intl.value.getMessage('tableForm.inputPlaceholder', '请输入')

      const proxyChange = (value: number | string | null) => {
        let val = value ?? undefined

        if (!fieldProps.stringMode && typeof val === 'string') {
          val = Number(val)
        }
        if (
          typeof val === 'number' &&
          !isNil(val) &&
          !isNil(fieldProps.precision)
        ) {
          val = Number(val.toFixed(fieldProps.precision))
        }
        return fieldProps?.onChange?.(val)
      }

      if (type === 'read') {
        let fractionDigits = {} as any
        if (fieldProps?.precision) {
          fractionDigits = {
            minimumFractionDigits: Number(fieldProps.precision),
            maximumFractionDigits: Number(fieldProps.precision)
          }
        }
        const digit = new Intl.NumberFormat(undefined, {
          ...fractionDigits,
          ...(fieldProps?.intlProps || {})
        }).format(Number(text) as number)
        const dom = <span>{fieldProps?.formatter?.(digit) || digit}</span>
        if (render) {
          return render(text, { mode: type, ...restProps }, dom)
        }
        return dom
      }
      if (type === 'edit' || type === 'update') {
        const dom = (
          <InputNumber
            min={0}
            placeholder={placeholderValue}
            {...omit(restProps, ['onChange'])}
            onChange={proxyChange}
            v-slots={slots}
          />
        )
        if (renderFormItem) {
          return renderFormItem(text, { mode: type, ...restProps }, dom, slots)
        }
        return dom
      }
      return null
    }
  }
})

export default FieldDigit
