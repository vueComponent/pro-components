import { computed, defineComponent } from 'vue'
import { anyType, numberType, omit, someType, stringType } from '@v-c/utils'
import { useIntl } from '@ant-design-vue/pro-provider'
import { useMergedState } from '@ant-design-vue/pro-utils'
import { Form, Input, InputNumber } from 'ant-design-vue'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

export type Value = string | number | undefined | null

export type ValuePair = Value[]

export interface FieldDigitRangeProps {
  text: ValuePair
  placeholder?: string | string[]
  separator?: string
  separatorWidth?: number
}

const FieldDigitRange = defineComponent({
  name: 'FieldDigitRange',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: anyType<ValuePair>(),
      placeholder: someType<string | string[]>([String, Array]),
      separator: stringType(),
      separatorWidth: numberType()
    })
  },
  setup(props, { attrs, slots }) {
    const intl = useIntl()
    const formItemContext = Form.useInjectFormItemContext()
    const [valuePair, setValuePair] = useMergedState(
      () => props?.defaultValue,
      {
        value: computed(() => props.fieldProps?.value ?? props?.value),
        onChange: (...args: any[]) => {
          props?.fieldProps?.onChange?.(...args) ?? props.onChange?.(...args)
        }
      }
    )

    return () => {
      const {
        text,
        mode: type,
        render,
        placeholder,
        renderFormItem,
        fieldProps,
        separator = '~',
        separatorWidth = 30
      } = props
      const { id, defaultValue } = fieldProps
      const restProps = omit(useMergeProps(attrs, fieldProps), [
        'onChange',
        'onUpdate:value'
      ])
      const onUpdateValue = (value: ValuePair | undefined) => {
        formItemContext.onFieldChange?.()
        props?.fieldProps?.['onUpdate:value']?.(value)
        props?.['onUpdate:value']?.(value)
        ;(attrs as any)?.['onUpdate:value']?.(value)
      }
      if (type === 'read') {
        const getContent = (number: Value) => {
          const digit = new Intl.NumberFormat(undefined, {
            minimumSignificantDigits: 2,
            ...(fieldProps?.intlProps || {})
          }).format(Number(number) as number)

          return fieldProps?.formatter?.(digit) || digit
        }
        const dom = (
          <span>
            {getContent(text[0])} {separator} {getContent(text[1])}
          </span>
        )
        if (render) {
          return render(text, { mode: type, ...restProps }, dom)
        }
        return dom
      }

      if (type === 'edit' || type === 'update') {
        const handleGroupBlur = () => {
          if (Array.isArray(valuePair.value)) {
            formItemContext.onFieldBlur?.()
            //   仅在两个值均为数字时才做比较并转换
            const [value0, value1] = valuePair.value
            if (
              typeof value0 === 'number' &&
              typeof value1 === 'number' &&
              value0 > value1
            ) {
              setValuePair([value1, value0])
              onUpdateValue([value1, value0])
            } else if (value0 === undefined && value1 === undefined) {
              // 当两个值均为undefined时将值变为undefined，方便required处理
              setValuePair(undefined)
              onUpdateValue(undefined)
            }
          }
        }

        const handleChange = (index: number, changedValue: Value) => {
          const newValuePair = [...(valuePair.value || [])]
          newValuePair[index] = changedValue === null ? undefined : changedValue
          setValuePair(newValuePair)
          onUpdateValue(newValuePair)
        }
        const placeholderValue = fieldProps?.placeholder ||
          placeholder || [
            intl.value.getMessage('tableForm.inputPlaceholder', '请输入'),
            intl.value.getMessage('tableForm.inputPlaceholder', '请输入')
          ]

        const getInputNumberPlaceholder = (index: number) =>
          Array.isArray(placeholderValue)
            ? placeholderValue[index]
            : placeholderValue

        const dom = (
          <Input.Group
            compact
            {...{
              onBlur: handleGroupBlur
            }}
          >
            <Form.ItemRest>
              <InputNumber
                {...restProps}
                placeholder={getInputNumberPlaceholder(0)}
                id={id ?? `${id}-0`}
                style={{ width: `calc((100% - ${separatorWidth}px) / 2)` }}
                value={valuePair.value?.[0]}
                defaultValue={defaultValue?.[0]}
                onChange={(changedValue) => handleChange(0, changedValue)}
                onBlur={handleGroupBlur}
              />
            </Form.ItemRest>
            <Form.ItemRest>
              <Input
                style={{
                  width: `${separatorWidth}px`,
                  textAlign: 'center',
                  borderInlineStart: 0,
                  borderInlineEnd: 0,
                  pointerEvents: 'none',
                  backgroundColor: '#FFF'
                }}
                placeholder={separator}
                disabled
              />
            </Form.ItemRest>
            <Form.ItemRest>
              <InputNumber
                {...restProps}
                placeholder={getInputNumberPlaceholder(1)}
                id={id ?? `${id}-1`}
                style={{
                  width: `calc((100% - ${separatorWidth}px) / 2)`,
                  borderInlineStart: 0
                }}
                value={valuePair.value?.[1]}
                defaultValue={defaultValue?.[1]}
                onChange={(changedValue) => handleChange(1, changedValue)}
                onBlur={handleGroupBlur}
              />
            </Form.ItemRest>
          </Input.Group>
        )
        if (renderFormItem) {
          return renderFormItem(
            text,
            { mode: type, ...restProps, onChange: fieldProps.onChange },
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

export default FieldDigitRange
