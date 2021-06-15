import { computed, FunctionalComponent, PropType, ExtractPropTypes } from 'vue';
import { defaultSettingProps } from '../defaultSettings';
import { CustomRender, Theme, MenuDataItem, WithFalse } from '../typings';
import {
  siderMenuProps,
  SiderMenuProps,
  defaultRenderLogo,
  defaultRenderLogoAndTitle,
  defaultRenderCollapsedButton,
} from '../SiderMenu/SiderMenu';
import { TopNavHeader } from '../TopNavHeader';
import { clearMenuItem, PropTypes } from '../utils';
import { useRouteContext } from '../RouteContext';

import './index.less';

export const globalHeaderProps = {
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
      WithFalse<(props: any /* HeaderViewProps */, defaultDom: CustomRender) => CustomRender>
    >,
    default: () => undefined,
  },
  menuHeaderRender: siderMenuProps.menuHeaderRender,
  rightContentRender: {
    type: [Object, Function] as PropType<WithFalse<(props: any) => CustomRender>>,
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

export type GlobalHeaderProps = ExtractPropTypes<typeof globalHeaderProps>;

const renderLogo = (
  menuHeaderRender: SiderMenuProps['menuHeaderRender'],
  logoDom: CustomRender,
) => {
  if (menuHeaderRender === false) {
    return null;
  }
  if (menuHeaderRender) {
    return menuHeaderRender(logoDom, null);
  }
  return logoDom;
};

export const GlobalHeader: FunctionalComponent<GlobalHeaderProps> = (props, { slots }) => {
  const {
    isMobile,
    logo,
    collapsed,
    onCollapse,
    collapsedButtonRender = defaultRenderCollapsedButton,
    rightContentRender,
    menuHeaderRender,
    onMenuHeaderClick,
    // className: propClassName,
    layout,
    headerTheme = 'dark',
    splitMenus,
    menuData,
    prefixCls: customPrefixCls,
  } = props;
  const { getPrefixCls } = useRouteContext();
  const prefixCls = customPrefixCls || getPrefixCls();
  const baseClassName = computed(() => `${prefixCls}-global-header`);
  const className = computed(() => {
    return {
      [baseClassName.value]: true,
      [`${baseClassName.value}-layout-${layout}`]: layout && headerTheme === 'dark',
    };
  });
  if (layout === 'mix' && !isMobile && splitMenus) {
    const noChildrenMenuData = (menuData || []).map(item => ({
      ...item,
      children: undefined,
    }));
    const clearMenuData = clearMenuItem(noChildrenMenuData);
    return (
      <TopNavHeader
        mode="horizontal"
        {...props}
        splitMenus={false}
        menuData={clearMenuData}
        theme={headerTheme as 'light' | 'dark'}
      />
    );
  }

  const logoDom = (
    <span class={`${baseClassName.value}-logo`} key="logo">
      <a>{defaultRenderLogo(logo)}</a>
    </span>
  );

  return (
    <div class={className.value}>
      {isMobile && renderLogo(menuHeaderRender, logoDom)}
      {isMobile && collapsedButtonRender && (
        <span
          class={`${baseClassName.value}-collapsed-button`}
          onClick={() => {
            if (onCollapse) {
              onCollapse(!collapsed);
            }
          }}
        >
          {collapsedButtonRender(collapsed)}
        </span>
      )}
      {layout === 'mix' && !isMobile && (
        <>
          <div class={`${baseClassName.value}-logo`} onClick={onMenuHeaderClick}>
            {defaultRenderLogoAndTitle({ ...props, collapsed: false }, 'headerTitleRender')}
          </div>
        </>
      )}
      <div style={{ flex: 1 }}>{slots.default?.()}</div>
      {rightContentRender && typeof rightContentRender === 'function'
        ? rightContentRender(props)
        : rightContentRender}
    </div>
  );
};
GlobalHeader.emits = ['menuHeaderClick', 'collapse', 'openKeys', 'select'];

export default GlobalHeader;
