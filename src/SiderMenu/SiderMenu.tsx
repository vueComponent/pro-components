import {
  FunctionalComponent as FC,
  computed,
  ExtractPropTypes,
  PropType,
  CSSProperties,
  unref,
} from 'vue';
import 'ant-design-vue/es/layout/style';
import 'ant-design-vue/es/menu/style';
import { Layout, Menu } from 'ant-design-vue';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import BaseMenu, { baseMenuProps } from './BaseMenu';
import { WithFalse, CustomRender } from '../typings';
import { SiderProps } from './typings';
import { defaultSettingProps } from '../defaultSettings';
import { useRouteContext } from '../RouteContext';
import { PropTypes, getMenuFirstChildren } from '../utils';
import './index.less';

const { Sider } = Layout;

export type PrivateSiderMenuProps = {
  matchMenuKeys?: string[];
};

export const siderMenuProps = {
  ...defaultSettingProps,
  ...baseMenuProps,
  logo: {
    type: [Object, String, Function] as PropType<CustomRender>,
    default: () => undefined,
  },
  logoStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined,
  },
  siderWidth: PropTypes.number.def(208),
  headerHeight: PropTypes.number.def(48),
  collapsedWidth: PropTypes.number.def(48),
  menuHeaderRender: {
    type: [Function, Object, Boolean] as PropType<
      WithFalse<(logo: CustomRender, title: CustomRender, props?: any) => CustomRender>
    >,
    default: () => undefined,
  },
  menuFooterRender: {
    type: [Function, Object, Boolean] as PropType<WithFalse<(props?: any) => CustomRender>>,
    default: () => undefined,
  },
  menuContentRender: {
    type: [Function, Object, Boolean] as PropType<
      WithFalse<(props: any, defaultDom: CustomRender) => CustomRender>
    >,
    default: () => undefined,
  },
  menuExtraRender: {
    type: [Function, Object, Boolean] as PropType<WithFalse<(props?: any) => CustomRender>>,
    default: () => undefined,
  },
  collapsedButtonRender: {
    type: [Function, Object, Boolean] as PropType<WithFalse<(collapsed?: boolean) => CustomRender>>,
    default: () => undefined,
  },
  breakpoint: {
    type: [Object, Boolean] as PropType<SiderProps['breakpoint'] | false>,
    default: () => false,
  },
  isMobile: PropTypes.looseBool,
  splitMenus: PropTypes.looseBool,
  fixed: PropTypes.looseBool,
  hide: PropTypes.looseBool,
  matchMenuKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },

  // events
  onMenuHeaderClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  onCollapse: {
    type: Function as PropType<(collapsed: boolean) => void>,
  },
  onOpenKeys: {
    type: Function as PropType<(openKeys: WithFalse<string[]>) => void>,
  },
  onSelect: {
    type: Function as PropType<(selectedKeys: WithFalse<string[]>) => void>,
  },
};

export type SiderMenuProps = Partial<ExtractPropTypes<typeof siderMenuProps>>;

export const defaultRenderLogo = (logo?: CustomRender, logoStyle?: CSSProperties): CustomRender => {
  if (!logo) {
    return null;
  }
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" style={logoStyle} />;
  }
  if (typeof logo === 'function') {
    return logo();
  }
  return logo;
};

export const defaultRenderLogoAndTitle = (
  props: SiderMenuProps,
  renderKey: string | undefined = 'menuHeaderRender',
): CustomRender | null => {
  const {
    logo = 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg',
    logoStyle,
    title,
    layout,
  } = props;
  const renderFunction = (props as any)[renderKey || ''];
  if (renderFunction === false) {
    return null;
  }
  const logoDom = defaultRenderLogo(logo, logoStyle);
  const titleDom = <h1>{title}</h1>;
  if (layout === 'mix' && renderKey === 'menuHeaderRender') {
    return null;
  }
  // call menuHeaderRender
  if (typeof renderFunction === 'function') {
    // when collapsed, no render title
    return renderFunction(logoDom, props.collapsed ? null : titleDom, props);
  }
  if (Array.isArray(renderFunction)) {
    return <>{renderFunction}</>;
  }

  return (
    <a>
      {logoDom}
      {props.collapsed ? null : titleDom}
    </a>
  );
};

export const defaultRenderCollapsedButton = (collapsed?: boolean): CustomRender =>
  collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;

