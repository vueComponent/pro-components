import './index.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'

const GridContent = {
  name: 'GridContent',
  functional: true,
  props: {
    children: PropTypes.any,
    contentWidth: PropTypes.bool,
  },
  render (h, content) {
    const { contentWidth: propsContentWidth } = content.props
    const children = content.children

    const classNames = {
      ['ant-pro-grid-content']: true,
      ['wide']: propsContentWidth
    }

    return <div class={classNames}>{children}</div>
  }
}

export default GridContent
