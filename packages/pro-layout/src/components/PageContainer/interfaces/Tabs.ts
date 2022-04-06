import type { VNodeChild, CSSProperties } from 'vue';

export type TabBarType = 'line' | 'card' | 'editable-card';
export type TabSize = 'default' | 'large' | 'small';
export type TabPosition = 'left' | 'right';
export type TabBarExtraPosition = TabPosition;

export type TabBarExtraMap = Partial<Record<TabBarExtraPosition, VNodeChild>>;

export type TabBarExtraContent = VNodeChild | TabBarExtraMap;

export interface TabsProps {
  prefixCls?: string;
  class?: string | string[];
  style?: CSSProperties;
  id?: string;

  activeKey?: string;
  hideAdd?: boolean;
  // Unchangeable
  // size?: TabSize;
  tabBarStyle?: CSSProperties;
  tabPosition?: TabPosition;
  type?: TabBarType;
  tabBarGutter?: number;
}
