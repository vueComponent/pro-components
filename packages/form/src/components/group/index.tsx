import type { VNode, VNodeChild } from 'vue'
import { cloneVNode, defineComponent, toRef } from 'vue'
import { LabelIconTip, useMountMergeState } from '@ant-design-vue/pro-utils'
import { classNames, filterEmpty, isValidElement, runEvent } from '@v-c/utils'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { RightOutlined } from '@ant-design/icons-vue'
import { Space } from 'ant-design-vue'
import { groupProps } from '../../typing'
import { useFieldContextInject } from '../../field-context'
import { ColWrapper, RowWrapper } from '../../helpers'
import { useStyle } from './style'

const Group = defineComponent({
  name: 'ProFormGroup',
  inheritAttrs: false,
  props: {
    ...groupProps
  },
  setup(props, { slots, attrs }) {
    const context = useFieldContextInject()
    const { getPrefixCls } = useConfigInject('', props)
    const className = getPrefixCls('pro-form-group')
    const { wrapSSR, hashId } = useStyle(className)
    const [collapsed, setCollapsed] = useMountMergeState(
      () => props.defaultCollapsed || false,
      {
        value: toRef(props, 'collapsed'),
        onChange(value) {
          runEvent(props.collapsed, value)
          runEvent(props['onUpdate:collapsed'], value)
        }
      }
    )
    return () => {
      const {
        collapsible,
        labelLayout,
        title = props.label ?? slots?.title?.(),
        tooltip,
        align = 'start',
        direction,
        size = 32,
        titleStyle,
        titleRender = slots?.titleRender,
        spaceProps,
        extra = slots?.extra?.(),
        autoFocus
      } = {
        ...props,
        ...context.value?.groupProps
      }
      const style: any = attrs?.style || {}
      const collapsibleButton = collapsible && (
        <RightOutlined
          style={{
            marginInlineEnd: 8
          }}
          rotate={!collapsed.value ? 90 : undefined}
        />
      )

      const label = (
        <LabelIconTip
          label={
            collapsibleButton ? (
              <div>
                {collapsibleButton}
                {title}
              </div>
            ) : (
              title
            )
          }
          tooltip={tooltip}
        />
      )
      const Wrapper = (dom: VNodeChild) => [
        <Space
          {...spaceProps}
          class={classNames(
            `${className}-container ${hashId.value}`,
            (spaceProps as any)?.class
          )}
          size={size}
          align={align}
          direction={direction}
          style={{
            rowGap: 0,
            ...(spaceProps as any)?.style
          }}
        >
          {dom}
        </Space>
      ]

      const titleDom = titleRender ? titleRender(label, props) : label

      const renderDom = () => {
        const hiddenChildren: VNodeChild[] = []
        const children = filterEmpty(slots?.default?.())
        const childrenList = children.map((element, index) => {
          if (isValidElement(element) && (element as VNode)?.props?.hidden) {
            hiddenChildren.push(element)
            return null
          }
          if (index === 0 && isValidElement(element) && autoFocus) {
            return cloneVNode(element as VNode, {
              ...((element as VNode).props as any),
              autoFocus
            })
          }
          return element
        })

        return [
          <RowWrapper key="children" wrapper={Wrapper}>
            {childrenList}
          </RowWrapper>,
          hiddenChildren.length > 0 ? (
            <div
              style={{
                display: 'none'
              }}
            >
              {hiddenChildren}
            </div>
          ) : null
        ]
      }
      const [childrenDoms, hiddenDoms] = renderDom()
      return wrapSSR(
        <ColWrapper>
          <div
            class={classNames(className, hashId.value, {
              [`${className}-twoLine`]: labelLayout === 'twoLine'
            })}
            style={style}
          >
            {hiddenDoms}
            {(title || tooltip || extra) && (
              <div
                class={`${className}-title ${hashId.value}`.trim()}
                style={titleStyle}
                onClick={() => {
                  setCollapsed(!collapsed.value)
                }}
              >
                {extra ? (
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    {titleDom}
                    <span onClick={(e) => e.stopPropagation()}>{extra}</span>
                  </div>
                ) : (
                  titleDom
                )}
              </div>
            )}
            <div
              style={{
                display: collapsible && collapsed.value ? 'none' : undefined
              }}
            >
              {childrenDoms}
            </div>
          </div>
        </ColWrapper>
      )
    }
  }
})

export default Group
