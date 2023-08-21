import {
  booleanType,
  classNames,
  eventType,
  numberType,
  objectType,
  someType,
  stringType,
  vNodeType
} from '@v-c/utils'
import type { ExtractPropTypes, VNodeChild } from 'vue'
import { defineComponent, shallowRef } from 'vue'
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip'
import { ConfigProvider, Popover } from 'ant-design-vue'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import type { DropDownFooterProps } from '../dropdown-footer'
import { DropdownFooter } from '../dropdown-footer'
import { openVisibleCompatible } from '../../compare-versions/open-visible-compatible'
import { useStyle } from './style'

export type FooterRender =
  | ((
      onConfirm?: (e?: MouseEvent) => void,
      onClear?: (e?: MouseEvent) => void
    ) => VNodeChild | false)
  | false

export const dropdownProps = {
  label: vNodeType(),
  footer: objectType<DropDownFooterProps>(),
  footerRender: someType<FooterRender>([Boolean, Function]),
  padding: numberType(),
  disabled: booleanType(),
  onOpenChange: eventType<(open: boolean) => void>(),
  'onUpdate:open': eventType<(open: boolean) => void>(),
  open: booleanType(),
  onVisibleChange: eventType<(open: boolean) => void>(),
  'onUpdate:visible': eventType<(open: boolean) => void>(),
  visible: booleanType(),
  placement: stringType<TooltipPlacement>()
}

export type DropdownProps = Partial<ExtractPropTypes<typeof dropdownProps>>

const FilterDropdown = defineComponent({
  name: 'FilterDropdown',
  inheritAttrs: false,
  props: {
    ...dropdownProps
  },
  setup(props, { slots }) {
    const htmlRef = shallowRef()
    const onOpenChange = (open: boolean) => {
      props?.onOpenChange?.(open)
      props?.['onUpdate:open']?.(open)
    }
    const onVisibleChange = (open: boolean) => {
      props?.onVisibleChange?.(open)
      props?.['onUpdate:visible']?.(open)
    }
    const { prefixCls } = useConfigInject('pro-core-field-dropdown', props)
    const { wrapSSR, hashId } = useStyle(prefixCls)

    return () => {
      const {
        label,
        footer,
        open,
        disabled,
        visible,
        footerRender,
        placement
      } = props
      const children = slots.default?.()
      const dropdownOpenProps = openVisibleCompatible(
        open || visible || false,
        onOpenChange || onVisibleChange
      )
      return wrapSSR(
        <Popover
          placement={placement}
          trigger={['click']}
          {...dropdownOpenProps}
          overlayInnerStyle={{
            padding: 0
          }}
          content={
            <div
              ref={htmlRef}
              class={classNames(`${prefixCls.value}-overlay`, {
                [`${prefixCls.value}-overlay-${placement}`]: placement,
                hashId
              })}
            >
              <ConfigProvider
                getPopupContainer={() => {
                  return htmlRef.value.current || document.body
                }}
              >
                <div class={`${prefixCls.value}-content ${hashId}`}>
                  {children}
                </div>
              </ConfigProvider>
              {footer && (
                <DropdownFooter
                  disabled={disabled}
                  footerRender={footerRender}
                  {...footer}
                />
              )}
            </div>
          }
        >
          <span class={`${prefixCls.value}-label ${hashId}`}>{label}</span>
        </Popover>
      )
    }
  }
})

export { FilterDropdown }
