import type { Ref, VNode } from 'vue'
import { createVNode, defineComponent, ref } from 'vue'
import { booleanType, filterEmpty, useState } from '@v-c/utils'
import { proFieldLightProps } from '../typing'

const FieldHOC = defineComponent({
  name: 'FieldHOC',
  props: {
    ...proFieldLightProps,
    isLight: booleanType()
  },
  setup(props, { slots }) {
    const [labelTrigger, setLabelTrigger] = useState<boolean>(false)
    const lightLabel = ref<{
      labelRef: Ref<HTMLElement>
      clearRef: Ref<HTMLElement>
    } | null>(null)
    return () => {
      // 是label且不是label里面的clear图标触发事件
      const isTriggeredByLabel = (e: MouseEvent) => {
        // 两条语句结果分别命名，可读性好点
        const isLabelMouseDown = lightLabel.value?.labelRef?.contains(
          e.target as HTMLElement
        )
        const isClearMouseDown = lightLabel.value?.clearRef?.contains(
          e.target as HTMLElement
        )
        return isLabelMouseDown && !isClearMouseDown
      }

      const handleMouseDown = (e: MouseEvent) => {
        if (isTriggeredByLabel(e)) {
          setLabelTrigger(true)
        }
      }
      const handleMouseUp = () => {
        setLabelTrigger(false)
      }
      const children = filterEmpty(slots?.default?.())
      let node
      if (children.length) {
        node = children[0]
      }

      if (props.isLight) {
        return (
          <div onMousedown={handleMouseDown} onMouseup={handleMouseUp}>
            {createVNode(node as VNode, {
              labelTrigger: labelTrigger.value,
              lightLabel: lightLabel.value
            })}
          </div>
        )
      }

      return <>{children}</>
    }
  }
})

export default FieldHOC
