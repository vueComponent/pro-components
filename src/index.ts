export * from './RouteContext';
export * from './typings';
export * from './utils/getMenuData';
export { createContext, useContext, ContextType, CreateContext } from './hooks/context';
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
export { default as SiderMenuWrapper, SiderMenuWrapperProps } from './SiderMenu';
export {
  default as BaseMenu,
  BaseMenuProps,
  MenuMode,
  OpenEventHandler,
  SelectInfo,
  baseMenuProps,
} from './SiderMenu/BaseMenu';
export { default as WaterMark } from './WaterMark/index';

export { default, BasicLayoutProps } from './BasicLayout';
