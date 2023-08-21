import type { VNodeChild } from 'vue'
import { createVNode, defineComponent, isVNode, ref } from 'vue'
import { filterEmpty, isFunction, toArray, vNodeType } from '@v-c/utils'
import { Col, Row } from 'ant-design-vue'
import { proFormGridConfig } from '../typing'
import { useFormContextInject } from '../base-form/context'

export const RowWrapper = defineComponent({
  name: 'RowWrapper',
  props: {
    ...proFormGridConfig,
    wrapper: vNodeType<((dom?: any) => VNodeChild[]) | VNodeChild[]>()
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { rowProps = {}, grid = false, wrapper = slots.wrapper } = props
      const children = slots.default?.()
      if (!grid) {
        const WrapperNode = isFunction(wrapper)
          ? wrapper(children)
          : toArray(wrapper)
        const Wrapper = filterEmpty(WrapperNode)[0]
        if (Wrapper && isVNode(Wrapper)) {
          return createVNode(Wrapper, {}, () => slots.default?.())
        }
        return children
      }

      return (
        <Row gutter={8} {...attrs} {...rowProps}>
          {children}
        </Row>
      )
    }
  }
})

export const ColWrapper = defineComponent({
  name: 'ColWrapper',
  props: {
    ...proFormGridConfig,
    wrapper: vNodeType()
  },
  setup(props, { slots, attrs }) {
    const { colProps: proColProps = ref({}) } = useFormContextInject()
    return () => {
      const { colProps = {}, grid = false, wrapper = slots.wrapper } = props
      const children = slots.default?.()
      if (!grid) {
        const WrapperNode = isFunction(wrapper) ? wrapper() : toArray(wrapper)
        const Wrapper = filterEmpty(WrapperNode)[0]
        if (Wrapper && isVNode(Wrapper)) {
          return createVNode(Wrapper, {}, () => slots.default?.())
        }
        return children
      }

      const originProps = {
        ...proColProps.value,
        ...colProps,
        ...attrs
      }

      /**
       * `xs` takes precedence over `span`
       * avoid `span` doesn't work
       */
      if (
        typeof originProps.span === 'undefined' &&
        typeof originProps.xs === 'undefined'
      ) {
        originProps.xs = 24
      }
      return (
        <Col {...attrs} {...originProps}>
          {children}
        </Col>
      )
    }
  }
})
