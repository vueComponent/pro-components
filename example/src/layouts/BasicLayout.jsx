import './BasicLayout.less'

import { Avatar, Dropdown, Menu } from 'ant-design-vue'
import { asyncRouterMap } from '../config/router.config.js'
import { i18nRender } from '@example/locales'
import ProLayout from '@/'
import SelectLang from '@example/components/SelectLang'
import LogoSvg from '../assets/logo.svg?inline'
import defaultSettings from '@config/defaultSettings'

const Account = {
  name: 'Account',
  render () {
    const accountMenu = (
      <Menu class="menu">
        <Menu.Item key="info">
            个人信息
        </Menu.Item>
        <Menu.Item key="settings">
            个人设置
        </Menu.Item>
        <Menu.Item key="logout">
            退出登录
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={accountMenu} placement="bottomRight">
        <span class={'account'}>
          <Avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" class="antd-pro-global-header-index-avatar" />
          <span>Serati Ma</span>
        </span>
      </Dropdown>
    )
  }
}

const rightContentRender = (h, props) => {
  return (
    <div class="ant-pro-global-header-index-right">
      <Account class={'ant-pro-global-header-index-action'} />
      <SelectLang class={'ant-pro-global-header-index-action'} />
    </div>
  )
}

export default {
  name: 'BasicLayout',
  data () {
    return {
      // 侧栏收起状态
      collapsed: false,
      // 自动隐藏头部栏
      autoHideHeader: false,
      // 媒体查询
      query: {},
      // 布局类型
      layout: 'sidemenu', // 'sidemenu', 'topmenu'
      // 定宽: true / 流式: false
      contentWidth: true
    }
  },
  render (h) {
    const {
      collapsed,
      contentWidth,
      autoHideHeader,
      layout
    } = this

    const handleMediaQuery = (val) => {
      this.query = val
    }
    const handleCollapse = (val) => {
      this.collapsed = val
    }

    const menus = asyncRouterMap.find(item => item.path === '/').children
    const cdProps = {
      props: {
        menus,
        collapsed,
        autoHideHeader,
        mediaQuery: this.query,
        handleMediaQuery,
        handleCollapse,
        layout,
        contentWidth,
        rightContentRender,
        i18nRender,
        logo: LogoSvg,
        title: defaultSettings.title
      }
    }

    return (
      <ProLayout {...cdProps}>
        <router-view />
      </ProLayout>
    )
  }
}
