import type { VNodeChild } from 'vue'
import { defineComponent, shallowRef } from 'vue'
import { CloseCircleFilled, DownOutlined } from '@ant-design/icons-vue'
import {
  anyType,
  booleanType,
  classNames,
  eventType,
  functionType,
  runEvent,
  someType,
  vNodeType
} from '@v-c/utils'
import { useConfigInject, useIntl } from '@ant-design-vue/pro-provider'
import type { SizeType } from 'ant-design-vue/es/config-provider/SizeContext'
import { useStyle } from './style'

export const fieldLabelProps = {
  label: vNodeType(),
  value: anyType(),
  disabled: booleanType(),
  onClear: eventType(),
  size: someType<SizeType>([String]),
  ellipsis: booleanType(),
  placeholder: vNodeType(),
  formatter: functionType<(value: any) => VNodeChild>(),
  bordered: booleanType(),
  allowClear: booleanType(),
  downIcon: someType<false | VNodeChild>([Object, Boolean]),
  onClick: eventType(),
  /**
   * 点击标签的事件，用来唤醒 down menu 状态
   */
  onLabelClick: eventType()
}

const FieldLabel = defineComponent({
  name: 'FieldLabel',
  props: {
    ...fieldLabelProps
  },
  setup(props, { attrs, expose }) {
    const { size: componentSize, prefixCls } = useConfigInject(
      'pro-core-field-label',
      props
    )
    const { wrapSSR, hashId } = useStyle(prefixCls)

    const intl = useIntl()
    const clearRef = shallowRef<HTMLElement>()
    const labelRef = shallowRef<HTMLElement>()

    const formatterText = (aValue: any) => {
      const { formatter } = props
      if (formatter) {
        return formatter(aValue)
      }
      return Array.isArray(aValue) ? aValue.join(',') : aValue
    }
    expose({
      clearRef,
      labelRef
    })

    return () => {
      const {
        label,
        onClear,
        value,
        disabled,
        onLabelClick,
        ellipsis,
        placeholder,
        bordered,
        downIcon,
        allowClear = true
      } = props
      const getTextByValue = (
        aLabel?: VNodeChild | VNodeChild[],
        aValue?: string | string[]
      ) => {
        if (
          aValue !== undefined &&
          aValue !== null &&
          aValue !== '' &&
          (!Array.isArray(aValue) || aValue.length)
        ) {
          const prefix = aLabel ? (
            <span
              onClick={() => {
                runEvent(onLabelClick)
              }}
              class={`${prefixCls.value}-text`}
            >
              {aLabel}
              {': '}
            </span>
          ) : (
            ''
          )
          const str = formatterText(aValue)
          if (!ellipsis) {
            return (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                {prefix}
                {formatterText(aValue)}
              </span>
            )
          }
          // 普通表单值最大长度41，如2022-06-21 20:11:25 ~ 2022-06-22 20:11:25
          const VALUE_MAX_LENGTH = 41
          const getText = () => {
            const isArrayValue = Array.isArray(aValue) && aValue.length > 1
            const unitText = intl.value.getMessage(
              'form.lightFilter.itemUnit',
              '项'
            )
            if (
              typeof str === 'string' &&
              str.length > VALUE_MAX_LENGTH &&
              isArrayValue
            ) {
              return `...${aValue.length}${unitText}`
            }
            return ''
          }
          const tail = getText()

          return (
            <span
              title={typeof str === 'string' ? str : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {prefix}
              <span style={{ paddingInlineStart: 4 }}>
                {typeof str === 'string'
                  ? str?.toString()?.substr?.(0, VALUE_MAX_LENGTH)
                  : str}
              </span>
              {tail}
            </span>
          )
        }
        return aLabel || placeholder
      }
      const size = componentSize?.value
      return wrapSSR(
        <span
          {...attrs}
          class={classNames(
            prefixCls.value,
            hashId.value,
            `${prefixCls.value}-${props.size ?? size ?? 'middle'}`,
            {
              [`${prefixCls.value}-active`]: !!value || value === 0,
              [`${prefixCls.value}-disabled`]: disabled,
              [`${prefixCls.value}-bordered`]: bordered,
              [`${prefixCls.value}-allow-clear`]: allowClear
            },
            attrs.class
          )}
          ref={labelRef}
          onClick={() => {
            runEvent(props.onClick)
          }}
        >
          {getTextByValue(label, value)}
          {(value || value === 0) && allowClear && (
            <CloseCircleFilled
              role="button"
              title={intl.value.getMessage('form.lightFilter.clear', '清除')}
              class={classNames(
                `${prefixCls.value}-icon`,
                hashId.value,
                `${prefixCls.value}-close`
              )}
              onClick={(e: any) => {
                if (!disabled) runEvent(onClear, e)
                e.stopPropagation()
              }}
              ref={clearRef}
            />
          )}
          {downIcon !== false
            ? downIcon ?? (
                <DownOutlined
                  class={classNames(
                    `${prefixCls.value}-icon`,
                    hashId.value,
                    `${prefixCls.value}-arrow`
                  )}
                />
              )
            : null}
        </span>
      )
    }
  }
})

export default FieldLabel
