import { defineComponent } from 'vue'
import { useIntl } from '@ant-design-vue/pro-provider'
import { FieldLabel, parseValueToDay } from '@ant-design-vue/pro-utils'
import type { DatePickerProps } from 'ant-design-vue'
import { DatePicker } from 'ant-design-vue'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { anyType, booleanType, stringType, useState } from '@v-c/utils'
import { proFieldFC, proFieldLightProps } from '../../typing'
import { useMergeProps } from '../../_utils'

dayjs.extend(weekOfYear)

const formatDate = (text: any, format: any) => {
  if (!text) return '-'
  if (typeof format === 'function') {
    return format(dayjs(text))
  } else {
    return dayjs(text).format(format || 'YYYY-MM-DD')
  }
}

const FieldDatePicker = defineComponent({
  name: 'FieldDatePicker',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...proFieldLightProps,
      text: anyType(),
      format: stringType(),
      showTime: booleanType(),
      bordered: booleanType(),
      picker: anyType<DatePickerProps['picker']>()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()

    const [open, setOpen] = useState<boolean>(false)
    return () => {
      const {
        text,
        mode,
        format,
        label,
        light,
        render,
        renderFormItem,
        plain,
        showTime,
        fieldProps,
        picker,
        bordered,
        lightLabel
      } = props
      const restProps = useMergeProps(attrs, fieldProps)
      if (mode === 'read') {
        const dom = formatDate(text, fieldProps.format || format)
        if (render) {
          return render(text, { mode, ...restProps }, <>{dom}</>)
        }
        return <>{dom}</>
      }
      if (mode === 'edit' || mode === 'update') {
        let dom
        const {
          disabled,
          value,
          placeholder = intl.value.getMessage(
            'tableForm.selectPlaceholder',
            '请选择'
          )
        } = fieldProps

        const dayValue = parseValueToDay(value) as dayjs.Dayjs

        if (light) {
          dom = (
            <FieldLabel
              label={label}
              onClick={() => {
                fieldProps?.onOpenChange?.(true)
                setOpen(true)
              }}
              style={
                dayValue
                  ? {
                      paddingInlineEnd: 0
                    }
                  : undefined
              }
              disabled={disabled}
              value={
                dayValue || open.value ? (
                  <DatePicker
                    picker={picker}
                    showTime={showTime}
                    format={format}
                    {...restProps}
                    placeholder={placeholder}
                    value={dayValue}
                    onOpenChange={(isOpen) => {
                      setOpen(isOpen)
                      fieldProps?.onOpenChange?.(isOpen)
                    }}
                    bordered={false}
                    open={open.value}
                  />
                ) : undefined
              }
              allowClear={false}
              downIcon={dayValue || open.value ? false : undefined}
              bordered={bordered}
              ref={lightLabel}
            />
          )
        } else {
          dom = (
            <DatePicker
              picker={picker}
              showTime={showTime}
              format={format}
              placeholder={placeholder}
              bordered={plain === undefined ? true : !plain}
              {...restProps}
              value={dayValue}
              v-slots={slots}
            />
          )
        }
        if (renderFormItem) {
          return renderFormItem(text, { mode, ...restProps }, dom, slots)
        }
        return dom
      }
      return null
    }
  }
})

export default FieldDatePicker
