import {
  ref,
  reactive,
  watch,
  provide,
  inject,
  InjectionKey,
  Ref,
  WatchStopHandle,
  toRefs,
  ToRefs,
} from 'vue';

export interface MenuState {
  collapsed?: boolean | false;
  selectedKeys?: string[];
  openKeys?: string[];
}

export type MenuHandles = {
  setCollapsed: (collapsed: boolean) => void;
  setSelectedKeys: (selectedKeys: string[]) => void;
  setOpenKeys: (openKeys: string[]) => void;
};

export type MenuStated = Required<MenuState>;

export type MenuStateWatched = [MenuStated, MenuHandles, WatchStopHandle];

export const MenuStateKey: InjectionKey<ToRefs<MenuStated> & MenuHandles> = Symbol('menu-state');

export function useMenu({ collapsed = false, openKeys = [], selectedKeys = [] }: MenuState) {
  const cacheKeys: Ref<string[]> = ref([] as string[]);
  const state = reactive<MenuStated>({
    collapsed,
    selectedKeys,
    openKeys,
  });

  const setCollapsed = (collapsed = false) => {
    state.collapsed = collapsed;
  };
  const setSelectedKeys = (selectedKeys: string[]) => {
    state.selectedKeys = selectedKeys;
  };
  const setOpenKeys = (openKeys: string[]) => {
    state.openKeys = openKeys;
  };

  provide(MenuStateKey, {
    ...toRefs(state),
    setCollapsed,
    setSelectedKeys,
    setOpenKeys,
  });

  const watchRef = watch(
    () => state.collapsed,
    collapsed => {
      if (collapsed) {
        cacheKeys.value = state.openKeys.concat();
        state.openKeys = [];
      } else {
        state.openKeys = cacheKeys.value.concat();
      }
    },
  );

  return [state, { setCollapsed, setSelectedKeys, setOpenKeys }, watchRef] as MenuStateWatched;
}

export function useMenuState(): Readonly<ToRefs<MenuStated>> & MenuHandles {
  return inject(MenuStateKey);
}
