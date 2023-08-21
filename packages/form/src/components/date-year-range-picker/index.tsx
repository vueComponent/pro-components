import { defineComponent } from 'vue'
import { dateArrayFormatter } from '@ant-design-vue/pro-utils'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateYearRange' as const

/**
 * 季度份区间选择组件
 *
 * @param
 */
const DateYearRangePicker = defineComponent({
  name: 'ProFormDateYearRangePicker',
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
              dateArrayFormatter(value, (fieldProps as any)?.format || 'YYYY'),
            ...fieldConfig
          }}
          {...rest}
        />
      )
    }
  }
})

export default DateYearRangePicker
