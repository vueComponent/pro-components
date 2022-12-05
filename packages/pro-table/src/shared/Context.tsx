import { reactive } from 'vue';
import { createContext, useContext } from '../hooks';
import type { InjectionKey } from 'vue';
import type { ActionType, FormatMessage, WithFalse } from '../typings';

export interface Context {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  locale?: WithFalse<FormatMessage>;
  actionRef?: ActionType;
}

export const defaultPrefixCls = 'ant-pro-table';

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
};

// set default context
export const defaultContext = reactive({
  getPrefixCls,
  locale: (t: string) => t,
});

export const contextInjectKey: InjectionKey<Context> = Symbol('context');

const Provider = createContext<Context>(contextInjectKey, 'SharedContextProvider');

export const useSharedContext = () => {
  return useContext<Context>(contextInjectKey, defaultContext);
};

export default Provider;
