import type { PropType } from 'vue';
import type { CustomRender, Theme, MenuDataItem, WithFalse } from '../typings';
import { defaultSettingProps } from '../defaultSettings';
import { PropTypes } from '../utils';
import { siderMenuProps } from '../SiderMenu/SiderMenu';

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
    type: [Object, Function, Boolean] as PropType<
      WithFalse<(props: any /* HeaderViewProps */, defaultDom: CustomRender) => CustomRender>
    >,
    default: () => undefined,
  },
  menuHeaderRender: siderMenuProps.menuHeaderRender,
  menuItemRender: siderMenuProps.menuItemRender,
  subMenuItemRender: siderMenuProps.subMenuItemRender,
  rightContentRender: {
    type: [Object, Function, Boolean] as PropType<WithFalse<(props: any) => CustomRender>>,
    default: () => undefined,
  },
  collapsedButtonRender: siderMenuProps.collapsedButtonRender,
  matchMenuKeys: siderMenuProps.matchMenuKeys,

  // events
  onMenuHeaderClick: PropTypes.func,
  onCollapse: siderMenuProps.onCollapse,
  onOpenKeys: siderMenuProps.onOpenKeys,
  onSelect: siderMenuProps.onSelect,
};
