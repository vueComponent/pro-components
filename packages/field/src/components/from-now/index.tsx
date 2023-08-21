import { defineComponent } from 'vue'
import { anyType, stringType } from '@v-c/utils'
import { useIntl } from '@ant-design-vue/pro-provider'
import { parseValueToDay } from '@ant-design-vue/pro-utils'
import { DatePicker, Tooltip } from 'ant-design-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

dayjs.extend(relativeTime)

const FieldFromNow = defineComponent({
  name: 'FieldFromNow',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      text: anyType(),
      format: stringType()
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()
    return () => {
      const {
        text,
        mode,
        render,
        renderFormItem,
        format,
        fieldProps,
        ...rest
      } = props
      const restProps = useMergeProps(attrs, rest, fieldProps)
      if (mode === 'read') {
        const dom = (
          <Tooltip
            title={dayjs(text).format(
              fieldProps?.format || format || 'YYYY-MM-DD HH:mm:ss'
            )}
          >
            {dayjs(text).fromNow()}
          </Tooltip>
        )
        if (render) {
          return render(text, { mode, ...restProps }, <>{dom}</>)
        }
        return <>{dom}</>
      }
      if (mode === 'edit' || mode === 'update') {
        const placeholder = intl.value.getMessage(
          'tableForm.selectPlaceholder',
          '请选择'
        )
        const momentValue = parseValueToDay(
          fieldProps.value ?? props?.value
        ) as dayjs.Dayjs

        const dom = (
          <DatePicker
            placeholder={placeholder}
            showTime
            format={fieldProps?.format || format || 'YYYY-MM-DD HH:mm:ss'}
            {...restProps}
            value={momentValue}
            v-slots={slots}
          />
        )
        if (renderFormItem) {
          return renderFormItem(text, { mode, ...restProps }, dom, slots)
        }
        return dom
      }
      return null
    }
  }
})

export default FieldFromNow
