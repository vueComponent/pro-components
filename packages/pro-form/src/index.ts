import type { App } from 'vue';

import './default.less';
import './style.less';

export {
  commonFormProps,
  baseFormProps,
  baseFormEmit,
  type BaseFormPropsType,
  type BaseFormEmit,
  type CommonFormProps,
  type BaseFromInstance,
} from './BaseForm/types';
export { BaseForm } from './BaseForm/index';

import { useFormInstance } from './BaseForm/hooks/useFormInstance';
export { useFormInstance };

export * from './components';

export { submitterProps, type SubmitterProps } from './BaseForm/components/Submitter/types';
export { Submitter } from './BaseForm/components/Submitter/index';

import { QueryFilter } from './QueryFilter/index';
export { queryFilterProps, type QueryFilterProps, type QueryFilternstance } from './QueryFilter/types';
export { QueryFilter };

import { proFormPorps, type ProFormPorps, ProForm } from './ProForm';
export { proFormPorps, type ProFormPorps, ProForm };

import * as components from './components';
export * from './components';

export const install = function (app: App) {
  if (QueryFilter.install) {
    app.use(QueryFilter);
  }
  if (ProForm.install) {
    app.use(ProForm);
  }
  Object.keys(components).forEach((key) => {
    const component = (components as any)[key];
    if (component.install) {
      app.use(component);
    }
  });
};

export default {
  install,
};
