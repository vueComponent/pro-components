import './index.less'

import { Layout } from 'ant-design-vue'
import BaseMenu from '../RouteMenu'

const { Sider } = Layout

export const SiderMenuProps = {
  i18nRender: {
    type: Function,
    default: () => undefined
  },
  mode: {
    type: String,
    required: false,
    default: 'inline'
  },
  theme: {
    type: String,
    required: false,
    default: 'dark'
  },
  contentWidth: {
    type: Boolean,
    default: false
  },
  collapsible: {
    type: Boolean,
    required: false,
    default: false
  },
  collapsed: {
    type: Boolean,
    required: false,
    default: false
  },
  handleCollapse: {
    type: Function,
    default: () => undefined
  },
  menus: {
    type: Array,
    required: true
  },
  siderWidth: {
    type: Number,
    default: 256
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  layout: {
    type: String,
    default: 'inline'
  },
  fixSiderbar: {
    type: Boolean,
    default: false
  },
  logo: {
    type: null,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  menuHeaderRender: {
    type: Function,
    default: null
  }
}

export const defaultRenderLogo = (h, logo) => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />
  }
  if (typeof logo === 'function') {
    return logo()
  }
  return h(logo)
}

export const defaultRenderLogoAntTitle = (h, props) => {
  const {
    logo = 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg',
    title,
    menuHeaderRender
  } = props

  if (menuHeaderRender === false) {
    return null
  }
  const logoDom = defaultRenderLogo(h, logo)
  const titleDom = <h1>{title}</h1>

  if (menuHeaderRender) {
    return menuHeaderRender(h, logoDom, props.collapsed ? null : titleDom, props)
  }
  return (
    <span>
      {logoDom}
      {titleDom}
    </span>
  )
}

const SiderMenu = {
  name: 'SiderMenu',
  model: {
    prop: 'collapsed',
    event: 'collapse'
  },
  props: SiderMenuProps,
  render (h) {
    const {
      collapsible,
      collapsed,
      siderWidth,
      fixSiderbar,
      mode,
      theme,
      menus,
      logo,
      title,
      handleCollapse,
      onMenuHeaderClick = () => null,
      i18nRender,
      menuHeaderRender
    } = this
    console.log('fixSiderbar', fixSiderbar)
    const siderCls = ['ant-pro-sider-menu-sider']
    if (fixSiderbar) siderCls.push('fix-sider-bar')
    if (theme === 'light') siderCls.push('light')
    //
    // const handleCollapse = (collapsed, type) => {
    //   this.$emit('collapse', collapsed)
    // }

    const headerDom = defaultRenderLogoAntTitle(h, {
      logo, title, menuHeaderRender, collapsed
    })

    return (<Sider
      class={siderCls}
      breakpoint={'lg'}
      trigger={null}
      width={siderWidth}
      theme={theme}
      collapsible={collapsible}
      collapsed={collapsed}
      onCollapse={handleCollapse}
    >
      {headerDom && (
        <div
          class="ant-pro-sider-menu-logo"
          onClick={onMenuHeaderClick}
          id="logo"
        >
          <router-link to={{ path: '/' }}>
            {headerDom}
          </router-link>
        </div>
      )}
      <BaseMenu collapsed={collapsed} menus={menus} mode={mode} theme={theme} i18nRender={i18nRender} />
    </Sider>)
  }
}

export default SiderMenu
