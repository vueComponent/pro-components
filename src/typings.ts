import { VNodeChild } from 'vue';
import a from 'ant-design-vue/types/menu/menu';

export type MenuTheme = 'dark' | 'light';

export type LayoutType = 'side' | 'top' | 'mix';

export type TargetType = '_blank' | '_self' | unknown;

export type ContentWidth = 'Fluid' | 'Fixed';

export interface MetaRecord {
  icon?: string | VNodeChild | JSX.Element;
  title?: string;
  authority?: string | string[];
  [key: string]: any;
}

export interface RouteProps {
  key?: string | symbol;
  path: string;
  name?: string | symbol;
  meta?: MetaRecord | {};
  target?: TargetType;
  hidden?: boolean;
  children?: RouteProps[];
}

export type WithFalse<T> = T | false;
