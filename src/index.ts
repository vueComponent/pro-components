export * from './RouteContext';
export * from './typings';
export * from './utils/getMenuData';
export { createContext, useContext } from './hooks/context';
export type { ContextType, CreateContext } from './hooks/context';

export { default as FooterToolbar } from './FooterToolbar';
export { default as GlobalFooter } from './GlobalFooter';
export { default as GridContent } from './GridContent';
export { WrapContent } from './WrapContent';
// export {
//   default as ProProvider,
//   defaultProProviderProps,
//   useProProvider,
//   ProProviderData,
// } from './ProProvider';
export { default as PageContainer } from './PageContainer';

export { default as SiderMenuWrapper } from './SiderMenu';
export type { SiderMenuWrapperProps } from './SiderMenu';

export { default as BaseMenu, baseMenuProps } from './SiderMenu/BaseMenu';
export type { BaseMenuProps } from './SiderMenu/BaseMenu';
export type { MenuMode, OpenEventHandler, SelectInfo } from './SiderMenu/typings';

export { default as WaterMark } from './WaterMark';
export type { WaterMarkProps } from './WaterMark';

export { default } from './BasicLayout';
export type { BasicLayoutProps } from './BasicLayout';
