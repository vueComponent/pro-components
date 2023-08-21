import type { ExtractPropTypes } from 'vue'
import { defineComponent } from 'vue'
import {
  booleanType,
  numberType,
  someType,
  stringType,
  vNodeType
} from '@v-c/utils'
import { useIntl } from '@ant-design-vue/pro-provider'
import toNumber from 'lodash.tonumber'
import { InputNumber } from 'ant-design-vue'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'
import {
  getColorByRealValue,
  getRealTextWithPrecision,
  getSymbolByRealValue
} from './util'

export const percentPropInt = {
  prefix: vNodeType(),
  suffix: vNodeType(),
  text: someType<number | string>([Number, String]),
  precision: numberType(),
  showColor: booleanType(),
  showSymbol: someType<boolean | ((value: any) => boolean)>([
    Boolean,
    Function
  ]),
  placeholder: stringType()
}

export type PercentPropInt = Partial<ExtractPropTypes<typeof percentPropInt>>

const FieldPercent = defineComponent({
  name: 'FieldPercent',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...percentPropInt
    })
  },
  setup(props, { slots, attrs }) {
    const intl = useIntl()

    return () => {
      const {
        prefix = slots?.prefix?.(),
        precision,
        suffix = slots?.suffix?.() ?? '%',
        mode,
        showColor = false,
        render,
        renderFormItem,
        fieldProps,
        placeholder,
        showSymbol: propsShowSymbol
      } = props
      const text = props.text || props?.value
      const realValue =
        typeof text === 'string' && (text as string).includes('%')
          ? toNumber((text as string).replace('%', ''))
          : toNumber(text)
      const placeholderValue =
        placeholder ||
        intl.value.getMessage('tableForm.inputPlaceholder', '请输入')

      const showSymbol =
        typeof propsShowSymbol === 'function'
          ? propsShowSymbol?.(text)
          : propsShowSymbol

      if (mode === 'read') {
        /** 颜色有待确定, 根据提供 colors: ['正', '负'] | boolean */
        const style = showColor ? { color: getColorByRealValue(realValue) } : {}

        const dom = (
          <span style={style}>
            {prefix && <span>{prefix}</span>}
            {showSymbol && <>{getSymbolByRealValue(realValue)} </>}
            {getRealTextWithPrecision(Math.abs(realValue), precision)}
            {suffix && suffix}
          </span>
        )
        if (render) {
          return render(
            text,
            {
              mode,
              ...useMergeProps(attrs, fieldProps),
              prefix,
              precision,
              showSymbol,
              suffix
            },
            dom
          )
        }
        return dom
      }
      if (mode === 'edit' || mode === 'update') {
        const dom = (
          <InputNumber
            formatter={(value: any) => {
              if (value && prefix) {
                return `${prefix} ${value}`.replace(
                  /\B(?=(\d{3})+(?!\d)$)/g,
                  ','
                )
              }
              return value
            }}
            parser={(value) => (value ? value.replace(/.*\s|,/g, '') : '')}
            placeholder={placeholderValue}
            v-slots={slots}
            prefix={prefix}
            {...useMergeProps(attrs, fieldProps)}
          />
        )
        if (renderFormItem) {
          return renderFormItem(
            text,
            { mode, ...useMergeProps(attrs, fieldProps) },
            dom,
            slots
          )
        }
        return dom
      }
      return null
    }
  }
})

export default FieldPercent
