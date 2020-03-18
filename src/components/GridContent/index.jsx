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

    const classNames = {
      ['ant-pro-grid-content']: true,
      ['wide']: propsContentWidth
    }

    return <div class={classNames}>{children}</div>
  }
}

export default GridContent
