import './index.less';

import { VNodeChild, SetupContext } from 'vue';

import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import BaseMenu, { BaseMenuProps } from './BaseMenu';
import { WithFalse } from '../typings';
import { SiderProps } from './typings';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';

const { Sider } = Layout;

export interface SiderMenuProps extends Pick<BaseMenuProps, Exclude<keyof BaseMenuProps, ['onCollapse']>> {
  logo?: VNodeChild | JSX.Element;
  siderWidth?: number;
  menuHeaderRender?: WithFalse<
    (logo: VNodeChild | JSX.Element, title: VNodeChild | JSX.Element, props?: SiderMenuProps) => VNodeChild
    >;
  menuFooterRender?: WithFalse<(props?: SiderMenuProps) => VNodeChild>;
  menuContentRender?: WithFalse<(props: SiderMenuProps, defaultDom: VNodeChild | JSX.Element) => VNodeChild>;
  menuExtraRender?: WithFalse<(props: SiderMenuProps) => VNodeChild>;
  collapsedButtonRender?: WithFalse<(collapsed?: boolean) => VNodeChild>;
  breakpoint?: SiderProps['breakpoint'] | false;
  onMenuHeaderClick?: (e: MouseEvent) => void;
  hide?: boolean;
  onOpenChange?: (openKeys: WithFalse<string[]>) => void;
}

export const defaultRenderLogo = (logo: VNodeChild | JSX.Element): VNodeChild | JSX.Element => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />;
  }
  if (typeof logo === 'function') {
    return logo();
  }
  return logo;
}

export const defaultRenderLogoAndTitle = (
  props: SiderMenuProps,
  renderKey: string = 'menuHeaderRender',
): VNodeChild | JSX.Element => {
  const {
    logo = 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg',
    title,
    layout,
  } = props
  const renderFunction = props[renderKey || ''];
  if (renderFunction === false) {
    return null;
  }
  const logoDom = defaultRenderLogo(logo);
  const titleDom = <h1>{title}</h1>;
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
}

export const defaultRenderCollapsedButton = (collapsed?: boolean) =>
  collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;

const SiderMenu = (props: SiderMenuProps, context: SetupContext) => {
  const {
    collapsed,
    fixSiderbar,
    menuFooterRender,
    onCollapse,
    theme,
    siderWidth,
    isMobile,
    onMenuHeaderClick,
    breakpoint = 'lg',
    layout,
    menuExtraRender = false,
    collapsedButtonRender = defaultRenderCollapsedButton,
    menuContentRender,
    prefixCls,
    onOpenChange,
    headerHeight,
  } = props;
  const baseClassName = `${props.prefixCls}-sider`;
  const siderClassName = {
    [baseClassName]: true,
    [`${baseClassName}-fixed`]: fixSiderbar,
    [`${baseClassName}-layout-${layout}`]: layout && !isMobile,
    [`${baseClassName}-light`]: theme === 'light',
  };

  const headerDom = defaultRenderLogoAndTitle(props);

  const extraDom = menuExtraRender && menuExtraRender(props);

  const menuDom = menuContentRender !== false && (
    <BaseMenu
      {...props}
      mode="inline"
      handleOpenChange={onOpenChange}
      style={{
        width: '100%',
      }}
      class={`${baseClassName}-menu`}
    />
  );
};
