import type { EmitsOptions, SetupContext } from 'vue';

export type EmitFn<E = EmitsOptions> = SetupContext<E>['emit'];

export type Recordable<T = any> = Record<string, T>;
