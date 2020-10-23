import { FunctionalComponent, ref, toRefs } from 'vue';
import { Layout } from 'ant-design-vue';
import { useProProvider } from './ProProvider';
import { ContentWidth } from './typings';

const { Content } = Layout;

export interface WrapContentProps {
  isChildrenLayout?: boolean;
  location?: string | string[] | any;
  contentHeight?: number;
  contentWidth?: ContentWidth;
}

export const WrapContent: FunctionalComponent<WrapContentProps> = (props, { slots }) => {
  const { getPrefixCls } = toRefs(useProProvider());
  const prefixCls = getPrefixCls.value('basicLayout');
  const classNames = ref({
    [`${prefixCls}-content`]: true,
    [`${prefixCls}-has-header`]: true,
  });

  return <Content class={classNames.value}>{slots.default?.()}</Content>;
};

export default WrapContent;
