import { FunctionalComponent, CSSProperties, toRefs } from 'vue';
import { useProProvider } from '../ProProvider';
import { PureSettings } from '../defaultSettings';
import './GridContent.less';

interface GridContentProps {
  contentWidth?: PureSettings['contentWidth'];
  prefixCls?: string;
  style?: CSSProperties;
}

const GridContent: FunctionalComponent<GridContentProps> = (
  props,
  { slots },
) => {
  const proConfig = useProProvider();
  const { contentWidth, getPrefixCls } = toRefs(proConfig);
  const customPrefixCls = props.prefixCls || getPrefixCls.value();
  const customContentWidth = props.contentWidth || contentWidth.value;
  return (
    <div
      class={{
        [`${customPrefixCls}-grid-content`]: true,
        wide: customContentWidth === 'Fixed',
      }}
    >
      <div class={`${customPrefixCls}-grid-content-children`}>{slots.default?.()}</div>
    </div>
  );
};

export default GridContent;
