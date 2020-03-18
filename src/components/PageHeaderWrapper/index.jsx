import './index.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import GridContent from '../GridContent'
import { PageHeader, Tabs } from 'ant-design-vue'

const { PageHeaderProps } = PageHeader

const prefixedClassName = 'ant-pro-page-header-wrap'

const PageHeaderTabConfig = {
  tabList: PropTypes.object,
  tabActiveKey: PropTypes.string,
  tabProps: PropTypes.object
}

const PageHeaderWrapperProps = {
  ...PageHeaderTabConfig,
  ...PageHeaderProps,
  title: PropTypes.oneOf([PropTypes.string, false]),
  content: PropTypes.any,
  extraContent: PropTypes.any,
  pageHeaderRender: PropTypes.func,

  // 包装 pro-layout 才能使用
  i18nRender: PropTypes.any
}

const defaultI18nRender = (t) => t

const useContext = (route) => {
  return route && {
    ...route.meta
  } || null
}

const renderFooter = (h, tabConfigProps) => {
  const {
    tabList,
    tabActiveKey,
    onTabChange,
    tabBarExtraContent,
    tabProps,
  } = tabConfigProps
  return tabList && tabList.length > 0 && (
    <Tabs
      class={`${prefixedClassName}-tabs`}
      activeKey={tabActiveKey}
      onChange={key => {
        if (onTabChange) {
          onTabChange(key)
        }
        this.$emit('tab-change', key)
      }}
      tabBarExtraContent={tabBarExtraContent}
      {...tabProps}
    >
      {tabList.map(item => (
        <Tabs.TabPane {...item} tab={item.tab} key={item.key} />
      ))}
    </Tabs>
  )
}

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

const defaultPageHeaderRender = (h, props, value, i18nRender) => {
  const {
    title,
    content,
    pageHeaderRender,
    extraContent,
    ...restProps
  } = props

  if (pageHeaderRender) {
    return pageHeaderRender({ ...props })
  }
  let pageHeaderTitle = title
  if ((!title && title !== false) || value.title !== false) {
    pageHeaderTitle = value.title
  }
  return (
    <PageHeader
      {...value}
      title={i18nRender(pageHeaderTitle)}
      {...props}
      footer={renderFooter(h, restProps)}
      >
      {renderPageHeader(h, content, extraContent)}
    </PageHeader>
  )
  // return
}

const PageHeaderWrapper = {
  name: 'PageHeaderWrapper',
  props: PageHeaderWrapperProps,
  render (h) {
    const children = this.$slots.default
    const value = useContext(this.$props.route || this.$route)
    const i18n = this.$props.i18nRender || defaultI18nRender
    return (
      <div class="ant-pro-page-header-wrap">
        <div class={`${prefixedClassName}-page-header-warp`}>
          <GridContent>{defaultPageHeaderRender(h, this.$props, value, i18n)}</GridContent>
        </div>
        { children ? (
          <GridContent>
            <div class={`${prefixedClassName}-children-content`}>
              {children}
            </div>
          </GridContent>
        ) : null }
      </div>
    )
  }
}

export default PageHeaderWrapper
