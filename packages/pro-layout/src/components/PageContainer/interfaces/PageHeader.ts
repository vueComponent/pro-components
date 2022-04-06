import type { VNode, VNodeChild, CSSProperties } from 'vue';

export type ShapeType = 'circle' | 'square';

export type Size = 'large' | 'small' | 'default';

export interface AvatarProps {
  icon?: VNode | JSX.Element;
  shape?: ShapeType;
  size?: Size;
  src?: string;
  srcSet?: string;
  alt?: string;
  loadError?: () => boolean;
}

export interface PageHeaderProps {
  backIcon?: VNodeChild | JSX.Element;
  prefixCls?: string;
  title: string | VNodeChild | JSX.Element;
  subTitle?: string | VNodeChild | JSX.Element;
  style?: CSSProperties;
  class?: string | string[];
  breadcrumb?: Record<string, any>;
  tags?: VNodeChild | JSX.Element;
  footer?: VNodeChild | JSX.Element;
  extra?: VNodeChild | JSX.Element;
  avatar?: AvatarProps;
  onBack?: (e: MouseEvent) => void;
  ghost?: boolean;
}
