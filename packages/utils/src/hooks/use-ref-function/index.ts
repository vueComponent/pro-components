import { shallowRef } from 'vue'

const useRefFunction = <T extends (...args: any) => any>(reFunction: T) => {
  const ref = shallowRef<any>(null)
  ref.value = reFunction
  return (...rest: Parameters<T>): ReturnType<T> => {
    return ref.value?.(...(rest as any))
  }
}

export { useRefFunction }
