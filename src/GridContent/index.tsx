import './GridContent.less';

import { SetupContext, CSSProperties } from 'vue'
import { PureSettings } from '../defaultSettings';

interface GridContentProps {
  contentWidth?: PureSettings['contentWidth'];
  prefixCls?: string;
  style?: CSSProperties;
}

const GridContent = ({ prefixCls = 'ant-pro', contentWidth }: GridContentProps, { slots }: SetupContext) => {
  return (
    <div
      class={{
        [`${prefixCls}-grid-content`]: true,
        wide: contentWidth === 'Fixed',
      }}
    >
      <div class={`${prefixCls}-grid-content-children`}>{slots.default && slots.default()}</div>
    </div>
  );
};

export default GridContent;
