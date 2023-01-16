// fork & types
// https://github.com/vueComponent/pro-components/blob/next/packages/pro-layout/src/hooks/context/index.ts
import { provide, inject, readonly, defineComponent } from 'vue';
import type { DefineComponent, VNode, PropType, InjectionKey } from 'vue';

export type CreateContext<T> = DefineComponent<{ value: T }, () => VNode | VNode[] | undefined, any>;

export const createContext = <T>(contextInjectKey: InjectionKey<T> = Symbol(), componentName = 'ContextProvider') =>
  defineComponent({
    name: componentName,
    props: {
      value: {
        type: Object as PropType<T>,
        required: true,
      },
    },
    setup(props, { slots }) {
      provide(contextInjectKey, readonly(props.value as Record<string, unknown>) as T);
      return () => slots.default?.();
    },
  }) as CreateContext<T>;

export const useContext = <T>(contextInjectKey: string | InjectionKey<T> = Symbol(), defaultValue?: T) =>
  inject<T>(contextInjectKey, defaultValue ?? ({} as T));

// :: examples ::
// import { defineComponent, InjectionKey, isReactive, reactive, toRefs } from 'vue'
//
// interface CustomContext {
//     param1?: string
//     param2?: boolean
//     someData?: string[]
// }
//
// const contextKey: InjectionKey<CustomContext> = Symbol()
//
// const ContextProvider = createContext<CustomContext>(contextKey)
//
// const ContextConsumer = defineComponent({
//     setup() {
//         const state = useContext<CustomContext>(contextKey, {
//             param1: 'param1',
//             param2: true,
//             someData: ['param1', 'param2']
//         })
//         return () => JSON.stringify(state)
//     }
// })
//
// export default defineComponent({
//     setup() {
//         const state = reactive<CustomContext>({
//             param1: 'param111',
//             param2: false,
//             someData: ['param111', 'param222']
//         })
//
//         return () => (
//             <>
//                 <ContextConsumer />
//                 <ContextProvider value={state}>
//                     <ContextConsumer />
//                 </ContextProvider>
//             </>
//         )
//     }
// })
