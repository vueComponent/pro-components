import { defineComponent } from 'vue'
import { dateArrayFormatter } from '@ant-design-vue/pro-utils'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'dateTimeRange' as const

/**
 * 时间日期选择组件
 *
 * @param
 */
const ProFormDateTimeRangePicker = defineComponent({
  name: 'ProFormDateTimeRangePicker',
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
          filfieldConfigdConfig={{
            valueType,
            customLightMode: true,
            lightFilterLabelFormatter: (value: any) =>
              dateArrayFormatter(value, 'YYYY-MM-DD HH:mm:ss'),
            ...fieldConfig
          }}
          {...rest}
        />
      )
    }
  }
})
export default ProFormDateTimeRangePicker
