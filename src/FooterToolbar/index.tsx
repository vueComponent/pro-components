import './index.less';

import { computed, defineComponent, onBeforeUnmount, onMounted, PropType } from 'vue';
import { RouteContextProps, useRouteContext } from '../RouteContext';
import { getMenuFirstChildren, getPropsSlot, getPropsSlotfn } from '../utils';
import type { CustomRender } from '../typings';
export interface FooterToolbarProps {
  extra?: CustomRender | JSX.Element;
  renderContent?: (
    props: FooterToolbarProps & RouteContextProps & { leftWidth?: string },
    dom: CustomRender | JSX.Element,
  ) => CustomRender | JSX.Element;
  getContainer?: (triggerNode: HTMLElement) => HTMLElement | null;
  prefixCls?: string;
}

const footerToolbarProps = {
  extra: {
    type: Object as PropType<FooterToolbarProps['extra']>,
  },
  renderContent: {
    type: [Function, Object] as PropType<FooterToolbarProps['renderContent']>,
  },
  getContainer: {
    type: [Function, Object] as PropType<FooterToolbarProps['getContainer']>,
  },
  prefixCls: { type: String as PropType<string> },
};

const FooterToolbar = defineComponent({
  name: 'FooterToolbar',
  props: footerToolbarProps,
  setup(props, { slots }) {
    const routeContext = useRouteContext();
    const { getPrefixCls } = routeContext;
    const baseClassName = props.prefixCls || getPrefixCls('footer-bar');
    // matchMenuKeys
    const matchMenuChildrenSize = computed(
      () =>
        (
          (routeContext.menuData &&
            getMenuFirstChildren(
              routeContext.menuData,
              (routeContext.selectedKeys && routeContext.selectedKeys[0]) || undefined,
            )) ||
          []
        ).length,
    );
    const hasSide = computed(() => {
      return routeContext.layout === 'mix' && routeContext.splitMenus
        ? matchMenuChildrenSize.value > 0
        : true;
    });
    const width = computed(() => {
      const { isMobile, sideWidth, layout } = routeContext;
      if (!sideWidth || layout === 'top') {
        return '100%';
      }
      if (!hasSide.value) {
        return '100%';
      }
      return isMobile ? '100%' : `calc(100% - ${sideWidth}px)`;
    });

    onMounted(() => {
      routeContext.setHasFooterToolbar && routeContext.setHasFooterToolbar(true);
    });
    onBeforeUnmount(() => {
      routeContext.setHasFooterToolbar && routeContext.setHasFooterToolbar(false);
    });

    return () => {
      const extra = getPropsSlotfn(slots, props, 'extra');
      const dom = () => {
        return (
          <>
            <div class={`${baseClassName}-left`}>
              {typeof extra === 'function' ? extra() : extra}
            </div>
            <div class={`${baseClassName}-right`}>{slots.default?.()}</div>
          </>
        );
      };
      return (
        <div class={baseClassName} style={{ width: width.value }}>
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
    };
  },
});

export default FooterToolbar;
