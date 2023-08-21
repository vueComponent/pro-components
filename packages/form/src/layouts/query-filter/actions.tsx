import {
  booleanType,
  eventType,
  functionType,
  runEvent,
  someType,
  vNodeType
} from '@v-c/utils'
import type { IntlType } from '@ant-design-vue/pro-provider'
import type { ExtractPropTypes, VNodeChild } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import {
  useConfigInject,
  useIntl,
  useProProviderContext
} from '@ant-design-vue/pro-provider'
import { omitBoolean } from '@ant-design-vue/pro-utils'
import { Space } from 'ant-design-vue'

export const actionsProps = {
  submitter: vNodeType(),
  /** 是否收起 */
  collapsed: booleanType(),
  'onUpdate:collapsed': eventType<(collapsed: boolean) => void>(),
  /** 收起按钮的事件 */
  onCollapse: eventType<(collapsed: boolean) => void>(),
  setCollapsed: functionType<(collapsed: boolean) => void>(),
  //     setCollapsed: (collapse: boolean) => void;
  isForm: booleanType(),
  //     style?: React.CSSProperties;
  /** 收起按钮的 render */
  collapseRender: someType<
    | ((
        collapsed: boolean,
        /** 是否应该展示，有两种情况 列只有三列，不需要收起 form 模式 不需要收起 */
        props: any,
        intl: IntlType,
        hiddenNum?: false | number
      ) => VNodeChild)
    | false
  >([Boolean, Function]),
  /** 隐藏个数 */
  hiddenNum: someType<false | number>([Boolean, Number])
}

export type ActionsProps = ExtractPropTypes<typeof actionsProps>

const defaultCollapseRender: ActionsProps['collapseRender'] = (
  collapsed,
  _,
  intl,
  hiddenNum
) => {
  if (collapsed) {
    return (
      <>
        {intl.getMessage('tableForm.collapsed', '展开')}
        {hiddenNum && `(${hiddenNum})`}
        <DownOutlined
          style={{
            marginInlineStart: '0.5em',
            transition: '0.3s all',
            transform: `rotate(${collapsed ? 0 : 0.5}turn)`
          }}
        />
      </>
    )
  }
  return (
    <>
      {intl.getMessage('tableForm.expand', '收起')}
      <DownOutlined
        style={{
          marginInlineStart: '0.5em',
          transition: '0.3s all',
          transform: `rotate(${collapsed ? 0 : 0.5}turn)`
        }}
      />
    </>
  )
}

/**
 * FormFooter 的组件，可以自动进行一些配置
 *
 */
const Actions = defineComponent({
  name: 'Actions',
  inheritAttrs: false,
  props: {
    ...actionsProps
  },
  setup(props, { slots, attrs }) {
    const { getPrefixCls } = useConfigInject('', props)
    const intl = useIntl()
    const { hashId } = useProProviderContext()
    const setCollapsed = (collapsed: boolean) => {
      runEvent(props?.['onUpdate:collapsed'], collapsed)
      runEvent(props?.onCollapse, collapsed)
      props?.setCollapsed?.(collapsed)
    }
    return () => {
      const {
        collapsed = false,
        submitter = slots.submitter?.(),
        hiddenNum
      } = props
      const collapseRender =
        omitBoolean(props.collapseRender) ||
        slots.collapseRender ||
        defaultCollapseRender

      return (
        <Space style={attrs.style} size={16}>
          {submitter}
          {props.collapseRender !== false && (
            <a
              class={`${getPrefixCls('pro-query-filter-collapse-button')} ${
                hashId.value
              }`.trim()}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapseRender?.(collapsed, props, intl.value, hiddenNum)}
            </a>
          )}
        </Space>
      )
    }
  }
})

export default Actions
