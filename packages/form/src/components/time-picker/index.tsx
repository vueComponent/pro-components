import { dateArrayFormatter } from '@ant-design-vue/pro-utils'

import { defineComponent } from 'vue'
import ProField from '../field'
import { proFormFieldItemProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'

const valueType = 'time' as const
/** 时间区间选择器 */
const TimeRangePicker = defineComponent({
  name: 'ProFormTimeRangePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props, { slots }) {
    const context = useFieldContextInject()
    return () => {
      const { fieldProps, proFieldProps, fieldConfig, ...rest } = props
      return (
        <ProField
          fieldProps={{
            getPopupContainer: context.value.getPopupContainer,
            ...fieldProps
          }}
          valueType="timeRange"
          proFieldProps={proFieldProps}
          fieldConfig={
            {
              valueType: 'timeRange',
              customLightMode: true,
              lightFilterLabelFormatter: (value: any) =>
                dateArrayFormatter(value, 'HH:mm:ss'),
              ...fieldConfig
            } as const
          }
          v-slots={slots}
          {...rest}
        />
      )
    }
  }
})

/**
 * 时间选择组件
 *
 * @param
 */
const ProFormTimePicker = defineComponent({
  name: 'ProFormTimePicker',
  inheritAttrs: false,
  props: {
    ...proFormFieldItemProps
  },
  setup(props, { slots }) {
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
          fieldConfig={
            {
              customLightMode: true,
              valueType,
              ...fieldConfig
            } as const
          }
          v-slots={slots}
          {...rest}
        />
      )
    }
  }
})
const WrappedProFormTimePicker: typeof ProFormTimePicker & {
  RangePicker: typeof TimeRangePicker
} = ProFormTimePicker as any

WrappedProFormTimePicker.RangePicker = TimeRangePicker

export const ProFormTimeRangePicker = TimeRangePicker
export default WrappedProFormTimePicker
