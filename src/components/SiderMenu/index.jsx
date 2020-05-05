import './index.less'

import { Drawer } from 'ant-design-vue'
import SiderMenu, { SiderMenuProps } from './SiderMenu'

const SiderMenuWrapper = {
  name: 'SiderMenuWrapper',
  model: {
    prop: 'collapsed',
    event: 'collapse'
  },
  props: SiderMenuProps,
  render () {
    const {
      layout,
      isMobile,
      collapsed,
      handleCollapse: onCollapse
    } = this
    const isTopMenu = layout === 'topmenu'
    return isMobile ? (
      <Drawer
        class="ant-pro-sider-menu"
        visible={!collapsed}
        placement="left"
        maskClosable
        onClose={() => onCollapse && onCollapse(true)}
        bodyStyle={{
          padding: 0,
          height: '100vh'
        }}
      >
        <SiderMenu {...{ props: {...this.$props, collapsed: isMobile ? false : collapsed} }} />
      </Drawer>
    ) : !isTopMenu && (
      <SiderMenu class="ant-pro-sider-menu" {...{ props: this.$props }} />
    )
  }
}

SiderMenuWrapper.install = function (Vue) {
  Vue.component(SiderMenuWrapper.name, SiderMenuWrapper)
}

export default SiderMenuWrapper
