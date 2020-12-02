import { VNodeChild } from 'vue';

// define global types
export type RenderVNodeType = VNodeChild | Element | JSX.Element;

export type MenuTheme = 'dark' | 'light';

export type LayoutType = 'side' | 'top' | 'mix';

export type TargetType = '_blank' | '_self' | unknown;

export type ContentWidth = 'Fluid' | 'Fixed';

export interface MetaRecord {
  icon?: string | VNodeChild | JSX.Element;
  title?: string;
  authority?: string | string[];
  target?: '_blank' | '_self' | string;
  [key: string]: any;
}

export interface RouteProps {
  key?: string | symbol;
  path: string;
  name?: string | symbol;
  meta?: MetaRecord;
  target?: TargetType;
  hidden?: boolean;
  children?: RouteProps[];
}

export type WithFalse<T> = T | false;

export type FormatMessage = (message: string) => string;
