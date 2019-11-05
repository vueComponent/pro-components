/* eslint-disable */
import GridContent from '../GridContent'
import { getComponentFromProp } from 'ant-design-vue/lib/_util/props-util'

const prefixedClassName = 'ant-pro-page-header-wrap'

const renderPageHeader = (h, content, extraContent) => {
  if (!content && !extraContent) {
    return null
  }
  return (
    <div class={`${prefixedClassName}-detail`}>
      <div class={`${prefixedClassName}-main`}>
        <div class={`${prefixedClassName}-row`}>
          { content && (
            <div class={`${prefixedClassName}-content`}>{content}</div>
          )}
          { extraContent && (
            <div class={`${prefixedClassName}-extraContent`}>
              {extraContent}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const defaultPageHeaderRender = (h, props) => {
  const {
    title,
    content,
    pageHeaderRender,
    extraContent,
    ...restProps
  } = props

  return renderPageHeader(h, content, extraContent)
}

const PageHeaderWrapper = {
  name: 'PageHeaderWrapper',
  render (h) {

    const children = getComponentFromProp(this, 'children')
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <div class={`${prefixedClassName}-page-header-warp`}>
          <GridContent>{defaultPageHeaderRender(h, this.$props)}</GridContent>
        </div>
      </div>
    )
  }
}

export default PageHeaderWrapper
