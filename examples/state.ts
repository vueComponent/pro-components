import { reactive } from 'vue';
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
  menuData: [],
  sideWidth: 208,
  splitMenus: false,
  hasSideMenu: false,
  hasHeader: true,
  hasFooterToolbar: false,
  setHasFooterToolbar: (has: boolean) => (globalState.hasFooterToolbar = has),
});
