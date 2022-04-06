import './default.less';
import './style.less';

export * from './RouteContext';
export * from './typings';
export * from './utils/getMenuData';
export { createContext, useContext } from './hooks/context';
export type { ContextType, CreateContext } from './hooks/context';

export { default as SiderMenuWrapper } from './components/SiderMenu';
export { default as BaseMenu, baseMenuProps } from './components/SiderMenu/BaseMenu';
export type { BaseMenuProps } from './components/SiderMenu/BaseMenu';
export type { SiderMenuWrapperProps } from './components/SiderMenu';
export type { MenuMode, OpenEventHandler, SelectInfo } from './components/SiderMenu/typings';

export { GlobalHeader } from './components/GlobalHeader';
export { default as GlobalFooter } from './components/GlobalFooter';
export { default as GridContent } from './components/GridContent';
export { WrapContent } from './WrapContent';

export type { GlobalHeaderProps } from './components/GlobalHeader';
export type { GlobalFooterProps } from './components/GlobalFooter';

export { default as PageContainer } from './components/PageContainer';
export { default as FooterToolbar } from './components/FooterToolbar';

export { default as WaterMark } from './components/WaterMark';
export type { WaterMarkProps } from './components/WaterMark';

export { default } from './BasicLayout';
export type { BasicLayoutProps } from './BasicLayout';

export { default as ProLayout } from './BasicLayout';
