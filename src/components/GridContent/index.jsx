import './index.less'

const GridContent = {
  name: 'GridContent',
  functional: true,
  props: {
    children: {
      type: null,
      default: null
    },
    contentWidth: {
      type: Boolean,
      default: false
    }
  },
  render (h, content) {
    const { contentWidth: propsContentWidth } = content.props
    const children = content.children

    let className = 'ant-pro-grid-content'
    if (propsContentWidth) {
      className = className + ' wide'
    }
    return <div class={className}>{children}</div>
  }
}

export default GridContent
