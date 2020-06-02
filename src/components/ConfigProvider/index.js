import PropTypes from 'ant-design-vue/es/_util/vue-types'

const ConfigProvider = {
  name: 'ProConfigProvider',
  props: {
    i18nRender: PropTypes.any,
    contentWidth: PropTypes.bool,
    breadcrumbRender: PropTypes.func,
  },
  provide () {
    const _self = this
    return {
      locale: _self.$props.i18nRender,
      contentWidth: _self.$props.contentWidth,
      breadcrumbRender: _self.$props.breadcrumbRender,
    }
  },
  render () {
    const { $scopedSlots } = this
    const children = this.children || $scopedSlots.default
    return children()
  }
}

export default ConfigProvider
