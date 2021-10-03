import {
  InjectionKey,
  provide,
  reactive,
  Ref,
  VNodeChild,
  ComputedRef,
} from 'vue'
import { createContext, useContext } from './hooks/context'
import { MenuDataItem, FormatMessage, WithFalse } from './typings'
import { PureSettings } from './defaultSettings'

export interface Route {
  path: string
  breadcrumbName: string
  children?: Omit<Route, 'children'>[]
}

export interface BreadcrumbProps {
  prefixCls?: string
  routes?: Route[]
  params?: any
  separator?: VNodeChild
  itemRender?: (opts: {
    route: Route
    params: any
    routes: Array<Route>
    paths: Array<string>
  }) => VNodeChild
}

export type BreadcrumbListReturn = Pick<
  BreadcrumbProps,
  Extract<keyof BreadcrumbProps, 'routes' | 'itemRender'>
>

export interface MenuState {
  selectedKeys: string[]
  openKeys: string[]
}

export interface RouteContextProps extends Partial<PureSettings>, MenuState {
  menuData: MenuDataItem[]
  flatMenuData?: MenuDataItem[]

  getPrefixCls?: (suffixCls?: string, customizePrefixCls?: string) => string
  locale?: WithFalse<FormatMessage>
  breadcrumb?: BreadcrumbListReturn | ComputedRef<BreadcrumbListReturn>
  isMobile?: boolean
  prefixCls?: string
  collapsed?: boolean
  hasSideMenu?: boolean
  hasHeader?: boolean
  siderWidth?: number
  headerHeight?: number
  hasFooterToolbar?: boolean
  hasFooter?: boolean
  hasSide?: boolean
  setHasFooterToolbar?: (bool: boolean) => void
  /* 附加属性 */
  [key: string]: any
}

export const defaultPrefixCls = 'ant-pro'

export const getPrefixCls = (
  suffixCls?: string,
  customizePrefixCls?: string
) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

// set default context
export const defaultRouteContext = reactive({
  getPrefixCls,
  locale: (t: string) => t,
  contentWidth: 'Fluid',
  hasFooterToolbar: false,
})

const routeContextInjectKey: InjectionKey<RouteContextProps> =
  Symbol('route-context')

export const createRouteContext = () =>
  createContext<RouteContextProps>(
    routeContextInjectKey,
    'RouteContext.Provider'
  )

export const provideRouteContext = (
  value: RouteContextProps | Ref<RouteContextProps>
) => {
  provide(routeContextInjectKey, value)
}

export const useRouteContext = () =>
  useContext<Required<RouteContextProps>>(
    routeContextInjectKey,
    defaultRouteContext
  )

const Provider = createRouteContext()

export default {
  Provider,
}
