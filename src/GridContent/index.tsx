import './index.less';

import { FunctionalComponent, CSSProperties } from 'vue';
import { PureSettings } from '../defaultSettings';
import { useRouteContext } from '../RouteContext';

export interface GridContentProps {
  contentWidth?: PureSettings['contentWidth'];
  prefixCls?: string;
  style?: CSSProperties;
}

const GridContent: FunctionalComponent<GridContentProps> = (props, { slots }) => {
  const { contentWidth, getPrefixCls } = useRouteContext();
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
