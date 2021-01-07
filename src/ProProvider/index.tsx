import {
  App,
  defineComponent,
  InjectionKey,
  PropType,
  provide,
  inject,
  reactive,
  readonly,
  SetupContext,
  toRefs,
} from 'vue';
import { ContentWidth } from '../typings';

export const defaultPrefixCls = 'ant-pro';

export interface ProProviderData {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  i18n: (t: string) => string;
  contentWidth: ContentWidth;
}

export const defaultProProviderProps: ProProviderData = {
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
  },
  i18n: (t: string): string => t,
  contentWidth: 'Fluid',
};

export const injectProConfigKey: InjectionKey<ProProviderData> = Symbol();

const ProProvider = defineComponent({
  name: 'ProProvider',
  props: {
    prefixCls: {
      type: String as PropType<string>,
      default: 'ant-pro',
    },
    contentWidth: {
      type: String as PropType<ContentWidth>,
      default: 'Fluid',
    },
    i18n: {
      type: Function as PropType<(t: string) => string>,
      default: (t: string): string => t,
    },
  },
  setup(props, { slots }: SetupContext) {
    const { prefixCls, i18n, contentWidth } = toRefs(props);
    const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string): string => {
      if (customizePrefixCls) return customizePrefixCls;
      return suffixCls ? `${prefixCls.value}-${suffixCls}` : prefixCls.value;
    };

    const context = reactive({
      i18n,
      contentWidth,
      getPrefixCls,
    });
    provide(injectProConfigKey, readonly(context));

    return () => slots.default?.();
  },
});

ProProvider.install = function (app: App) {
  app.component(ProProvider.name, ProProvider);
};

export const useProProvider = (): ProProviderData => {
  return inject(injectProConfigKey, defaultProProviderProps);
};

export default ProProvider;
