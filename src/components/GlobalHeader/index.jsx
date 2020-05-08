import './index.less'

import debounce from 'lodash/debounce'
import { triggerEvent, inBrowser, isFun } from '../../utils/util'
import { Icon } from 'ant-design-vue'
import { defaultRenderLogo } from '../SiderMenu/SiderMenu'

export const GlobalHeaderProps = {
  collapsed: {
    type: Boolean,
    required: true
  },
  handleCollapse: {
    type: Function,
    default: () => undefined
  },
  isMobile: {
    type: Boolean,
    default: () => false
  },
  fixedHeader: {
    type: Boolean,
    default: false
  },
  logo: {
    type: null,
    default: () => null
  },
  menuRender: {
    type: null,
    required: false
  },
  collapsedButtonRender: {
    type: null,
    required: false
  },
  rightContentRender: {
    type: null,
    required: false
  }
}

const defaultRenderCollapsedButton = (h, collapsed) => (
  <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'}/>
)

const GlobalHeader = {
  name: 'GlobalHeader',
  props: GlobalHeaderProps,
  render (h) {
    const toggle = () => {
      const { collapsed, handleCollapse } = this.$props
      if (handleCollapse) handleCollapse(!collapsed)
      this.triggerResizeEvent()
    }
    const renderCollapsedButton = () => {
      const {
        collapsed,
        collapsedButtonRender = defaultRenderCollapsedButton,
        menuRender
      } = this.$props
      if (collapsedButtonRender !== false && menuRender !== false) {
        return (
          <span class="ant-pro-global-header-trigger" onClick={toggle}>
            {isFun(collapsedButtonRender) && collapsedButtonRender(h, collapsed) || collapsedButtonRender}
          </span>
        )
      }
      return null
    }

    const { isMobile, logo, rightContentRender } = this.$props

    const headerCls = 'ant-pro-global-header'

    return (
      <div class={headerCls}>
        {isMobile && (
          <a class={`${headerCls}-logo`} key="logo" href={'/'}>
            {defaultRenderLogo(h, logo)}
          </a>
        )}
        {renderCollapsedButton()}
        {isFun(rightContentRender) && rightContentRender(h, this.$props) || rightContentRender}
      </div>
    )
  },
  methods: {
    triggerResizeEvent: debounce(() => {
      inBrowser && triggerEvent(window, 'resize')
    })
  },
  beforeDestroy () {
    this.triggerResizeEvent.cancel && this.triggerResizeEvent.cancel()
  }
}

export default GlobalHeader
