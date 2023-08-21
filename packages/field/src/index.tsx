import { noteOnce } from '@v-c/utils'
import type { ExtractPropTypes, Slots, VNodeChild } from 'vue'
import { cloneVNode, defineComponent, isVNode } from 'vue'
import type {
  ProFieldFCRenderProps,
  ProRenderFieldPropsType
} from '@ant-design-vue/pro-provider'
import { useProProviderContext } from '@ant-design-vue/pro-provider'
import type {
  ProFieldTextType,
  ProFieldValueObjectType,
  ProFieldValueType
} from '@ant-design-vue/pro-utils'
import { omitUndefined, pickProProps } from '@ant-design-vue/pro-utils'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayjs from 'dayjs'
import { Avatar } from 'ant-design-vue'
import { proFieldPropsType } from './typing'
import type { RenderProps, proFieldLightProps } from './typing'
import FieldText from './components/text'
import FieldTextArea from './components/text-area'
import FieldSwitch from './components/switch'
import FieldSlider from './components/slider'
import FieldSelect, {
  proFieldParsingText,
  proFieldParsingValueEnumToArray
} from './components/select'
import FieldHOC from './field-hoc'
import FieldSegmented from './components/segmented'
import FieldSecond from './components/second'
import FieldRate from './components/rate'
import FieldRangePicker from './components/range-picker'
import FieldRadio from './components/radio'
import FieldProgress from './components/progress'
import FieldPercent from './components/percent'
import FieldPassword from './components/password'
import type { FieldMoneyProps } from './components/money'
import FieldMoney from './components/money'
import FieldIndexColumn from './components/index-column'
import FieldImage from './components/image'
import FieldFromNow from './components/from-now'
import FieldDigit from './components/digit'
import FieldDigitRange from './components/digit-range'
import FieldDatePicker from './components/date-picker'
import FieldCode from './components/code'
import FieldCheckbox from './components/checkbox'
import FieldCascader from './components/cascader'
import FieldOptions from './components/options'
import FieldTimePicker, { FieldTimeRangePicker } from './components/time-picker'
import FieldTreeSelect from './components/tree-select'
import FieldStatus from './components/status'

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)

const REQUEST_VALUE_TYPE = ['select', 'radio', 'radioButton', 'checkbook']

export type ProFieldLightProps = Partial<
  ExtractPropTypes<typeof proFieldLightProps>
>

/**
 * Render valueType object
 *
 * @param text String | number
 * @param valueType ProColumnsValueObjectType
 * @param props
 */
const defaultRenderTextByObject = (
  text: ProFieldTextType,
  valueType: ProFieldValueObjectType,
  props: RenderProps
) => {
  const pickFormItemProps = pickProProps(props.fieldProps)
  if (valueType.type === 'progress') {
    return (
      <FieldProgress
        {...props}
        text={text as number}
        fieldProps={{
          status: valueType.status ? valueType.status : undefined,
          ...pickFormItemProps
        }}
      />
    )
  }
  if (valueType.type === 'money') {
    return (
      <FieldMoney
        locale={valueType.locale}
        {...props}
        fieldProps={pickFormItemProps}
        text={text as number}
        moneySymbol={valueType.moneySymbol}
      />
    )
  }
  if (valueType.type === 'percent') {
    return (
      <FieldPercent
        {...props}
        text={text as number}
        showSymbol={valueType.showSymbol}
        precision={valueType.precision}
        fieldProps={pickFormItemProps}
        showColor={valueType.showColor}
      />
    )
  }

  if (valueType.type === 'image') {
    return (
      <FieldImage {...props} text={text as string} width={valueType.width} />
    )
  }

  return text as VNodeChild
}

/**
 * 根据不同的类型来转化数值
 *
 * @param dataValue
 * @param valueType
 * @param props
 * @param valueTypeMap
 * @param slots
 */
