import type { FormState } from './useFormState';
import type { FormEvents } from './useFormEvents';
import type { FormMethods } from './useFormMethods';

export * from './useFormState';
export * from './useFormEvents';
export * from './useFormMethods';

export type BaseFormType = FormState & FormEvents & FormMethods;
