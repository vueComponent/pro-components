import './index.less';
import { FunctionalComponent, computed, ref } from 'vue';

// import 'ant-design-vue/es/layout/style';
// import Layout from 'ant-design-vue/es/layout';
import { Layout, Menu } from 'ant-design-vue';
import BaseMenu, { BaseMenuProps } from './BaseMenu';
import { WithFalse, RenderVNodeType } from '../typings';
import { SiderProps } from './typings';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { useProProvider } from '../ProProvider';

const { Sider } = Layout;

export type PrivateSiderMenuProps = {
  matchMenuKeys: string[];
};

export interface SiderMenuProps
  extends Pick<BaseMenuProps, Exclude<keyof BaseMenuProps, ['onCollapse']>> {
  logo?: RenderVNodeType;
  siderWidth?: number;
  collapsedWidth?: number;
  menuHeaderRender?: WithFalse<
    (logo: RenderVNodeType, title: RenderVNodeType, props?: SiderMenuProps) => RenderVNodeType
  >;
  menuFooterRender?: WithFalse<(props?: SiderMenuProps) => RenderVNodeType>;
  menuContentRender?: WithFalse<
    (props: SiderMenuProps, defaultDom: RenderVNodeType) => RenderVNodeType
  >;
  menuExtraRender?: WithFalse<(props: SiderMenuProps) => RenderVNodeType>;
  collapsedButtonRender?: WithFalse<(collapsed?: boolean) => RenderVNodeType>;
  breakpoint?: SiderProps['breakpoint'] | false;
  onMenuHeaderClick?: (e: MouseEvent) => void;
  fixed?: boolean;
  hide?: boolean;
  onOpenChange?: (openKeys: WithFalse<string[]>) => void;
  onSelect?: (selectedKeys: WithFalse<string[]>) => void;
}

export const defaultRenderLogo = (logo: RenderVNodeType): RenderVNodeType => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />;
  }
  if (typeof logo === 'function') {
    return logo();
  }
  return logo;
};

export const defaultRenderLogoAndTitle = (
  props: SiderMenuProps,
  renderKey: string = 'menuHeaderRender',
): RenderVNodeType => {
  const {
    logo = 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg',
    title,
    layout,
  } = props;
  const renderFunction = props[renderKey || ''];
  if (renderFunction === false) {
    return null;
  }
  const logoDom = defaultRenderLogo(logo);
  const titleDom = <h1>{title}</h1>;
  // call menuHeaderRender
  if (renderFunction) {
    // when collapsed, no render title
    return renderFunction(logoDom, props.collapsed ? null : titleDom, props);
  }
  if (layout === 'mix' && renderKey === 'menuHeaderRender') {
    return null;
  }
  return (
    <a>
      {logoDom}
      {props.collapsed ? null : titleDom}
    </a>
  );
};

export const defaultRenderCollapsedButton = (collapsed?: boolean): RenderVNodeType =>
  collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;

const SiderMenu: FunctionalComponent<SiderMenuProps> = (props: SiderMenuProps) => {
  const {
    menuData,
    collapsed,
    siderWidth,
    onOpenChange,
    onSelect,
    onCollapse,
    breakpoint,
    collapsedWidth = 48,
    menuExtraRender = false,
    menuContentRender = false,
    menuFooterRender = false,
    collapsedButtonRender = defaultRenderCollapsedButton,
  } = props;
  const { getPrefixCls } = useProProvider();
  const baseClassName = getPrefixCls('sider');

  // const isMix = computed(() => props.layout === 'mix');
  const fixed = computed(() => props.fixed);
  const runtimeTheme = computed(() => (props.layout === 'mix' && 'light') || 'dark');
  const runtimeSideWidth = computed(() =>
    props.collapsed ? props.collapsedWidth : props.siderWidth,
  );

  const classNames = ref({
    [baseClassName]: true,
    [`${baseClassName}-${runtimeTheme.value}`]: true,
    [`${baseClassName}-${props.layout}`]: true,
    [`${baseClassName}-fixed`]: fixed,
  });
  // call menuHeaderRender
  const headerDom = defaultRenderLogoAndTitle(props);
  const extraDom = menuExtraRender && menuExtraRender(props);
  const defaultMenuDom = (
    <BaseMenu
      menus={menuData}
      theme={props.theme === 'realDark' ? 'dark' : props.theme}
      mode="inline"
      collapsed={props.collapsed}
      openKeys={props.openKeys}
      selectedKeys={props.selectedKeys}
      style={{
        width: '100%',
      }}
      class={`${baseClassName}-menu`}
      {...{
        'onUpdate:openKeys': $event => {
          onOpenChange($event);
        },
        'onUpdate:selectedKeys': $event => {
          onSelect($event);
        },
      }}
    />
  );

  return (
    <>
      {fixed.value && (
        <div
          style={{
            width: `${runtimeSideWidth.value}px`,
            overflow: 'hidden',
            flex: `0 0 ${runtimeSideWidth.value}px`,
            maxWidth: `${runtimeSideWidth.value}px`,
            minWidth: `${runtimeSideWidth.value}px`,
          }}
        />
      )}
      <Sider
        class={classNames.value}
        width={siderWidth}
        breakpoint={breakpoint || undefined}
        collapsed={collapsed}
        collapsible={false}
        collapsedWidth={collapsedWidth}
      >
        <div class={`${baseClassName}-logo`}>{headerDom}</div>
        {extraDom && (
          <div class={`${baseClassName}-extra ${!headerDom && `${baseClassName}-extra-no-logo`}`}>
            {extraDom}
          </div>
        )}
        <div style="flex: 1; overflow: hidden auto;">
          {(menuContentRender && menuContentRender(props, defaultMenuDom)) || defaultMenuDom}
        </div>
        <div class={`${baseClassName}-links`}>
          <Menu
            class={`${baseClassName}-link-menu`}
            inlineIndent={16}
            theme={runtimeTheme.value}
            selectedKeys={[]}
            openKeys={[]}
            mode="inline"
            onClick={() => {
              if (onCollapse) {
                onCollapse(!props.collapsed);
              }
            }}
          >
            <Menu.Item
              key={'collapsed-button'}
              class={`${baseClassName}-collapsed-button`}
              title={null}
            >
              {collapsedButtonRender && collapsedButtonRender(collapsed)}
            </Menu.Item>
          </Menu>
        </div>
        {menuFooterRender && <div class={`${baseClassName}-footer`}>{menuFooterRender(props)}</div>}
      </Sider>
    </>
  );
};

export default SiderMenu;
