import PropTypes from 'ant-design-vue/es/_util/vue-types'

const ConfigProvider = {
  name: 'ConfigProvider',
  props: {
    i18nRender: PropTypes.any,
  },
  provide () {
    const _self = this
    return {
      locale: _self.$props.i18nRender
    }
  },
  render () {
    const { $scopedSlots } = this
    const children = this.children || $scopedSlots.default
    return children()
  }
}

export default ConfigProvider
