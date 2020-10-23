import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  PropType,
  VNodeChild,
} from 'vue';
import { defaultProProviderProps, injectProConfigKey } from '../ProProvider';
import { RouteContextProps, useRouteContext } from '../RouteContext';
import './index.less';

export interface FooterToolbarProps {
  extra?: VNodeChild | JSX.Element;
  renderContent?: (
    props: FooterToolbarProps & RouteContextProps & { leftWidth?: string },
    dom: JSX.Element,
  ) => VNodeChild | JSX.Element;
  prefixCls?: string;
}

const FooterToolbarProps = {
  extra: { type: Object as PropType<VNodeChild> },
  renderContent: {
    type: Function as PropType<FooterToolbarProps['renderContent']>,
  },
  prefixCls: { type: String as PropType<string> },
};

const FooterToolbar = defineComponent({
  name: 'FooterToolbar',
  props: FooterToolbarProps,
  setup(props, { slots }) {
    const { getPrefixCls } = inject(injectProConfigKey, defaultProProviderProps);

    const baseClassName = computed(() => {
      const prefixCls = props.prefixCls || getPrefixCls();
      return `${prefixCls}-footer-bar`;
    });
    const routeContext = useRouteContext();
    const width = computed(() => {
      const { hasSideMenu, isMobile, sideWidth } = routeContext;
      if (!hasSideMenu) {
        return undefined;
      }
      if (!sideWidth) {
        return '100%';
      }
      return isMobile ? '100%' : `calc(100% - ${sideWidth}px)`;
    });

    const dom = () => {
      return (
        <>
          <div class={`${baseClassName.value}-left`}>{props.extra}</div>
          <div class={`${baseClassName.value}-right`}>{slots.default?.()}</div>
        </>
      );
    };
    onMounted(() => {
      routeContext.setHasFooterToolbar && routeContext.setHasFooterToolbar(true);
    });
    onBeforeUnmount(() => {
      routeContext.setHasFooterToolbar && routeContext.setHasFooterToolbar(false);
    });

    return () => (
      <div class={baseClassName.value} style={{ width: width.value }}>
        {props.renderContent
          ? props.renderContent(
              {
                ...props,
                ...routeContext,
                leftWidth: width.value,
              },
              dom(),
            )
          : dom()}
      </div>
    );
  },
});

export default FooterToolbar;
