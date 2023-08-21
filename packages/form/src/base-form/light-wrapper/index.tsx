import {
  anyType,
  booleanType,
  classNames,
  eventType,
  filterEmpty,
  functionType,
  someType,
  stringType,
  useState,
  vNodeType
} from '@v-c/utils'
import type { VNode, VNodeChild } from 'vue'
import { cloneVNode, defineComponent } from 'vue'
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import {
  FieldLabel,
  FilterDropdown,
  dateArrayFormatter,
  dateFormatterMap,
  useMountMergeState
} from '@ant-design-vue/pro-utils'
import type { LightFilterFooterRender } from '../../typing'
import { useStyle } from './style'

export type SizeType = 'small' | 'middle' | 'large' | undefined

export const lightWrapperProps = {
  label: vNodeType(),
  disabled: booleanType(),
  placeholder: vNodeType(),
  size: someType<SizeType>([String]),
  value: anyType(),
  'onUpdate:value': eventType<(value: any) => void>(),
  onChange: eventType<(value?: any) => void>(),
  onBlur: eventType<(value?: any) => void>(),
  valuePropName: stringType(),
  customLightMode: booleanType(),
  light: booleanType(),
  /**
   * @name 自定义label的值
   *
   * @example <caption>自定义数组的转化</caption>
   * labelFormatter={(value) =>value.join('-')} }
   */
  labelFormatter: functionType<(value: any) => VNodeChild>(),
  bordered: booleanType(),
  otherFieldProps: anyType(),
  valueType: stringType(),
  allowClear: booleanType(),
  footerRender: functionType<LightFilterFooterRender>(),
  placement: stringType<TooltipPlacement>()
}

const LightWrapper = defineComponent({
  name: 'LightWrapper',
  inheritAttrs: false,
  props: {
    ...lightWrapperProps
  },
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('pro-field-light-wrapper', props)
    const { wrapSSR, hashId } = useStyle(prefixCls.value)
    const [tempValue, setTempValue] = useState<string | undefined>(
      (props as any)?.[props.valuePropName!]
    )
    const [open, setOpen] = useMountMergeState<boolean>(false)

    const onChange = (...restParams: any[]) => {
      props?.otherFieldProps?.onChange?.(...restParams)
      props.onChange?.(...restParams)
    }
    return () => {
      const {
        label,
        size,
        disabled,
        valuePropName = 'value',
        placeholder,
        labelFormatter,
        bordered,
        footerRender,
        allowClear,
        valueType,
        placement,
        ...rest
      } = props
      const node = slots.default?.()
      const nodes = filterEmpty(node)
      if (!nodes.length) return null

      const labelValue = (props as any)[valuePropName!]
      const children = nodes[0]
      /** DataRange的转化，dayjs 的 toString 有点不好用 */
      let labelText = labelValue

      if (
        valueType?.toLowerCase()?.endsWith('range') &&
        valueType !== 'digitRange' &&
        !labelFormatter
      ) {
        labelText = dateArrayFormatter(
          labelValue,
          (dateFormatterMap as any)[valueType] || 'YYYY-MM-DD'
        )
      }
      return wrapSSR(
        <FilterDropdown
          disabled={disabled}
          open={open.value}
          onOpenChange={setOpen}
          placement={placement}
          label={
            <FieldLabel
              ellipsis
              size={size}
              onClear={() => {
                onChange?.()
                setTempValue('')
              }}
              bordered={bordered}
              style={attrs.style}
              class={attrs.class}
              label={label}
              placeholder={placeholder}
              value={labelText}
              disabled={disabled}
              formatter={labelFormatter}
              allowClear={allowClear}
            />
          }
          footer={{
            onClear: () => setTempValue(''),
            onConfirm: () => {
              onChange?.(tempValue.value)
              setOpen(false)
            }
          }}
          footerRender={footerRender}
        >
          <div
            class={classNames(`${prefixCls}-container`, hashId, attrs.class)}
            style={(attrs as any).style}
          >
            {cloneVNode(children as VNode, {
              ...rest,
              [valuePropName!]: tempValue.value,
              //   onChange: (e: any) => {
              //     setTempValue(e?.target ? e.target.value : e)
              //   },
              [`onUpdate:${valuePropName!}`]: (v: any) => {
                setTempValue(v)
              }
            })}
          </div>
        </FilterDropdown>
      )
    }
  }
})

export { LightWrapper }
