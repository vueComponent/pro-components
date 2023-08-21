import type { InputNumberProps } from 'ant-design-vue'
import { InputNumber, Popover } from 'ant-design-vue'
import { intlMap as allIntlMap, useIntl } from '@ant-design-vue/pro-provider'
import { inputNumberProps } from 'ant-design-vue/es/input-number'

import type { VNodeChild } from 'vue'
import { computed, defineComponent } from 'vue'
import {
  anyType,
  booleanType,
  numberType,
  omit,
  someType,
  stringType,
  vNodeType
} from '@v-c/utils'
import { openVisibleCompatible, useMergedState } from '@ant-design-vue/pro-utils'
import { proFieldFC } from '../../typing'
import { useMergeProps } from '../../_utils'

export interface FieldMoneyProps {
  text: number
  moneySymbol?: boolean
  locale?: string
  /**
   * 输入框内容为空的提示内容
   */
  placeholder?: string
  /**
   * 自定义 money 的 Symbol
   */
  customSymbol?: string
  /**
   * 自定义 Popover 的值，false 可以关闭他
   */
  numberPopoverRender?:
    | ((props: InputNumberProps, defaultText: string) => VNodeChild)
    | boolean
  /**
   * NumberFormat 的配置，文档可以查看 mdn
   *
   * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  numberFormatOptions?: {
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    localeMatcher?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    style?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currency?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currencyDisplay?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    currencySign?: string
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    useGrouping?: boolean
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumIntegerDigits?: number
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumFractionDigits?: number
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    maximumFractionDigits?: number
    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    minimumSignificantDigits?: number

    /**
     * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    maximumSignificantDigits?: number
  }
}

export const fieldMoneyProps = {
  text: someType([String, Number]),
  moneySymbol: booleanType(),
  locale: stringType(),
  placeholder: stringType(),
  customSymbol: stringType(),
  numberPopoverRender: someType<FieldMoneyProps['numberPopoverRender']>([
    Boolean,
    Function
  ]),
  numberFormatOptions: anyType<FieldMoneyProps['numberFormatOptions']>()
}

const defaultMoneyIntl = new Intl.NumberFormat('zh-Hans-CN', {
  currency: 'CNY',
  style: 'currency'
})

const enMoneyIntl = {
  style: 'currency',
  currency: 'USD'
}

const ruMoneyIntl = {
  style: 'currency',
  currency: 'RUB'
}

const rsMoneyIntl = {
  style: 'currency',
  currency: 'RSD'
}

const msMoneyIntl = {
  style: 'currency',
  currency: 'MYR'
}

const ptMoneyIntl = {
  style: 'currency',
  currency: 'BRL'
}

const intlMap = {
  default: defaultMoneyIntl,
  'zh-Hans-CN': {
    currency: 'CNY',
    style: 'currency'
  },
  'en-US': enMoneyIntl,
  'ru-RU': ruMoneyIntl,
  'ms-MY': msMoneyIntl,
  'sr-RS': rsMoneyIntl,
  'pt-BR': ptMoneyIntl
}

/**
 * A function that formats the number.
 * @param {string | false} moneySymbol - The currency symbol, which is the first parameter of the
 * formatMoney function.
 * @param {number | string | undefined} paramsText - The text to be formatted
 * @param {number} precision - number, // decimal places
 * @param {any} [config] - the configuration of the number format, which is the same as the
 * configuration of the number format in the Intl.NumberFormat method.
 * @returns A function that takes in 4 parameters and returns a string.
 */
const getTextByLocale = (
  moneySymbol: string | false,
  paramsText: number | string | undefined,
  precision: number,
  config?: any
) => {
  let moneyText: number | string | undefined = (paramsText as any)
    ?.toString()
    .replaceAll(',', '')
  if (typeof moneyText === 'string') {
    const parsedNum = Number(moneyText)
    // 转换数字为NaN时，返回原始值展示
    if (Number.isNaN(parsedNum)) return moneyText
    moneyText = parsedNum
  }

  if (!moneyText && moneyText !== 0) return ''

  try {
    // Formatting the number, when readonly moneySymbol = false, unused currency.
    const finalMoneyText = new Intl.NumberFormat(moneySymbol || 'zh-Hans-CN', {
      ...((intlMap as any)[moneySymbol || 'zh-Hans-CN'] ||
        intlMap['zh-Hans-CN']),
      maximumFractionDigits: precision,
      ...config
    })
      // fix: #6003 解决未指定货币符号时，金额文本格式化异常问题
      .format(moneyText)

    // 是否有金额符号，例如 ￥ $
    const hasMoneySymbol = moneySymbol === false

    /**
     * 首字母判断是否是正负符号
     */
    const [operatorSymbol] = finalMoneyText || ''

    // 兼容正负号
    if (['+', '-'].includes(operatorSymbol)) {
      // 裁剪字符串,有符号截取两位，没有符号截取一位
      return `${operatorSymbol}${finalMoneyText.substring(
        hasMoneySymbol ? 2 : 1
      )}`
    }

    // 没有正负符号截取一位
    return finalMoneyText.substring(hasMoneySymbol ? 1 : 0)
  } catch (error) {
    return moneyText
  }
}

// 默认的代码类型
const DefaultPrecisionCont = 2

/**
 * input 的弹框，用于显示格式化之后的内容
 *
 * @result 10,000 -> 一万
 * @result 10, 00, 000, 000 -> 一亿
 */

const inputNumberPopoverProps = {
  ...inputNumberProps(),
  open: booleanType(),
  contentRender: vNodeType<(props: InputNumberProps) => VNodeChild>(),
  numberFormatOptions: anyType(),
  numberPopoverRender: anyType()
}

const InputNumberPopover = defineComponent({
  name: 'InputNumberPopover',
  inheritAttrs: false,
  props: {
    ...inputNumberPopoverProps
  },
  setup(props, { slots }) {
    const [value, onChange] = useMergedState<any>(() => props.defaultValue, {
      value: computed(() => props.value),
      onChange: props.onChange
    })
    return () => {
      const {
        contentRender: content,
        // numberFormatOptions,
        // numberPopoverRender,
        open,
        ...rest
      } = props
      /**
       * 如果content 存在要根据 content 渲染一下
       */
      const dom = content?.({
        ...rest,
        value: value.value
      })

      const propsData = openVisibleCompatible(dom ? open : false)

      return (
        <Popover
          placement="topLeft"
          {...propsData}
          trigger={['focus', 'click']}
          content={dom}
          getPopupContainer={(triggerNode) => {
            return triggerNode?.parentElement || document.body
          }}
        >
          <InputNumber
            {...omit(rest, ['onChange'])}
            value={value.value}
            onChange={onChange}
            v-slots={slots}
          />
        </Popover>
      )
    }
  }
})

/**
 * 金额组件
 *
 * @param FieldMoneyProps {
 *     text: number;
 *     moneySymbol?: string; }
 */
const FieldMoney = defineComponent({
  name: 'FieldMoney',
  inheritAttrs: false,
  props: {
    ...proFieldFC({
      ...fieldMoneyProps
    })
  },
  setup(props, { slots, attrs }) {
    const intl = computed(() => {
      // 当手动传入locale时，应该以传入的locale为准，未传入时则根据全局的locale进行国际化
      const locale = props.locale
      if (locale && (allIntlMap as any)[locale]) {
        return (allIntlMap as any)[locale]
      }
      return useIntl().value
    })

    return () => {
      const {
        mode: type,
        render,
        renderFormItem,
        fieldProps,
        placeholder,
        locale = fieldProps.customSymbol ?? 'zh-Hans-CN',
        customSymbol = fieldProps.customSymbol,
        numberFormatOptions = fieldProps?.numberFormatOptions,
        numberPopoverRender = fieldProps?.numberPopoverRender || false,
        ...rest
      } = props
      const text = props?.text ?? props?.value
      const precision = fieldProps?.precision ?? DefaultPrecisionCont
      const placeholderValue =
        placeholder ||
        intl.value?.getMessage('tableForm.inputPlaceholder', '请输入')

      /**
       * 获取货币的符号
       * 如果 customSymbol 存在直接使用 customSymbol
       * 如果 moneySymbol 为 false，返回空
       * 如果没有配置使用默认的
       */
      const moneySymbolFunc = (): string | undefined => {
        if (customSymbol) {
          return customSymbol
        }

        if (rest.moneySymbol === false || fieldProps.moneySymbol === false) {
          return undefined
        }
        return intl.value.getMessage('moneySymbol', '￥')
      }
      const moneySymbol = moneySymbolFunc()

      /*
       * A function that formats the number.
       * 1000 -> 1,000
       */
      const getFormateValue = (value?: string | number) => {
        // 新建数字正则，需要配置小数点
        const reg = new RegExp(
          `\\B(?=(\\d{${
            3 + Math.max(precision - DefaultPrecisionCont, 0)
          }})+(?!\\d))`,
          'g'
        )
        // 切分为 整数 和 小数 不同
        const [intStr, floatStr] = String(value).split('.')

        // 最终的数据string，需要去掉 , 号。
        const resultInt = intStr.replace(reg, ',')

        // 计算最终的小数点
        let resultFloat = ''

        /* Taking the floatStr and slicing it to the precision. */
        if (floatStr && precision > 0) {
          resultFloat = `.${floatStr.slice(
            0,
            precision === undefined ? DefaultPrecisionCont : precision
          )}`
        }

        return `${resultInt}${resultFloat}`
      }
      // 如果是阅读模式，直接返回字符串
      if (type === 'read') {
        const dom = (
          <span>
            {getTextByLocale(
              moneySymbol ? locale : false,
              text,
              precision,
              numberFormatOptions ?? fieldProps.numberFormatOptions
            )}
          </span>
        )
        if (render) {
          return render(text, { mode: type, ...fieldProps }, dom)
        }
        return dom
      }

      if (type === 'edit' || type === 'update') {
        const dom = (
          <InputNumberPopover
            v-slots={slots}
            contentRender={(props) => {
              if (numberPopoverRender === false) return null
              if (!props.value) return null
              const localeText = getTextByLocale(
                moneySymbol ? locale : false,
                `${getFormateValue(props.value)}`,
                precision,
                {
                  ...numberFormatOptions,
                  notation: 'compact'
                }
              )

              if (typeof numberPopoverRender === 'function') {
                return numberPopoverRender?.(props, localeText)
              }
              return localeText
            }}
            precision={precision}
            // 删除默认min={0}，允许输入一个负数的金额，用户可自行配置min来限制是否允许小于0的金额
            formatter={(value) => {
              if (value && moneySymbol) {
                return `${moneySymbol} ${getFormateValue(value)}`
              }
              return value?.toString()
            }}
            parser={(value) => {
              if (moneySymbol && value) {
                return value.replace(
                  new RegExp(`\\${moneySymbol}\\s?|(,*)`, 'g'),
                  ''
                )
              }
              return value!
            }}
            placeholder={placeholderValue}
            {...omit(useMergeProps(attrs, rest, fieldProps), [
              'numberFormatOptions',
              'precision',
              'numberPopoverRender',
              'customSymbol',
              'moneySymbol',
              'visible',
              'open'
            ])}
          />
        )

        if (renderFormItem) {
          return renderFormItem(
            text,
            { mode: type, ...useMergeProps(attrs, rest, fieldProps) },
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

export default FieldMoney
