import { defineComponent } from 'vue'
import { classNames, isValidElement, someType, vNodeType } from '@v-c/utils'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import { useStyle } from './style'

/**
 * 在 form 的 label 后面增加一个 tips 来展示一些说明文案
 *
 * @param props
 */
export const LabelIconTip = defineComponent({
  name: 'LabelIconTip',
  inheritAttrs: false,
  props: {
    label: vNodeType(),
    subTitle: vNodeType(),
    tooltip: someType<string | Record<string, any>>([String, Object]),
    ellipsis: someType<boolean | { showTitle?: boolean }>([Boolean, Object])
  },
  setup(props) {
    const { getPrefixCls } = useConfigInject('', props)
    const className = getPrefixCls('pro-core-label-tip')
    const { wrapSSR, hashId } = useStyle(className)
    return () => {
      const { label, tooltip, ellipsis, subTitle } = props
      if (!tooltip && !subTitle) {
        return <>{label}</>
      }
      const tooltipProps =
        typeof tooltip === 'string' || isValidElement(tooltip)
          ? { title: tooltip }
          : (tooltip as any)

      const icon = tooltipProps?.icon || <InfoCircleOutlined />

      return wrapSSR(
        <div
          class={classNames(className, hashId)}
          onMousedown={(e) => e.stopPropagation()}
          onMouseleave={(e) => e.stopPropagation()}
          onMousemove={(e) => e.stopPropagation()}
        >
          <div
            class={classNames(`${className}-title`, hashId, {
              [`${className}-title-ellipsis`]: ellipsis
            })}
          >
            {label}
          </div>
          {subTitle && (
            <div class={`${className}-subtitle ${hashId}`.trim()}>
              {subTitle}
            </div>
          )}
          {tooltip && (
            <Tooltip {...tooltipProps}>
              <span class={`${className}-icon ${hashId}`.trim()}>{icon}</span>
            </Tooltip>
          )}
        </div>
      )
    }
  }
})
