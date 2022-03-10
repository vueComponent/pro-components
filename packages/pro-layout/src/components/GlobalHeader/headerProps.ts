import type { PropType } from 'vue'
import type { Theme, CustomRender, MenuDataItem, ProProps, WithFalse } from '../../typings'
import { defaultSettingProps } from '../../defaultSettings'
import { siderMenuProps } from '../SiderMenu/SiderMenu'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import type { RightContentRender } from '../../RenderTypings'

export default {
  ...defaultSettingProps,
  prefixCls: PropTypes.string.def('ant-pro'),
  collapsed: PropTypes.looseBool,
  isMobile: PropTypes.looseBool,
  logo: siderMenuProps.logo,
  logoStyle: siderMenuProps.logoStyle,
  headerTheme: {
    type: String as PropType<Theme>,
    default: 'dark',
  },
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => [],
  },
  splitMenus: siderMenuProps.splitMenus,
  menuRender: {
    type: [Object, Function] as PropType<
      WithFalse<(props: ProProps /* HeaderViewProps */, defaultDom: CustomRender) => CustomRender>
    >,
    default: () => undefined,
  },
  menuHeaderRender: siderMenuProps.menuHeaderRender,
  menuItemRender: siderMenuProps.menuItemRender,
  subMenuItemRender: siderMenuProps.subMenuItemRender,
  rightContentRender: {
    type: [Object, Function] as PropType<RightContentRender>,
    default: () => undefined,
  },
  collapsedButtonRender: siderMenuProps.collapsedButtonRender,
  matchMenuKeys: siderMenuProps.matchMenuKeys,

  // events
  onMenuHeaderClick: PropTypes.func,
  onCollapse: siderMenuProps.onCollapse,
  onOpenKeys: siderMenuProps.onOpenKeys,
  onSelect: siderMenuProps.onSelect,
}
