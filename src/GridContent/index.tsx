import './GridContent.less';

import { FunctionalComponent, SetupContext, CSSProperties } from 'vue';
import { PureSettings } from '../defaultSettings';

interface GridContentProps {
  contentWidth?: PureSettings['contentWidth'];
  prefixCls?: string;
  style?: CSSProperties;
}

const GridContent: FunctionalComponent<GridContentProps> = (
  { prefixCls = 'ant-pro', contentWidth },
  { slots }: SetupContext,
) => {
  return (
    <div
      class={{
        [`${prefixCls}-grid-content`]: true,
        wide: contentWidth === 'Fixed',
      }}
    >
      <div class={`${prefixCls}-grid-content-children`}>{slots.default?.()}</div>
    </div>
  );
};

export default GridContent;
