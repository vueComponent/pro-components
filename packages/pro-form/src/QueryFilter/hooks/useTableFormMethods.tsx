import type { SetupContext } from 'vue';
import type { UseTableFromState } from './useTableFromState';

type UseTableFormMethodsParams = {
  slots: SetupContext['slots'];
  state: UseTableFromState;
};

export function useTableFormMethods({ slots, state }: UseTableFormMethodsParams) {
  console.log(slots, state);
}
