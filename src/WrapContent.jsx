import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { ConfigProvider, Layout } from 'ant-design-vue'

const { Content } = Layout

const WrapContentProps = {
  isChildrenLayout: PropTypes.bool,
  location: PropTypes.any,
  contentHeight: PropTypes.number
}

const WrapContent = {
  name: 'WrapContent',
  props: WrapContentProps,
  render (h) {
    const {
      isChildrenLayout
    } = this.$props
    return (
      <Content>
        <ConfigProvider
          getPopupContainer={(el, dialogContext) => {
            if (isChildrenLayout) {
              return el.parentNode()
            }
            return document.body
          }}
        >
          <div class="ant-pro-basicLayout-children-content-wrap">
            {this.$slots.default}
          </div>
        </ConfigProvider>
      </Content>
    )
  }
}

export default WrapContent
