import type { ExtractPropTypes, VNodeChild } from 'vue'
import { defineComponent } from 'vue'
import { Button } from 'ant-design-vue'
import { useConfigInject, useIntl } from '@ant-design-vue/pro-provider'
import { booleanType, classNames, eventType, someType } from '@v-c/utils'
import { useStyle } from './style'
type OnClick = (e?: MouseEvent) => void

type LightFilterFooterRender =
  | ((
      onConfirm?: (e?: MouseEvent) => void,
      onClear?: (e?: MouseEvent) => void
    ) => VNodeChild | false)
  | false
export const dropdownFooterProps = {
  onClear: eventType<OnClick>(),
  onConfirm: eventType<OnClick>(),
  disabled: booleanType(),
  footerRender: someType<LightFilterFooterRender>([Function, Boolean])
}

export type DropDownFooterProps = Partial<
  ExtractPropTypes<typeof dropdownFooterProps>
>

const DropdownFooter = defineComponent({
  name: 'DropdownFooter',
  inheritAttrs: false,
  props: {
    ...dropdownFooterProps
  },
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('pro-core-dropdown-footer', props)
    const { wrapSSR, hashId } = useStyle(prefixCls)
    const intl = useIntl()
    return () => {
      const {
        onClear,
        onConfirm,
        disabled,
        footerRender = slots.footerRender
      } = props
      const defaultFooter = [
        <Button
          key="clear"
          style={{
            visibility: onClear ? 'visible' : 'hidden'
          }}
          type="link"
          size="small"
          disabled={disabled}
          onClick={(e) => {
            if (onClear) {
              onClear(e)
            }
            e.stopPropagation()
          }}
        >
          {intl.value.getMessage('form.lightFilter.clear', '清除')}
        </Button>,
        <Button
          key="confirm"
          data-type="confirm"
          type="primary"
          size="small"
          onClick={onConfirm}
          disabled={disabled}
        >
          {intl.value.getMessage('form.lightFilter.confirm', '确认')}
        </Button>
      ]
      if (
        footerRender === false ||
        footerRender?.(onConfirm, onClear) === false
      ) {
        return null
      }
      const renderDom = footerRender?.(onConfirm, onClear) || defaultFooter

      return wrapSSR(
        <div
          class={classNames(prefixCls.value, hashId.value)}
          onClick={(e) =>
            (e.target as Element).getAttribute('data-type') !== 'confirm' &&
            e.stopPropagation()
          }
        >
          {renderDom}
        </div>
      )
    }
  }
})

export { DropdownFooter }
