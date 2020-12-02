export { getComponent } from 'ant-design-vue/es/_util/props-util';

export { default as isUrl } from './isUrl';
export { default as isImg } from './isImg';
export { default as isNil } from './isNil';

export function warn(valid: boolean, message: string) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`Warning: ${message}`);
  }
}

export function warning(valid: boolean, message: string) {
  warn(valid, `[@ant-design-vue/pro-layout] ${message}`);
}

export interface Attrs {
  [key: string]: string;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export type EventHandlers<E> = {
  [K in StringKeyOf<E>]?: E[K] extends Function ? E[K] : (payload: E[K]) => void;
};
