import { defineComponent, h, reactive, provide, inject, toRefs, UnwrapRef, PropType, SetupContext, InjectionKey, VNode, RendererNode, RendererElement } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { RouteProps } from './typings';
import { PureSettings } from './defaultSettings';

export interface RouteContextProps extends Partial<PureSettings> {
  breadcrumb?: any;
  menuData?: any[];
  isMobile?: boolean;
  prefixCls?: string;
  collapsed?: boolean;
  hasSiderMenu?: boolean;
  hasHeader?: boolean;
  siderWidth?: number;
  hasFooterToolbar?: boolean;
  hasFooter?: boolean;
  setHasFooterToolbar?: (bool: boolean) => void;
}

export const routeContextProps = {
  isMobile: {
    type: Boolean,
    default: false,
  },
  menuData: {
    type: Object as PropType<RouteProps[]>,
    default: undefined,
  },
  prefixCls: {
    type: String,
    default: 'ant-pro',
  },
  collapsed: {
    type: Boolean,
  },
  hasSiderMenu: {
    type: Boolean,
  },
  siderWidth: {
    type: Number,
  },
  hasFooterToolbar: {
    type: Boolean,
  },
  hasFooter: {
    type: Boolean,
  },
  setHasFooterToolbar: {
    type: Function as PropType<(bool: boolean) => void>,
  },
};

export const defaultRouteContext: RouteContextProps = {

};

export const contextKey: InjectionKey<RouteContextProps> = Symbol();

export const useContext = () => {
  return inject(contextKey, defaultRouteContext);
};

export const RouteContextProvider = defineComponent({
  name: 'RouteContextProvider',
  props: routeContextProps,
  setup(props, { slots }: SetupContext) {
    // const route = useRoute();
    // if (route === undefined) {
    //   console.info('route not used')
    // }
    // const route = useRoute();

    const routeContext = reactive({
      ...toRefs(props),
      // ...toRefs(route),
    });
    provide(contextKey, routeContext);

    return () => slots.default && slots.default();
  },
});

export interface IRouteContext<T> {
  provider: (props: any, ctx: any) => VNode<RendererNode, RendererElement, {
    [key: string]: any;
  }>
  state: UnwrapRef<T> | T;
}

export const createContext = (context: RouteContextProps): IRouteContext<RouteContextProps> => {
  const state = reactive<RouteContextProps>({
    ...context,
  });

  const Provider = (_, ctx) => {
    return h(RouteContextProvider, state, ctx.slots)
  }

  return {
    provider: Provider,
    state,
  };
}

export default RouteContextProvider;
