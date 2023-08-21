import type { VNode } from 'vue'
import { Fragment, createVNode, defineComponent, isVNode } from 'vue'
import { filterEmpty, toArray } from '@v-c/utils'
import { useConfigInject } from '@ant-design-vue/pro-provider'
import { proFieldFC } from '../../typing'
const addArrayKeys = (doms: VNode[]) =>
  doms.map((dom: any, index) => {
    if (isVNode(dom)) {
      return <Fragment key={index}>{dom}</Fragment>
    }
    return createVNode(dom, {
      key: index,
      ...dom?.props,
      style: {
        flex: 1,
        ...dom?.props?.style
      }
    })
  })

/**
 * 一般用于放多个按钮
 *
 * @param
 */
const FieldOptions = defineComponent({
  name: 'FieldOptions',
  inheritAttrs: false,
  props: proFieldFC(),
  setup(props, { slots, expose }) {
    const { prefixCls } = useConfigInject('pro-field-option', props)
    expose({})
    return () => {
      const className = prefixCls.value
      const { mode: type, render, fieldProps } = props

      const text = filterEmpty(
        props?.text ? toArray(props.text) : slots.defalut?.()
      )
      if (render) {
        const doms = render(text, { mode: type, ...fieldProps }, <></>)

        if (!doms || doms?.length < 1 || !Array.isArray(doms)) {
          return null
        }

        return (
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center'
            }}
            class={className}
          >
            {addArrayKeys(doms)}
          </div>
        )
      }

      if (!text || !Array.isArray(text)) {
        if (!filterEmpty(text).length) {
          return null
        }
        return text as JSX.Element
      }

      return (
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center'
          }}
          class={className}
        >
          {addArrayKeys(text as any)}
        </div>
      )
    }
  }
})

export default FieldOptions