const SiderMenu: FC<SiderMenuProps> = (props: SiderMenuProps) => {
  const {
    collapsed,
    siderWidth,
    breakpoint,
    collapsedWidth = 48,
    menuExtraRender = false,
    menuContentRender = false,
    menuFooterRender = false,
    collapsedButtonRender = defaultRenderCollapsedButton,

    onCollapse,
    onOpenKeys,
    onSelect,
    onMenuHeaderClick,
  } = props;
  const context = useRouteContext();
  const { getPrefixCls } = context;
  const baseClassName = getPrefixCls('sider');
  const hasSplitMenu = computed(() => props.layout === 'mix' && props.splitMenus);
  const sTheme = computed(() => (props.layout === 'mix' && 'light') || props.navTheme);
  const sSideWidth = computed(() => (props.collapsed ? props.collapsedWidth : props.siderWidth));
  const classNames = computed(() => {
    return {
      [baseClassName]: true,
      [`${baseClassName}-${sTheme.value}`]: true,
      [`${baseClassName}-${props.layout}`]: true,
      [`${baseClassName}-fixed`]: context.fixSiderbar,
    };
  });

  const handleSelect = ($event: string[]) => {
    if (props.onSelect) {
      if (unref(hasSplitMenu)) {
        props.onSelect([context.selectedKeys[0], ...$event]);
        return;
      }
      props.onSelect($event);
    }
  };
  // call menuHeaderRender
  const headerDom = defaultRenderLogoAndTitle(props);
  const extraDom = menuExtraRender && menuExtraRender(props);
  if (hasSplitMenu.value && unref(context.flatMenuData).length === 0) {
    return null;
  }
  const defaultMenuDom = (
    <BaseMenu
      prefixCls={getPrefixCls()}
      locale={props.locale || context.locale}
      theme={sTheme.value === 'realDark' ? 'dark' : sTheme.value}
      mode="inline"
      menuData={hasSplitMenu.value ? context.flatMenuData : context.menuData}
      collapsed={props.collapsed}
      openKeys={context.openKeys}
      selectedKeys={context.selectedKeys}
      menuItemRender={props.menuItemRender}
      subMenuItemRender={props.subMenuItemRender}
      iconfontUrl={props.iconfontUrl}
      onClick={props.onMenuClick}
      style={{
        width: '100%',
      }}
      class={`${baseClassName}-menu`}
      {...{
        'onUpdate:openKeys': ($event: string[]) => onOpenKeys && onOpenKeys($event),
        'onUpdate:selectedKeys': handleSelect,
      }}
    />
  );

  return (
    <>
      {context.fixSiderbar && (
        <div
          style={{
            width: `${sSideWidth.value}px`,
            overflow: 'hidden',
            flex: `0 0 ${sSideWidth.value}px`,
            maxWidth: `${sSideWidth.value}px`,
            minWidth: `${sSideWidth.value}px`,
            transition: `background-color 0.3s, min-width 0.3s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`,
          }}
        />
      )}
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        breakpoint={breakpoint || undefined}
        onCollapse={(collapse: boolean) => {
          if (props.isMobile) return;
          onCollapse?.(collapse);
        }}
        collapsedWidth={collapsedWidth}
        style={{
          overflow: 'hidden',
          paddingTop:
            props.layout === 'mix' && !props.isMobile ? `${props.headerHeight}px` : undefined,
        }}
        width={siderWidth}
        theme={sTheme.value === 'realDark' ? 'dark' : sTheme.value}
        class={classNames.value}
      >
        {headerDom && (
          <div
            class={`${baseClassName}-logo`}
            onClick={props.layout !== 'mix' ? onMenuHeaderClick : undefined}
            id="logo"
            style={props?.logoStyle}
          >
            {headerDom}
          </div>
        )}
        {extraDom && !props.collapsed && (
          <div
            class={{
              [`${baseClassName}-extra`]: true,
              [`${baseClassName}-extra-no-logo`]: !headerDom,
            }}
          >
            {extraDom}
          </div>
        )}
        <div style="flex: 1; overflow: hidden auto;">
          {(menuContentRender && menuContentRender(props, defaultMenuDom)) || defaultMenuDom}
        </div>
        <div class={`${baseClassName}-links`}>
          {collapsedButtonRender !== false ? (
            <Menu
              class={`${baseClassName}-link-menu`}
              inlineIndent={16}
              theme={sTheme.value as 'light' | 'dark'}
              selectedKeys={[]}
              openKeys={[]}
              mode="inline"
              // @ts-ignore
              onClick={() => {
                if (onCollapse) {
                  onCollapse(!props.collapsed);
                }
              }}
            >
              <Menu.Item
                key={'collapsed-button'}
                class={`${baseClassName}-collapsed-button`}
                title={false}
              >
                {collapsedButtonRender && typeof collapsedButtonRender === 'function'
                  ? collapsedButtonRender(collapsed)
                  : collapsedButtonRender}
              </Menu.Item>
            </Menu>
          ) : null}
        </div>
        {menuFooterRender && <div class={`${baseClassName}-footer`}>{menuFooterRender(props)}</div>}
      </Sider>
    </>
  );
};

export default SiderMenu;
