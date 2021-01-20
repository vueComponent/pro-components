import { reactive } from 'vue';
import { menus } from './menus';
import { RouteContextProps } from '../src/RouteContext';

export const globalState = reactive<RouteContextProps>({
  collapsed: false,
  openKeys: ['/dashboard'],
  selectedKeys: ['/welcome'],

  layout: 'mix',
  navTheme: 'dark',
  isMobile: false,
  fixSiderbar: false,
  fixedHeader: false,
  menuData: menus,
  sideWidth: 208,
  splitMenus: true,
  hasSideMenu: true,
  hasHeader: true,
  hasFooterToolbar: false,
  setHasFooterToolbar: (has: boolean) => (globalState.hasFooterToolbar = has),
});
