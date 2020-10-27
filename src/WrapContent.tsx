import { FunctionalComponent, reactive, toRefs, CSSProperties } from 'vue';
import { Layout } from 'ant-design-vue';
import { useProProvider } from './ProProvider';
import { ContentWidth } from './typings';

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
  const { getPrefixCls } = toRefs(useProProvider());
  const prefixCls = getPrefixCls.value('basicLayout');
  const classNames = reactive({
    [`${prefixCls}-content`]: true,
    [`${prefixCls}-has-header`]: true,
  });

  return (
    <Content class={classNames} {...attrs}>
      {slots.default?.()}
    </Content>
  );
};

WrapContent.inheritAttrs = false;
