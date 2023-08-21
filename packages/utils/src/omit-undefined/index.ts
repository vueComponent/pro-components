type OmitUndefined<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export const omitUndefined = <T>(obj: T): OmitUndefined<T> => {
  const newObj = {} as T
  Object.keys(obj || {}).forEach((key) => {
    if ((obj as any)[key] !== undefined) {
      ;(newObj as any)[key] = (obj as any)[key]
    }
  })
  if (Object.keys(newObj as Record<string, any>).length < 1) {
    return undefined as any
  }
  return newObj as OmitUndefined<T>
}
