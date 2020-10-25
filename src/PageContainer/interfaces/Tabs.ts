import { VNodeChild, CSSProperties } from 'vue';

export interface TabsProps {
  prefixCls?: string;
  class?: string | string[];
  style?: CSSProperties;
  id?: string;

  activeKey?: string;
}

export type TabBarExtraPosition = 'left' | 'right';

export type TabBarExtraMap = Partial<Record<TabBarExtraPosition, VNodeChild>>;

export type TabBarExtraContent = VNodeChild | TabBarExtraMap;
