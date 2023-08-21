import { useIntl } from '@ant-design-vue/pro-provider'
import { InputNumber } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { anyType, stringType } from '@v-c/utils'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

export interface FieldDigitProps {
  text: number
  placeholder?: string
}

/**
 * 格式化秒
 *
 * @param result
 * @returns {string}
 */
export function formatSecond(result: number) {
  let formatText = ''
  const d = Math.floor(result / (3600 * 24))
  const h = Math.floor(result / 3600)
  const m = Math.floor((result / 60) % 60)
  const s = Math.floor(result % 60)
  formatText = `${s}秒`
  if (m > 0) {
    formatText = `${m}分钟${formatText}`
  }
  if (h > 0) {
    formatText = `${h}小时${formatText}`
  }
  if (d > 0) {
    formatText = `${d}天${formatText}`
  }
  return formatText
}

/**
 * 格式化秒
 *
 * @param FieldSecond
 */
const FieldSecond = defineComponent({
  name: 'FieldSecond',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: anyType<number>(),
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
        renderFormItem,
        fieldProps,
        placeholder
      } = props
      const placeholderValue =
        placeholder ||
        intl.value.getMessage('tableForm.inputPlaceholder', '请输入')
      if (type === 'read') {
        const secondText = formatSecond(Number(text) as number)
        const dom = <span>{secondText}</span>
        if (render) {
          return render(text, { mode: type, ...attrs, ...fieldProps }, dom)
        }
        return dom
      }
      if (type === 'edit' || type === 'update') {
        const dom = (
          <InputNumber
            min={0}
            style={{
              width: '100%'
            }}
            placeholder={placeholderValue}
            {...useMergeProps(attrs, fieldProps)}
          />
        )
        if (renderFormItem) {
          return renderFormItem(text, { mode: type, ...fieldProps }, dom, slots)
        }
        return dom
      }
      return null
    }
  }
})

export default FieldSecond
