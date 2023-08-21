import { defineComponent } from 'vue'
import { dateArrayFormatter } from '@ant-design-vue/pro-utils'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'
import ProField from '../field'

const valueType = 'dateMonthRange' as const
/**
 * 月份区间选择组件
 *
 * @param
 */
const DateMonthRangePicker = defineComponent({
  name: 'DateMonthRangePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props) {
    const context = useFieldContextInject()
    return () => {
      const { fieldProps, proFieldProps, ...rest } = props

      return (
        <ProField
          fieldProps={{
            getPopupContainer: context.value.getPopupContainer,
            ...fieldProps
          }}
          valueType={valueType}
          proFieldProps={proFieldProps}
          {...{
            fieldConfig: {
              valueType,
              customLightMode: true,
              lightFilterLabelFormatter: (value: any) =>
                dateArrayFormatter(
                  value,
                  (fieldProps as any)?.format || 'YYYY-MM'
                )
            }
          }}
          {...rest}
        />
      )
    }
  }
})

export default DateMonthRangePicker
