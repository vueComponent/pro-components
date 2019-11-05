import { Layout } from 'ant-design-vue'
import RouteMenu from '../RouteMenu'
import './index.less'

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
  logo: {
    type: null,
    default: ''
  },
  title: {
    type: String,
    default: ''
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

export const defaultRenderLogoAntTitle = (h, logo, title, menuHeaderRender) => {
  if (menuHeaderRender === false) {
    return null
  }
  const logoDom = defaultRenderLogo(h, logo)
  const titleDom = <h1>{title}</h1>

  if (menuHeaderRender) {
    return menuHeaderRender(h, logoDom, titleDom)
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
      i18nRender
    } = this

    const siderCls = ['ant-pro-sider-menu-sider']
    if (fixSiderbar) siderCls.push('fix-sider-bar')
    if (theme === 'light') siderCls.push('light')
    //
    // const handleCollapse = (collapsed, type) => {
    //   this.$emit('collapse', collapsed)
    // }

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
      <div class='ant-pro-sider-menu-logo' id='logo'>
        <router-link to={{ path: '/' }}>
          {defaultRenderLogoAntTitle(h, logo, title, null)}
        </router-link>
      </div>
      <RouteMenu collapsed={collapsed} menus={menus} mode={mode} theme={theme} i18nRender={i18nRender} />
    </Sider>)
  }
}

export default SiderMenu
