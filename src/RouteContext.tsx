import { InjectionKey, VNodeChild } from 'vue';
import { createContext, useContext } from './hooks/context';
import { MenuDataItem } from './typings';
import { PureSettings } from './defaultSettings';
export interface Route {
  path: string;
  breadcrumbName: string;
  children?: Omit<Route, 'children'>[];
}

export interface BreadcrumbProps {
  prefixCls?: string;
  routes?: Route[];
  params?: any;
  separator?: VNodeChild;
  itemRender?: (opts: {
    route: Route;
    params: any;
    routes: Array<Route>;
    paths: Array<string>;
  }) => VNodeChild;
}

export type BreadcrumbListReturn = Pick<
  BreadcrumbProps,
  Extract<keyof BreadcrumbProps, 'routes' | 'itemRender'>
>;

export interface MenuState {
  selectedKeys: string[];
  openKeys: string[];
  setSelectedKeys?: (key: string[]) => void;
  setOpenKeys?: (key: string[]) => void;
}

export interface RouteContextProps extends Partial<PureSettings>, MenuState {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  i18n: (t: string) => string;

  breadcrumb?: BreadcrumbListReturn;
  menuData?: MenuDataItem[];
  isMobile?: boolean;
  prefixCls?: string;
  collapsed?: boolean;
  hasSideMenu?: boolean;
  hasHeader?: boolean;
  sideWidth?: number;
  hasFooterToolbar?: boolean;
  hasFooter?: boolean;
  setHasFooterToolbar?: (bool: boolean) => void;
  /* 附加属性 */
  [key: string]: any;
}

const routeContextInjectKey: InjectionKey<RouteContextProps> = Symbol('route-context');

export const createRouteContext = () =>
  createContext<RouteContextProps>(routeContextInjectKey, 'RouteContext.Provider');

export const useRouteContext = () =>
  useContext<RouteContextProps>('route-context' /* routeContextInjectKey */);

const Provider = createRouteContext();

export default {
  Provider,
};
