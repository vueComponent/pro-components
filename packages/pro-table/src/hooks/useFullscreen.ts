import { ref, onUnmounted } from 'vue';
import screenfull from 'screenfull';
import type { MaybeElementRef } from '../typings';
import type { Ref, ComponentPublicInstance } from 'vue';

type TargetValue<T> = T | undefined | null;

type TargetType = ComponentPublicInstance | HTMLElement | Element | Window | Document;

type BasicTarget<T extends TargetType = HTMLElement> = (() => TargetValue<T>) | TargetValue<T> | Ref<TargetValue<T>>;

interface Options {
  onExitFull?: () => void;
  onFull?: () => void;
}

const getTargetElement = <T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) => {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetValue<T>;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('value' in target) {
    targetElement = target.value;
  } else {
    targetElement = target;
  }

  if (targetElement && '$el' in targetElement) {
    return targetElement.$el;
  }

  return targetElement;
};

export const useFullscreen = (target: MaybeElementRef, options?: Options) => {
  const isFullscreen = ref<boolean>(false);

  const { onFull, onExitFull } = options || {};

  const onFullRef = ref(onFull);
  const onExitFullRef = ref(onExitFull);

  const onChange = () => {
    if (screenfull.isEnabled) {
      const el = getTargetElement(target);

      if (!screenfull.element) {
        onExitFullRef.value?.();
        isFullscreen.value = false;
        screenfull.off('change', onChange);
      } else {
        if (screenfull.element === el) {
          onFullRef.value?.();
        } else {
          onExitFullRef.value?.();
        }
        isFullscreen.value = screenfull.element === el;
      }
    }
  };

  const enter = () => {
    const el = getTargetElement(target);
    if (!el) return;

    if (screenfull.isEnabled) {
      try {
        screenfull.request(el);
        screenfull.on('change', onChange);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const exit = () => {
    if (!isFullscreen.value) {
      return;
    }
    if (screenfull.isEnabled) {
      try {
        screenfull.exit();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggle = () => {
    if (isFullscreen.value) {
      exit();
    } else {
      enter();
    }
  };

  onUnmounted(() => {
    if (screenfull.isEnabled) {
      screenfull.off('change', onChange);
    }
  });

  return { isFullscreen, enter, exit, toggle };
};
