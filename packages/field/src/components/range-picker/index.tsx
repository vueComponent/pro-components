import { useIntl } from '@ant-design-vue/pro-provider'
import { defineComponent } from 'vue'
import {
  anyType,
  booleanType,
  someType,
  stringType,
  useState
} from '@v-c/utils'
import type { DatePickerProps } from 'ant-design-vue'
import { DatePicker } from 'ant-design-vue'
import dayjs from 'dayjs'
import { FieldLabel, parseValueToDay } from '@ant-design-vue/pro-utils'
import { proFieldFC, proFieldLightProps } from '../../typing'
import { useMergeProps } from '../../_utils'

const FieldRangePicker = defineComponent({
  name: 'FieldRangePicker',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...proFieldLightProps,
      text: someType<string[] | string>([Array, String]),
      value: someType<string[] | string>([Array, String]),
      format: stringType(),
      bordered: booleanType(),
      showTime: booleanType(),
      picker: anyType<DatePickerProps['picker']>()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()
    const [open, setOpen] = useState<boolean>(false)

    return () => {
      const {
        mode,
        light,
        label,
        format,
        render,
        picker,
        renderFormItem,
        plain,
        showTime,
        lightLabel,
        bordered,
        fieldProps
      } = props
      const text = props?.text ?? props?.value
      const [startText, endText] = Array.isArray(text) ? text : []
      // antd 改了一下 交互，这里要兼容一下，不然会导致无法选中第二个数据
      const genFormatText = (formatValue: dayjs.Dayjs) => {
        if (typeof fieldProps?.format === 'function') {
          return fieldProps?.format?.(formatValue)
        }
        return fieldProps?.format || format || 'YYYY-MM-DD'
      }

      // activePickerIndex for https://github.com/ant-design/ant-design/issues/22158
      const parsedStartText: string = startText
        ? dayjs(startText).format(genFormatText(dayjs(startText)))
        : ''
      const parsedEndText: string = endText
        ? dayjs(endText).format(genFormatText(dayjs(endText)))
        : ''

      if (mode === 'read') {
        const dom = (
          <div>
            <div>{parsedStartText || '-'}</div>
            <div>{parsedEndText || '-'}</div>
          </div>
        )
        if (render) {
          return render(
            text,
            { mode, ...useMergeProps(attrs, fieldProps) },
            <span>{dom}</span>
          )
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dayValue = parseValueToDay(fieldProps.value) as dayjs.Dayjs[]
        let dom

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
              disabled={fieldProps.disabled}
              value={
                dayValue || open.value ? (
                  <DatePicker.RangePicker
                    picker={picker}
                    showTime={showTime}
                    format={format}
                    bordered={false}
                    {...fieldProps}
                    placeholder={
                      fieldProps.placeholder ?? [
                        intl.value.getMessage(
                          'tableForm.selectPlaceholder',
                          '请选择'
                        ),
                        intl.value.getMessage(
                          'tableForm.selectPlaceholder',
                          '请选择'
                        )
                      ]
                    }
                    onClear={() => {
                      setOpen(false)
                      fieldProps?.onClear?.()
                    }}
                    value={dayValue}
                    onOpenChange={(isOpen) => {
                      if (dayValue) setOpen(isOpen)
                      fieldProps?.onOpenChange?.(isOpen)
                    }}
                  />
                ) : null
              }
              allowClear={false}
              bordered={bordered}
              ref={lightLabel}
              downIcon={dayValue || open.value ? false : undefined}
            />
          )
        } else {
          dom = (
            <DatePicker.RangePicker
              format={format}
              showTime={showTime}
              placeholder={[
                intl.value.getMessage('tableForm.selectPlaceholder', '请选择'),
                intl.value.getMessage('tableForm.selectPlaceholder', '请选择')
              ]}
              bordered={plain === undefined}
              {...fieldProps}
              value={dayValue}
            />
          )
        }
        if (renderFormItem) {
          return renderFormItem(text, { mode, ...fieldProps }, dom, slots)
        }
        return dom
      }
      return null
    }
  }
})

export default FieldRangePicker
