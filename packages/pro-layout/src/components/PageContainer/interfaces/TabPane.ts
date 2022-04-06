import type { VNodeChild, CSSProperties } from 'vue';

export interface TabPaneProps {
  tab?: string | VNodeChild | JSX.Element;
  class?: string | string[];
  style?: CSSProperties;
  disabled?: boolean;
  forceRender?: boolean;
  closable?: boolean;
  closeIcon?: VNodeChild | JSX.Element;

  prefixCls?: string;
  tabKey?: string;
  id: string;
  animated?: boolean;
  active?: boolean;
  destroyInactiveTabPane?: boolean;
}
