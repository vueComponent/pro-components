import { FunctionalComponent, computed, toRefs, CSSProperties } from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { useRouteContext } from './RouteContext';
import type { ContentWidth } from './typings';

const { Content } = Layout;

export interface WrapContentProps {
  style?: CSSProperties;
  class?: string | string[] | object;
  isChildrenLayout?: boolean;
  location?: string | string[] | any;
  contentHeight?: number;
  contentWidth?: ContentWidth;
}

export const WrapContent: FunctionalComponent<WrapContentProps> = (props, { slots, attrs }) => {
  const { getPrefixCls } = toRefs(useRouteContext());
  const prefixCls = getPrefixCls.value('basicLayout');
  const classNames = computed(() => {
    return {
      [`${prefixCls}-content`]: true,
      [`${prefixCls}-has-header`]: true,
    };
  });

  return (
    <Content class={classNames.value} {...attrs}>
      {slots.default?.()}
    </Content>
  );
};

WrapContent.inheritAttrs = false;
