import { ref, isRef } from 'vue';
import type { MaybeElementRef } from '../typings';

export const useFullscreen = (target?: MaybeElementRef) => {
  const isFullscreen = ref<boolean>(false);

  const elememtRef = isRef(target) ? target : ref(target);

  if (elememtRef.value instanceof HTMLElement) {
    console.log('onMounted:containerRef', elememtRef.value);
  } else {
    console.log('onMounted:containerRef', elememtRef.value ? elememtRef.value?.$el : document.body);
  }

  const enter = () => {
    console.log();
  };
  const exit = () => {
    console.log();
  };
  const toggle = () => {
    console.log();
  };

  return { isFullscreen, enter, exit, toggle };
};