export const defaultRenderText = (
  dataValue: ProFieldTextType,
  valueType: ProFieldValueType | ProFieldValueObjectType,
  props: RenderProps,
  valueTypeMap: Record<string, ProRenderFieldPropsType>,
  slots: Slots
) => {
  const { mode = 'read', emptyText = '-' } = props
  if (
    emptyText !== false &&
    mode === 'read' &&
    valueType !== 'option' &&
    valueType !== 'switch'
  ) {
    if (
      typeof dataValue !== 'boolean' &&
      typeof dataValue !== 'number' &&
      !dataValue
    ) {
      const { fieldProps, render } = props
      if (render) {
        return render(dataValue, { mode, ...fieldProps }, <>{emptyText}</>)
      }
      return <>{emptyText}</>
    }
  }
  // eslint-disable-next-line no-param-reassign
  delete props.emptyText

  if (typeof valueType === 'object') {
    return defaultRenderTextByObject(dataValue, valueType, props)
  }

  const customValueTypeConfig =
    valueTypeMap && valueTypeMap[valueType as string]

  if (customValueTypeConfig) {
    if (mode === 'read') {
      return customValueTypeConfig.render?.(
        dataValue,
        {
          text: dataValue as VNodeChild,
          ...props,
          mode: mode || 'read'
        },
        <>{dataValue}</>
      )
    }
    if (mode === 'update' || mode === 'edit') {
      return customValueTypeConfig.renderFormItem?.(
        dataValue,
        {
          text: dataValue as VNodeChild,
          ...(props as any)
        },
        <>{dataValue}</>
      )
    }
  }

  const needValueEnum = REQUEST_VALUE_TYPE.includes(valueType as string)
  const hasValueEnum = !!(
    props.valueEnum ||
    props.request ||
    props.options ||
    props.fieldProps?.options
  )

  noteOnce(
    !needValueEnum || hasValueEnum,
    `如果设置了 valueType 为 ${REQUEST_VALUE_TYPE.join(
      ','
    )}中任意一个，则需要配置options，request, valueEnum 其中之一，否则无法生成选项。`
  )

  noteOnce(
    !needValueEnum || hasValueEnum,
    `If you set valueType to any of ${REQUEST_VALUE_TYPE.join(
      ','
    )}, you need to configure options, request or valueEnum.`
  )

  /** 如果是金额的值 */
  if (valueType === 'money') {
    return <FieldMoney {...props} text={dataValue as number} v-slots={slots} />
  }

  if (valueType === 'segmented') {
    return (
      <FieldSegmented text={dataValue as string} {...props} v-slots={slots} />
    )
  }

  if (valueType === 'index') {
    return <FieldIndexColumn>{(dataValue as number) + 1}</FieldIndexColumn>
  }

  if (valueType === 'indexBorder') {
    return (
      <FieldIndexColumn border>{(dataValue as number) + 1}</FieldIndexColumn>
    )
  }

  if (valueType === 'image') {
    return <FieldImage text={dataValue as string} {...props} v-slots={slots} />
  }

  if (valueType === 'fromNow') {
    return (
      <FieldFromNow text={dataValue as string} {...props} v-slots={slots} />
    )
  }

  if (valueType === 'digit') {
    return <FieldDigit text={dataValue as number} {...props} v-slots={slots} />
  }

  if (valueType === 'code') {
    return <FieldCode text={dataValue as string} {...props} v-slots={slots} />
  }

  if (valueType === 'digitRange') {
    return (
      <FieldDigitRange
        text={dataValue as number[]}
        {...props}
        v-slots={slots}
      />
    )
  }
  /** 如果是日期的值 */
  if (valueType === 'date') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY-MM-DD"
          {...props}
        />
      </FieldHOC>
    )
  }

  /** 如果是周的值 */
  if (valueType === 'dateWeek') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY-wo"
          picker="week"
          {...props}
        />
      </FieldHOC>
    )
  }

  /** 如果是日期范围的值 */
  if (valueType === 'dateRange') {
    return (
      <FieldRangePicker
        text={dataValue as string[]}
        format="YYYY-MM-DD"
        {...props}
        v-slots={slots}
      />
    )
  }

  /** 如果是周范围的值 */
  if (valueType === 'dateWeekRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-W"
          showTime
          fieldProps={{
            picker: 'week',
            ...fieldProps
          }}
          {...otherProps}
        />
      </FieldHOC>
    )
  }

  /** 如果是年范围的值 */
  if (valueType === 'dateYearRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY"
          showTime
          fieldProps={{
            picker: 'year',
            ...fieldProps
          }}
          {...otherProps}
        />
      </FieldHOC>
    )
  }

  /** 如果是季范围的值 */
  if (valueType === 'dateQuarterRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-Q"
          showTime
          fieldProps={{
            picker: 'quarter',
            ...fieldProps
          }}
          {...otherProps}
        />
      </FieldHOC>
    )
  }

  /** 如果是月范围的值 */
  if (valueType === 'dateMonthRange') {
    const { fieldProps, ...otherProps } = props
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-MM"
          showTime
          fieldProps={{
            picker: 'month',
            ...fieldProps
          }}
          {...otherProps}
        />
      </FieldHOC>
    )
  }

  /** 如果是月的值 */
  if (valueType === 'dateMonth') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY-MM"
          picker="month"
          {...props}
        />
      </FieldHOC>
    )
  }

  /** 如果是季度的值 */
  if (valueType === 'dateQuarter') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY-[Q]Q"
          picker="quarter"
          {...props}
        />
      </FieldHOC>
    )
  }

  /** 如果是年的值 */
  if (valueType === 'dateYear') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY"
          picker="year"
          {...props}
        />
      </FieldHOC>
    )
  }

  /** 如果是日期加时间类型的值 */
  if (valueType === 'dateTime') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldDatePicker
          text={dataValue as string}
          format="YYYY-MM-DD HH:mm:ss"
          showTime
          {...props}
          v-slots={slots}
        />
      </FieldHOC>
    )
  }

  /** 如果是日期加时间类型的值的值 */
  if (valueType === 'dateTimeRange') {
    // 值不存在的时候显示 "-"
    return (
      <FieldHOC isLight={props.light}>
        <FieldRangePicker
          text={dataValue as string[]}
          format="YYYY-MM-DD HH:mm:ss"
          showTime
          {...props}
          v-slots={slots}
        />
      </FieldHOC>
    )
  }

  /** 如果是时间类型的值 */
  if (valueType === 'time') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldTimePicker
          text={dataValue as string}
          format="HH:mm:ss"
          {...props}
        />
      </FieldHOC>
    )
  }

  /** 如果是时间类型的值 */
  if (valueType === 'timeRange') {
    return (
      <FieldHOC isLight={props.light}>
        <FieldTimeRangePicker
          text={dataValue as string[]}
          format="HH:mm:ss"
          {...props}
        />
      </FieldHOC>
    )
  }

  if (valueType === 'progress') {
    return (
      <FieldProgress {...props} text={dataValue as number} v-slots={slots} />
    )
  }

  if (
    valueType === 'avatar' &&
    typeof dataValue === 'string' &&
    props.mode === 'read'
  ) {
    return <Avatar src={dataValue as string} size={22} shape="circle" />
  }

  /** 百分比, 默认展示符号, 不展示小数位 */
  if (valueType === 'percent') {
    return (
      <FieldPercent text={dataValue as number} {...props} v-slots={slots} />
    )
  }

  if (
    valueType === 'select' ||
    (valueType === 'text' && (props.valueEnum || props.request))
  ) {
    return (
      <FieldHOC isLight={props.light}>
        <FieldSelect text={dataValue as string} {...props} v-slots={slots} />
      </FieldHOC>
    )
  }

  if (valueType === 'treeSelect') {
    return <FieldTreeSelect text={dataValue as string} {...props} />
  }

  if (valueType === 'option') {
    return (
      <FieldOptions text={dataValue as VNodeChild} {...props} v-slots={slots} />
    )
  }

  if (valueType === 'checkbox') {
    return <FieldCheckbox text={dataValue} {...props} v-slots={slots} />
  }

  if (valueType === 'cascader') {
    return (
      <FieldCascader text={dataValue as string} {...props} v-slots={slots} />
    )
  }
  if (valueType === 'radio') {
    return <FieldRadio text={dataValue as string} {...props} v-slots={slots} />
  }

  if (valueType === 'radioButton') {
    return (
      <FieldRadio
        radioType="button"
        text={dataValue as string}
        {...props}
        v-slots={slots}
      />
    )
  }

  if (valueType === 'second') {
    return <FieldSecond text={dataValue as number} {...props} v-slots={slots} />
  }

  if (valueType === 'rate') {
    return <FieldRate text={dataValue as string} {...props} v-slots={slots} />
  }

  if (valueType === 'password') {
    return (
      <FieldPassword text={dataValue as string} {...props} v-slots={slots} />
    )
  }

  if (valueType === 'switch') {
    return (
      <FieldSwitch text={!!dataValue as boolean} {...props} v-slots={slots} />
    )
  }

  if (valueType === 'slider') {
    return <FieldSlider text={dataValue as string} {...props} v-slots={slots} />
  }

  if (valueType === 'textarea') {
    return (
      <FieldTextArea text={dataValue as string} {...props} v-slots={slots} />
    )
  }

  return <FieldText text={dataValue as string} {...props} v-slots={slots} />
}

