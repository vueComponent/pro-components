/* eslint-disable */
import './Header.less'

import { Layout } from 'ant-design-vue'
import BaseMenu from './components/RouteMenu/BaseMenu'
import { defaultRenderLogoAntTitle, SiderMenuProps } from './components/SiderMenu/SiderMenu'
import GlobalHeader, { GlobalHeaderProps } from './components/GlobalHeader'
import { isFun } from './utils/util'

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
    type: [Function, Object],
    required: false
  },
  autoHideHeader: {
    type: Boolean,
    required: true
  },
  menuRender: {
    type: null,
    required: false
  },
  headerRender: {
    type: null,
    required: false
  },
  rightContentRender: {
    type: null,
    required: false
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
  const maxWidth = 1200 - 280 - 120
  const contentWidth = props.contentWidth
  const baseCls = 'ant-pro-top-nav-header'
  const { logo, title, theme, isMobile, headerRender, rightContentRender } = props
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
            <BaseMenu {...{ props: props }} />
          </div>
          {isFun(rightContentRender) && rightContentRender(h, rightContentProps) || rightContentRender}
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
