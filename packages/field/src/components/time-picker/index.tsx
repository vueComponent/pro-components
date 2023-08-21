import { defineComponent } from 'vue'
import { anyType, stringType, useState } from '@v-c/utils'
import { useIntl } from '@ant-design-vue/pro-provider'
import dayjs from 'dayjs'
import { DatePicker, TimePicker, TimeRangePicker } from 'ant-design-vue'
import { FieldLabel, parseValueToDay } from '@ant-design-vue/pro-utils'
import { proFieldFC, proFieldLightProps } from '../../typing'
import { useMergeProps } from '../../_utils'

const FieldTimePicker = defineComponent({
  name: 'FieldTimePicker',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...proFieldLightProps,
      text: anyType<string | number>(),
      format: stringType()
    })
  },
  setup(props, { slots, attrs }) {
    const [open, setOpen] = useState<boolean>(false)
    const intl = useIntl()

    return () => {
      const {
        text,
        mode,
        light,
        label,
        format,
        render,
        renderFormItem,
        plain,
        fieldProps,
        lightLabel
      } = props
      const restProps = useMergeProps(attrs, fieldProps)
      const finalFormat = fieldProps?.format || format || 'HH:mm:ss'

      const isNumberOrMoment = dayjs.isDayjs(text) || typeof text === 'number'

      if (mode === 'read') {
        const dom = (
          <span>
            {text
              ? dayjs(text, isNumberOrMoment ? undefined : finalFormat).format(
                  finalFormat
                )
              : '-'}
          </span>
        )
        if (render) {
          return render(text, { mode, ...restProps }, <span>{dom}</span>)
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        let dom
        const { disabled, value } = fieldProps
        const dayValue = parseValueToDay(value, finalFormat) as dayjs.Dayjs
        if (light) {
          dom = (
            <FieldLabel
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
              label={label}
              disabled={disabled}
              value={
                dayValue || open.value ? (
                  <TimePicker
                    bordered={false}
                    format={format}
                    {...restProps}
                    placeholder={
                      fieldProps.placeholder ??
                      intl.value.getMessage(
                        'tableForm.selectPlaceholder',
                        '请选择'
                      )
                    }
                    value={dayValue}
                    onOpenChange={(isOpen) => {
                      setOpen(isOpen)
                      fieldProps?.onOpenChange?.(isOpen)
                    }}
                    v-slots={slots}
                    open={open.value}
                  />
                ) : null
              }
              downIcon={dayValue || open.value ? false : undefined}
              allowClear={false}
              ref={lightLabel}
            />
          )
        } else {
          dom = (
            <DatePicker.TimePicker
              format={format}
              bordered={plain === undefined ? true : !plain}
              placeholder={
                restProps.placeholder ??
                intl.value.getMessage('tableForm.selectPlaceholder', '请选择')
              }
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

const FieldTimeRangePickerComponents = defineComponent({
  name: 'FieldTimeRangePicker',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...proFieldLightProps,
      text: anyType<(string | number)[]>(),
      format: stringType()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()
    const [open, setOpen] = useState<boolean>(false)
    return () => {
      const {
        text,
        light,
        label,
        mode,
        lightLabel,
        format,
        render,
        renderFormItem,
        plain,
        fieldProps
      } = props
      const restProps = useMergeProps(attrs, fieldProps)
      const finalFormat = fieldProps?.format || format || 'HH:mm:ss'
      const [startText, endText] = Array.isArray(text) ? text : []
      const startTextIsNumberOrMoment =
        dayjs.isDayjs(startText) || typeof startText === 'number'
      const endTextIsNumberOrMoment =
        dayjs.isDayjs(endText) || typeof endText === 'number'

      const parsedStartText: string = startText
        ? dayjs(
            startText,
            startTextIsNumberOrMoment ? undefined : finalFormat
          ).format(finalFormat)
        : ''
      const parsedEndText: string = endText
        ? dayjs(
            endText,
            endTextIsNumberOrMoment ? undefined : finalFormat
          ).format(finalFormat)
        : ''

      if (mode === 'read') {
        const dom = (
          <div>
            <div>{parsedStartText || '-'}</div>
            <div>{parsedEndText || '-'}</div>
          </div>
        )
        if (render) {
          return render(text, { mode, ...restProps }, <span>{dom}</span>)
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dayValue = parseValueToDay(
          fieldProps.value,
          finalFormat
        ) as dayjs.Dayjs[]
        let dom
        const {
          disabled,
          placeholder = [
            intl.value.getMessage('tableForm.selectPlaceholder', '请选择'),
            intl.value.getMessage('tableForm.selectPlaceholder', '请选择')
          ]
        } = fieldProps
        if (light) {
          dom = (
            <FieldLabel
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
              label={label}
              disabled={disabled}
              placeholder={placeholder}
              value={
                dayValue || open.value ? (
                  <TimeRangePicker
                    bordered={false}
                    format={format}
                    {...fieldProps}
                    placeholder={placeholder}
                    value={dayValue}
                    onOpenChange={(isOpen: any) => {
                      setOpen(isOpen)
                      fieldProps?.onOpenChange?.(isOpen)
                    }}
                    open={open.value}
                    v-slots={slots}
                  />
                ) : null
              }
              downIcon={dayValue || open.value ? false : undefined}
              allowClear={false}
              ref={lightLabel}
            />
          )
        } else {
          dom = (
            <TimeRangePicker
              format={format}
              bordered={plain === undefined ? true : !plain}
              placeholder={placeholder}
              {...restProps}
              value={dayValue as any}
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

export const FieldTimeRangePicker = FieldTimeRangePickerComponents

export default FieldTimePicker