const ProField = defineComponent({
  name: 'ProField',
  inheritAttrs: false,
  props: {
    ...proFieldPropsType
  },
  setup(props, { slots, attrs }) {
    const context = useProProviderContext()
    return () => {
      const {
        text,
        valueType = 'text',
        mode = 'read',
        onChange,
        value,
        renderFormItem,
        readonly,
        ...restProps
      } = props
      const rest: Record<string, any> = { ...restProps, ...attrs }
      const fieldProps = (value !== undefined ||
        onChange ||
        rest?.fieldProps) && {
        value,
        // fieldProps 优先级更高，在类似 LightFilter 场景下需要覆盖默认的 value 和 onChange
        ...omitUndefined(rest?.fieldProps),
        onChange: (...restParams: any[]) => {
          rest?.fieldProps?.onChange?.(...restParams)
          onChange?.(...restParams)
        },
        'onUpdate:value': (...restParams: any[]) => {
          rest?.fieldProps?.['onUpdate:value']?.(...restParams)
          props['onUpdate:value']?.(...restParams)
        }
      }

      const renderFormItem1 = () => {
        if (renderFormItem)
          return (
            curText: any,
            props: ProFieldFCRenderProps,
            dom: VNodeChild,
            slots?: Slots
          ) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { placeholder: _placeholder, ...restProps } = props
            const newDom = renderFormItem?.(curText, restProps, dom, slots)
            if (isVNode(newDom)) {
              return cloneVNode(newDom, {
                ...fieldProps,
                ...((newDom.props as any) || {})
              })
            }
            return newDom
          }
        return undefined
      }
      return (
        <>
          {defaultRenderText(
            mode === 'edit'
              ? fieldProps?.value ?? text ?? ''
              : text ?? fieldProps?.value ?? '',
            valueType || 'text',
            omitUndefined({
              ...attrs,
              ...rest,
              mode: readonly ? 'read' : mode,
              renderFormItem: renderFormItem1(),
              placeholder: renderFormItem
                ? undefined
                : rest?.placeholder ?? fieldProps?.placeholder,
              fieldProps: pickProProps(
                omitUndefined({
                  ...fieldProps,
                  placeholder: renderFormItem
                    ? undefined
                    : rest?.placeholder ?? fieldProps?.placeholder
                })
              )
            }),
            context.valueTypeMap.value || {},
            slots
          )}
        </>
      )
    }
  }
})

export type { ProFieldValueType, FieldMoneyProps }
export {
  proFieldPropsType,
  FieldPercent,
  FieldIndexColumn,
  FieldProgress,
  FieldMoney,
  FieldDatePicker,
  FieldRangePicker,
  FieldCode,
  FieldTimePicker,
  FieldText,
  FieldStatus,
  FieldSelect,
  proFieldParsingText,
  proFieldParsingValueEnumToArray
}

export default ProField
