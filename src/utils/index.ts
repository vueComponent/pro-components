import { Slots, VNodeChild } from 'vue';
import { MenuDataItem } from '../typings';
export { getComponent } from 'ant-design-vue/es/_util/props-util';
export { default as PropTypes } from 'ant-design-vue/es/_util/vue-types';

export { default as isUrl } from './isUrl';
export { default as isImg } from './isImg';
export { default as isNil } from './isNil';

export function getComponentOrSlot(props: any, slots: Slots, name: string): VNodeChild {
  const comp = props[name] || slots[name];
  return typeof comp === 'function' ? comp() : (comp && (comp as VNodeChild)) || false;
}

export function warn(valid: boolean, message: string) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`Warning: ${message}`);
  }
}

export function warning(valid: boolean, message: string) {
  warn(valid, `[@ant-design-vue/pro-layout] ${message}`);
}

export function clearMenuItem(menusData: MenuDataItem[]): MenuDataItem[] {
  return menusData
    .map(item => {
      const finalItem = { ...item };
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null;
      }

      if (finalItem && finalItem?.children) {
        if (
          !finalItem.meta?.hideChildInMenu &&
          finalItem.children.some(child => child && child.name && !child.meta?.hideInMenu)
        ) {
          return {
            ...item,
            children: clearMenuItem(finalItem.children),
          };
        }
        delete finalItem.children;
      }
      console.log('finalItem', finalItem);
      return finalItem;
    })
    .filter(item => item) as MenuDataItem[];
}

export function flatMap(menusData: MenuDataItem[]): MenuDataItem[] {
  return menusData
    .map(item => {
      const finalItem = { ...item };
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null;
      }
      delete finalItem.children;
      return finalItem;
    })
    .filter(item => item);
}

export function getMenuFirstChildren(menus: MenuDataItem[], key: string) {
  return (menus[menus.findIndex(menu => menu.path === key)] || {}).children || [];
}

export const PropRenderType = {
  type: [Function, Boolean],
  default: () => undefined,
};

export interface Attrs {
  [key: string]: string;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export type EventHandlers<E> = {
  [K in StringKeyOf<E>]?: E[K] extends Function ? E[K] : (payload: E[K]) => void;
};
