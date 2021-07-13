import { Slots } from 'vue';
import type { RouteRecord, RouteRecordRaw } from 'vue-router';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { MenuDataItem } from '../typings';

export { default as isUrl } from './isUrl';
export { default as isImg } from './isImg';
export { default as isNil } from './isNil';
export { PropTypes };

export function warn(valid: boolean, message: string) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error(`Warning: ${message}`);
  }
}

export function warning(valid: boolean, message: string) {
  warn(valid, `[@ant-design-vue/pro-layout] ${message}`);
}

export function clearMenuItem(menusData: RouteRecord[] | RouteRecordRaw[]): RouteRecordRaw[] {
  return menusData
    .map((item: RouteRecord | RouteRecordRaw) => {
      const finalItem = { ...item };
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null;
      }

      if (finalItem && finalItem?.children) {
        if (
          !finalItem.meta?.hideChildInMenu &&
          finalItem.children.some(
            (child: RouteRecord | RouteRecordRaw) => child && child.name && !child.meta?.hideInMenu,
          )
        ) {
          return {
            ...item,
            children: clearMenuItem(finalItem.children),
          };
        }
        delete finalItem.children;
      }
      return finalItem;
    })
    .filter(item => item) as RouteRecordRaw[];
}

export function flatMap(menusData: RouteRecord[]): MenuDataItem[] {
  return menusData
    .map(item => {
      const finalItem = { ...item } as MenuDataItem;
      if (!finalItem.name || finalItem.meta?.hideInMenu) {
        return null;
      }
      if (finalItem.children) {
        delete finalItem.children;
      }
      return finalItem;
    })
    .filter(item => item) as any[];
}

export function getMenuFirstChildren(menus: MenuDataItem[], key?: string) {
  return key === undefined
    ? []
    : (menus[menus.findIndex(menu => menu.path === key)] || {}).children || [];
}

export function getPropsSlot(slots: Slots, props: Record<string, any>, prop = 'default') {
  return props[prop] || slots[prop]?.();
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
