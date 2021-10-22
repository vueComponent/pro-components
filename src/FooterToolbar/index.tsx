import './index.less';

import { computed, defineComponent, onBeforeUnmount, onMounted, unref, PropType } from 'vue';
import { RouteContextProps, useRouteContext } from '../RouteContext';
import { getPropsSlotfn } from '../utils';
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
    type: [Function, Object, Boolean] as PropType<FooterToolbarProps['extra']>,
  },
  renderContent: {
    type: [Function, Object, Boolean] as PropType<FooterToolbarProps['renderContent']>,
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
    const context = useRouteContext();
    const baseClassName = props.prefixCls || context.getPrefixCls('footer-bar');

    const hasFlatMenu = computed(() => {
      return unref(context.flatMenuData).length > 0;
    });
    const width = computed(() => {
      const { isMobile, hasSide, siderWidth, layout } = context;
      if (!siderWidth || layout === 'top') {
        return '100%';
      }
      console.log(
        'x',
        unref(siderWidth),
        'hasFlatMenu',
        unref(hasFlatMenu),
        'hasSide',
        unref(context.hasSide),
      );
      if (!hasFlatMenu.value && !unref(hasSide)) {
        return '100%';
      }
      console.log('x2', unref(context.hasSide));
      return isMobile ? '100%' : `calc(100% - ${siderWidth}px)`;
    });

    onMounted(() => {
      context.setHasFooterToolbar && context.setHasFooterToolbar(true);
    });
    onBeforeUnmount(() => {
      context.setHasFooterToolbar && context.setHasFooterToolbar(false);
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
                  ...context,
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
