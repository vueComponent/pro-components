import { FunctionalComponent, CSSProperties } from 'vue';
import { useProProvider } from '../ProProvider';
import { PureSettings } from '../defaultSettings';
import './GridContent.less';

export interface GridContentProps {
  contentWidth?: PureSettings['contentWidth'];
  prefixCls?: string;
  style?: CSSProperties;
}

const GridContent: FunctionalComponent<GridContentProps> = (props, { slots }) => {
  const { contentWidth, getPrefixCls } = useProProvider();
  const customPrefixCls = props.prefixCls || getPrefixCls();
  const customContentWidth = props.contentWidth || contentWidth;
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
