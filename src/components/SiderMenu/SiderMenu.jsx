import './index.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import 'ant-design-vue/es/layout/style'
import Layout from 'ant-design-vue/es/layout'
import { isFun } from '../../utils/util'
import BaseMenu from '../RouteMenu'

const { Sider } = Layout

export const SiderMenuProps = {
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false),
  mode: PropTypes.string.def('inline'),
  theme: PropTypes.string.def('dark'),
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  collapsedWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(80),
  openKeys: PropTypes.array.def(undefined),
  selectedKeys: PropTypes.array.def(undefined),
  openOnceKey: PropTypes.bool.def(true),
  handleCollapse: PropTypes.func,
  menus: PropTypes.array,
  siderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
  isMobile: PropTypes.bool,
  layout: PropTypes.string.def('inline'),
  fixSiderbar: PropTypes.bool,
  logo: PropTypes.any,
  title: PropTypes.string.def(''),
  // render function or vnode
  menuHeaderRender: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.object, PropTypes.bool]),
  menuRender: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.object, PropTypes.bool]),

  // listeners
  openChange: PropTypes.func,
  select: PropTypes.func,
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
    return isFun(menuHeaderRender)
      && menuHeaderRender(h, logoDom, props.collapsed ? null : titleDom, props)
      || menuHeaderRender
  }
  return (
    <span>
      {logoDom}
      {titleDom}
    </span>
  )
}

const adaptWidth = collapsedWidth => {
  if (collapsedWidth >= 32 && collapsedWidth <= 80) {
    return collapsedWidth
  } else {
    return 80
  }
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
      collapsedWidth,

      selectedKeys,
      openKeys,

      openChange = () => null,
      select = () => null,

      openOnceKey,
      siderWidth,
      fixSiderbar,
      mode,
      theme,
      menus,
      logo,
      title,
      onMenuHeaderClick = () => null,
      i18nRender,
      menuHeaderRender,
      menuRender
    } = this
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

    // 用户的logo图片宽度无法动态获取，暂时写死32，后续有更好的方案再修改
    const logoPaddingLeft = (collapsed, collapsedWidth) => {
      if (collapsed) {
        return `${collapsedWidth ? Math.abs((collapsedWidth - 32) / 2) : 0}px`
      }
      return 32
    }

    return (<Sider
      class={siderCls}
      breakpoint={'lg'}
      trigger={null}
      width={siderWidth}
      theme={theme}
      collapsible={collapsible}
      collapsed={collapsed}
      collapsedWidth={adaptWidth(collapsedWidth)}
    >
      {headerDom && (
        <div
          class="ant-pro-sider-menu-logo"
          onClick={onMenuHeaderClick}
          style={{paddingLeft: logoPaddingLeft(collapsed, adaptWidth(collapsedWidth))}}
          id="logo"
        >
          <router-link to={{ path: '/' }}>
            {headerDom}
          </router-link>
        </div>
      )}
      {menuRender && (
        isFun(menuRender)
          && menuRender(h, this.$props)
          || menuRender
      ) || (
        <BaseMenu
          collapsed={collapsed}
          collapsedWidth={adaptWidth(collapsedWidth)}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          openOnceKey={openOnceKey}
          onOpenChange={openChange}
          onSelect={select}
          menus={menus}
          mode={mode}
          theme={theme}
          i18nRender={i18nRender}
        />
      )}
    </Sider>)
  }
}

export default SiderMenu
