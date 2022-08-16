import type { SetupContext } from 'vue';
import type { UseTableFromState } from './useQueryFilterState';

type UseTableFormMethodsParams = {
  slots: SetupContext['slots'];
  state: UseTableFromState;
};

export function useTableFormMethods({ slots, state }: UseTableFormMethodsParams) {
  console.log(slots, state);
}
