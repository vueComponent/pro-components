import { defineComponent } from 'vue'
import { someType, stringType } from '@v-c/utils'
import { useIntl } from '@ant-design-vue/pro-provider'
import toNumber from 'lodash.tonumber'
import { InputNumber, Progress } from 'ant-design-vue'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

export function getProgressStatus(
  text: number
): 'success' | 'exception' | 'normal' | 'active' {
  if (text === 100) {
    return 'success'
  }
  if (text < 0) {
    return 'exception'
  }
  if (text < 100) {
    return 'active'
  }

  return 'normal'
}

const FieldProgress = defineComponent({
  name: 'FieldProgress',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: someType<string | number>([String, Number]),
      placeholder: stringType()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()
    return () => {
      const {
        mode,
        render,
        plain,
        renderFormItem,
        fieldProps,
        placeholder,
        ...rest
      } = props
      const placeholderValue =
        placeholder ||
        intl.value.getMessage('tableForm.inputPlaceholder', '请输入')
      const text = props.text || props?.value
      const realValue =
        typeof text === 'string' && (text as string).includes('%')
          ? toNumber((text as string).replace('%', ''))
          : toNumber(text)
      if (mode === 'read') {
        const dom = (
          <Progress
            size="small"
            style={{ minWidth: 100, maxWidth: 320 }}
            percent={realValue}
            steps={plain ? 10 : undefined}
            status={getProgressStatus(realValue as number)}
            {...useMergeProps(rest, attrs, fieldProps)}
          />
        )
        if (render) {
          return render(
            realValue,
            { mode, ...useMergeProps(rest, attrs, fieldProps) },
            dom
          )
        }
        return dom
      }

      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <InputNumber
            placeholder={placeholderValue}
            {...useMergeProps(rest, attrs, fieldProps)}
            v-slots={slots}
          />
        )
        if (renderFormItem) {
          return renderFormItem(
            text,
            { mode, ...useMergeProps(rest, attrs, fieldProps) },
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

export default FieldProgress
