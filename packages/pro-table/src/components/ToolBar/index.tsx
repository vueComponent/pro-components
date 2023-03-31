import { useSharedContext } from '../../store/Provider';
import ListToolBar, { type ListToolBarSetting, type ListToolBarProps } from '../ListToolBar';
import { ReloadOutlined } from '@ant-design/icons-vue';
import Density from './Density';
import ColumnSetting from './ColumnSetting';
import Fullscreen from './Fullscreen';
import type { FunctionalComponent, VNode } from 'vue';
import type { InputProps } from 'ant-design-vue';
import type { WithFalse } from '../../typings';

import './index.less';
import type { ColumnsType } from 'ant-design-vue/es/table';

export interface ActionType {
  reload: (resetPageIndex?: boolean) => Promise<void>;
  fullScreen?: () => void;
}

export type OptionsFunctionType = (e: MouseEvent, action?: ActionType) => void;

export type OptionsType = OptionsFunctionType | boolean;

export type OptionsKey = keyof OptionConfig;

export type OptionSearchProps = InputProps & { name?: string } & {
  /** 如果 onSearch 返回一个false，直接拦截请求 */
  onSearch?: (keyword: string) => boolean | undefined;
};

// TODO: search
export type OptionConfig = Partial<{
  density: boolean;
  fullScreen: OptionsType;
  reload: OptionsType;
  setting: boolean;
  search: OptionSearchProps | boolean;
}>;

export type ToolBarProps = {
  columns?: ColumnsType;
  options?: WithFalse<OptionConfig>;
  toolbar?: WithFalse<ListToolBarProps>;
};

const ToolBar: FunctionalComponent<ToolBarProps> = ({ columns = [], toolbar, options: propsOptions }, { slots }) => {
  const { actionRef, getMessage: t } = useSharedContext();

  if (toolbar === false) return null;

  const defaultOptions: OptionConfig = {
    reload: true,
    density: true,
    setting: true,
  };

  const options = propsOptions ?? defaultOptions;

  const catalog: Record<string, ListToolBarSetting | VNode> = {
    reload: {
      icon: <ReloadOutlined />,
      tooltip: t('tableToolBar.reload', '刷新'),
      onClick: () => actionRef?.reload(),
    },
    density: <Density />,
    setting: <ColumnSetting columns={columns} />,
    fullScreen: <Fullscreen />,
  };

  const settings = options
    ? Object.keys(options)
        .filter(key => options[key as unknown as keyof OptionConfig])
        .map(key => catalog[key])
    : [];

  return <ListToolBar settings={settings} {...toolbar} v-slots={slots} />;
};

export default ToolBar;
