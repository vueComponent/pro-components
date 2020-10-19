import {
  defineComponent,
  h,
  InjectionKey,
  provide,
  inject,
  reactive,
  RendererElement,
  RendererNode,
  SetupContext,
  toRefs,
  UnwrapRef,
  VNode,
  PropType,
  DefineComponent,
} from 'vue';

export type ContextType<T> = any;

// VNode<RendererNode, RendererElement, {
//     [key: string]: any;
//   }>

/**
 (props: any, ctx: SetupContext) => DefineComponent<{}, () => VNode<RendererNode, RendererElement, {
    [key: string]: any;
  }>>;
 */
export interface CreateContext<T> {
  provider: DefineComponent<{}, () => VNode | VNode[]>;
  state: UnwrapRef<T> | T;
}

const RouteContextProvider = defineComponent({
  name: 'RouteContextProvider',
  inheritAttrs: false,
  props: {
    contextInjectKey: {
      type: [Object, String, Symbol] as PropType<InjectionKey<any>>,
      required: true,
    },
  },
  setup(props, { slots, attrs }: SetupContext) {
    console.log('props', props, attrs);
    const context = reactive({
      ...attrs,
    });
    provide(props.contextInjectKey, context);

    return () => slots.default();
  },
});

export const createContext = <T>(context: ContextType<T>,
                                 contextInjectKey: InjectionKey<ContextType<T>> = Symbol()
                                ): CreateContext<T> => {

  const state = reactive<ContextType<T>>({
    ...context,
  });

  const ContextProvider = defineComponent( {
    name: 'ContextProvider',
    inheritAttrs: false,
    setup(props, { slots }: SetupContext) {
      provide(contextInjectKey, state);
      return () => slots.default();
    },
  })

  return {
    state,
    provider: ContextProvider,
  };
};

export const useContext = <T>(contextInjectKey: InjectionKey<ContextType<T>> = Symbol(), defaultValue?: ContextType<T>): T => {
  return inject(contextInjectKey, defaultValue || {} as T)
}

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
