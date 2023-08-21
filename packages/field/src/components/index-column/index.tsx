import { booleanType, classNames, filterEmpty, isNumber } from '@v-c/utils'
import { computed, defineComponent } from 'vue'
import { useStyle } from '@ant-design-vue/pro-utils'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { getBaseText } from '../../_utils'

const IndexColumn = defineComponent({
  name: 'IndexColumn',
  inheritAttrs: false,
  props: {
    border: booleanType()
  },
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('pro-field-index-column', props)
    const className = computed(() => prefixCls.value)
    // css
    const { wrapSSR, hashId } = useStyle('IndexColumn', () => {
      return {
        [`.${className.value}`]: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          '&-border': {
            color: '#fff',
            fontSize: '12px',
            lineHeight: '12px',
            backgroundColor: '#314659',
            borderRadius: '9px',
            '&.top-three': {
              backgroundColor: '#979797'
            }
          }
        }
      }
    })
    return () => {
      const { border } = props
      const def = slots?.default?.()
      const node = filterEmpty(def)
      let children = getBaseText(node)
      if (!isNumber(children)) {
        if (isNaN(Number(children))) {
          children = 0
        } else {
          children = Number(children)
        }
      }

      return wrapSSR(
        <div
          class={classNames(className.value, hashId.value, {
            [`${className.value}-border`]: border,
            'top-three': (children as number) > 3
          })}
        >
          {children}
        </div>
      )
    }
  }
})

export default IndexColumn
