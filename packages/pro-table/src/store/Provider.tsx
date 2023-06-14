import { createContext, useContext } from '../hooks';
import type { InjectionKey } from 'vue';
import type { ActionType, MaybeElementRef, SizeType, ColumnState } from '../typings';

import { zhCN } from '../locale';

export interface Context {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  getMessage: (id: string, defaultMessage: string) => string;
  actionRef?: ActionType;
  containerRef?: MaybeElementRef;
  size?: SizeType;
  setSize?: (size: SizeType) => void;
  columnsMap?: Record<string, ColumnState>;
  setColumnsMap?: (columnsMap: Record<string, ColumnState>) => void;
}

export const defaultPrefixCls = 'ant-pro-table';

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
};

export const defaultContext: Context = {
  getPrefixCls,
  getMessage: (id: string, defaultMessage?: string) => {
    return ((zhCN as Record<string, unknown>)[id] as string) ?? defaultMessage;
  },
};

export const contextInjectKey: InjectionKey<Context> = Symbol('context');

const Provider = createContext<Context>(contextInjectKey, 'SharedContextProvider');

export const useSharedContext = () => {
  return useContext<Context>(contextInjectKey, defaultContext);
};

export default Provider;
