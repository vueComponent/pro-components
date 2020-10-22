import {
  defineComponent,
  InjectionKey,
  provide,
  inject,
  reactive,
  readonly,
  SetupContext,
  UnwrapRef,
  VNode,
  DefineComponent,
} from 'vue';

export type ContextType<T> = any;

export interface CreateContext<T> {
  Provider: DefineComponent<{}, () => VNode | VNode[] | undefined, any>;
  state: UnwrapRef<T> | T;
}

export const createContext = <T>(context: ContextType<T>,
                                 contextInjectKey: InjectionKey<ContextType<T>> = Symbol(),
): CreateContext<T> => {

  const state = reactive<ContextType<T>>({
    ...context,
  });

  const ContextProvider = defineComponent({
    name: 'ContextProvider',
    inheritAttrs: false,
    setup(props, { slots }: SetupContext) {
      provide(contextInjectKey, readonly(state));
      return () => slots.default();
    },
  });

  return {
    state,
    Provider: ContextProvider,
  };
};

export const useContext = <T>(contextInjectKey: InjectionKey<ContextType<T>> = Symbol(), defaultValue?: ContextType<T>): T => {
  return readonly(inject(contextInjectKey, defaultValue || {} as T));
};

// :: examples ::
//
// interface MyContextProps {
//   param1: string;
//   param2: boolean;
//   someData?: string[];
// }
//
// const { state, provider } = createContext<MyContextProps>({
//   param1: 'abc',
//   param2: false,
//   someData: ['a', 'b', 'c', 'd']
// });
//
// const value = useContext<MyContextProps>();
//
// console.log('value', toRaw(value));
// console.log('param1', value.param1); // 'abc'
// console.log('param2', value.param2); // false
// console.log('someData', value.someData); // ['a', 'b', 'c', 'd']
