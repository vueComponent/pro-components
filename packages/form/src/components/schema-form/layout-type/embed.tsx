import { defineComponent } from 'vue'

const Embed = defineComponent({
  inheritAttrs: false,
  setup(_, { slots }) {
    return () => slots.default?.()
  }
})
export default Embed
