/* eslint-disable */
import './Header.less'

import { Layout } from 'ant-design-vue'
import RouteMenu from './components/RouteMenu/Menu'
import { defaultRenderLogoAntTitle, SiderMenuProps } from './components/SiderMenu/SiderMenu'
import GlobalHeader, { GlobalHeaderProps } from './components/GlobalHeader'

const { Header } = Layout

export const HeaderViewProps = {
  ...GlobalHeaderProps,
  ...SiderMenuProps,
  isMobile: {
    type: Boolean,
    default: () => false
  },
  collapsed: {
    type: Boolean,
    required: true
  },
  logo: {
    type: null,
    default: () => null
  },
  autoHideHeader: {
    type: Boolean,
    required: true
  },
  menuRender: {
    type: null
  },
  headerRender: {
    type: null
  },
  rightContentRender: {
    type: null
  },
  siderWidth: {
    type: Number
  },
  visible: {
    type: Boolean,
    default: true
  }
}

const renderContent = (h, props) => {
  const isTop = props.layout === 'topmenu'
  const isMobile = false
  const maxWidth = 1200 - 280 - 120
  const contentWidth = props.contentWidth
  const baseCls = 'ant-pro-top-nav-header'
  const { logo, title, theme, headerRender, rightContentRender } = props
  const rightContentProps = { theme }
  let defaultDom = <GlobalHeader {...{ props: props }} />
  if (isTop && !isMobile) {
    defaultDom = (
      <div class={[baseCls, theme]}>
        <div class={[`${baseCls}-main`, contentWidth ? 'wide' : '']}>
          <div class={`${baseCls}-left`}>
            <div class={`${baseCls}-logo`} key="logo" id="logo">
              {defaultRenderLogoAntTitle(h, logo, title, null)}
            </div>
          </div>
          <div class={`${baseCls}-menu`} style={{ maxWidth: `${maxWidth}px`, flex: 1 }}>
            <RouteMenu {...{ props: props }} />
          </div>
          {rightContentRender(h, rightContentProps)}
        </div>
      </div>
    )
  }
  if (headerRender) {
    return headerRender(h, props)
  }
  return defaultDom
}

const HeaderView = {
  name: 'HeaderView',
  props: HeaderViewProps,
  render (h) {
    const {
      visible,
      siderWidth: width,
      autoHideHeader,
    } = this.$props
    const props = this.$props
    return (
      visible ? (
        <Header
          style={{ padding: 0, width, zIndex: 2 }}
          class={autoHideHeader ? 'ant-pro-fixed-header' : ''}
        >
          {renderContent(h, props)}
        </Header>
      ) : null
    )
  }
}

export default HeaderView
