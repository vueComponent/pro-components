import * as Icons from '@ant-design/icons-vue/es';
import type { App } from 'vue';
import type { IconType } from '@ant-design/icons-vue/es/components/Icon';

type AllIcon = {
  [key: string]: IconType;
};

export const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor'];

export default (app: App) => {
  const allIcon: AllIcon = Icons as any;
  Object.keys(Icons)
    .filter((k) => !filterIcons.includes(k))
    .forEach((k) => {
      app.component(allIcon[k].displayName, allIcon[k]);
    });
};
