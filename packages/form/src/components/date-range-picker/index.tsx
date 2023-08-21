import { defineComponent } from 'vue'
import { dateArrayFormatter } from '@ant-design-vue/pro-utils'
import { proFormFieldItemProps } from '../../typing'
import ProField from '../field'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateRange' as const

/**
 * 日期区间选择组件
 *
 * @param
 */
const ProFormDateRangePicker = defineComponent({
  name: 'ProFormDateRangePicker',
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
export default ProFormDateRangePicker
