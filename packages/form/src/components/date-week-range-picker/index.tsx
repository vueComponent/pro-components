import { defineComponent } from 'vue'
import { dateArrayFormatter } from '@ant-design-vue/pro-utils'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateWeekRange' as const

/**
 * 时间日期选择组件
 *
 * @param
 */
const DateWeekRangePicker = defineComponent({
  name: 'ProFormDateWeekRangePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props) {
    const context = useFieldContextInject()
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props

      return (
        <ProField
          fieldProps={{
            getPopupContainer: context.value.getPopupContainer,
            ...fieldProps
          }}
          valueType={valueType}
          proFieldProps={proFieldProps}
          fieldConfig={{
            valueType,
            customLightMode: true,
            lightFilterLabelFormatter: (value: any) =>
              dateArrayFormatter(
                value,
                (fieldProps as any)?.format || 'YYYY-MM-DD'
              ),
            ...fieldConfig
          }}
          {...rest}
        />
      )
    }
  }
})

export default DateWeekRangePicker
