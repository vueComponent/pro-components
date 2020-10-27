import { InjectionKey } from 'vue';
import { createContext, useContext } from './hooks/context';
import { PureSettings } from './defaultSettings';
import { useProProvider } from './ProProvider';

export interface RouteContextProps extends Partial<PureSettings> {
  breadcrumb?: any;
  menuData?: any[];
  isMobile?: boolean;
  prefixCls?: string;
  collapsed?: boolean;
  hasSideMenu?: boolean;
  hasHeader?: boolean;
  sideWidth?: number;
  hasFooterToolbar?: boolean;
  hasFooter?: boolean;
  setHasFooterToolbar?: (bool: boolean) => void;
}

const routeContextInjectKey: InjectionKey<RouteContextProps> = Symbol();

export const createRouteContext = (context: RouteContextProps) =>
  createContext<RouteContextProps>(context, routeContextInjectKey);

export const useRouteContext = () => useContext<RouteContextProps>(routeContextInjectKey);
