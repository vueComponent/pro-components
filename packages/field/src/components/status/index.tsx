import { stringType } from '@v-c/utils'
import { Badge } from 'ant-design-vue'
import type { DefineComponent } from 'vue'
import { defineComponent } from 'vue'

/** 快捷操作，用于快速的展示一个状态 */
const Status: {
  Success: DefineComponent
  Error: DefineComponent
  Processing: DefineComponent
  Default: DefineComponent
  Warning: DefineComponent
  success: DefineComponent
  error: DefineComponent
  processing: DefineComponent
  default: DefineComponent
  warning: DefineComponent
} = {
  Success: defineComponent({
    name: 'Success',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="success" text={children} />
      }
    }
  }),
  Error: defineComponent({
    name: 'Error',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="error" text={children} />
      }
    }
  }),
  Default: defineComponent({
    name: 'Default',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="default" text={children} />
      }
    }
  }),
  Processing: defineComponent({
    name: 'Processing',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="processing" text={children} />
      }
    }
  }),
  Warning: defineComponent({
    name: 'Warning',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="warning" text={children} />
      }
    }
  }),
  success: defineComponent({
    name: 'Success',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="success" text={children} />
      }
    }
  }),
  error: defineComponent({
    name: 'Error',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="error" text={children} />
      }
    }
  }),
  default: defineComponent({
    name: 'Default',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="default" text={children} />
      }
    }
  }),
  processing: defineComponent({
    name: 'Processing',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="processing" text={children} />
      }
    }
  }),
  warning: defineComponent({
    name: 'Warning',
    setup(_, { slots }) {
      return () => {
        const children = slots.default?.()
        return <Badge status="warning" text={children} />
      }
    }
  })
}

export type ProFieldStatusType = keyof typeof Status

export const ProFieldBadgeColor = defineComponent({
  name: 'ProFieldBadgeColor',
  props: {
    color: stringType()
  },
  setup(props, { slots }) {
    const { color } = props
    return () => {
      const children = slots.default?.()
      return <Badge color={color} text={children} />
    }
  }
})

export default Status
