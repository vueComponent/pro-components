import type { FunctionalComponent, VNode } from 'vue';
import ListToolBar, { type ListToolBarSetting, type ListToolBarProps } from '../ListToolBar';
import { ReloadOutlined } from '@ant-design/icons-vue';
import Density from './Density';
import ColumnSetting from './ColumnSetting';
import FullscreenIcon from './FullscreenIcon';
import { useSharedContext } from '../../shared/Context';
import type { InputProps } from 'ant-design-vue';
import type { WithFalse } from '../../typings';

import './index.less';

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
  reload: OptionsType;
  density: boolean;
  setting: boolean;
  fullScreen: OptionsType;
  search: OptionSearchProps | boolean;
}>;

export type ToolBarProps = {
  options?: WithFalse<OptionConfig>;
  toolbar?: WithFalse<ListToolBarProps>;
};

const ToolBar: FunctionalComponent<ToolBarProps> = ({ toolbar, options: propsOptions }) => {
  const { actionRef } = useSharedContext();

  if (toolbar === false) return null;

  const defaultOptions: OptionConfig = {
    reload: true,
    density: true,
    setting: true,
  };

  const options = propsOptions ?? defaultOptions;

  const catalog: Record<string, ListToolBarSetting | VNode> = {
    // TODO: t('tableToolBar.reload', '刷新')
    reload: {
      icon: <ReloadOutlined />,
      tooltip: '刷新',
      onClick: () => actionRef?.reload(),
    },
    // TODO: t('tableToolBar.density', '表格密度')
    density: <Density />,
    // TODO: t('tableToolBar.columnSetting', '列设置')
    setting: <ColumnSetting />,
    // TODO: t('tableToolBar.fullScreen', '全屏')
    fullScreen: {
      icon: <FullscreenIcon />,
      onClick: () => actionRef?.fullScreen(),
    },
  };

  const settings = options
    ? Object.keys(options)
        .filter(key => options[key as unknown as keyof OptionConfig])
        .map(key => catalog[key])
    : [];

  return <ListToolBar settings={settings} {...toolbar} />;
};

export default ToolBar;
