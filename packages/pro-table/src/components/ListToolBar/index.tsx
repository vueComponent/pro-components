import { isVNode } from 'vue';
import { useSharedContext } from '../../store/Provider';
import { Space, Tooltip } from 'ant-design-vue';
import { getSlotVNode } from '@ant-design-vue/pro-utils';
import type { FunctionalComponent, VNode } from 'vue';
import type { WithFalse } from '../../typings';

import './index.less';

export type ListToolBarSetting = {
  icon: JSX.Element;
  tooltip?: string;
  key?: string;
  onClick?: (key?: string) => void;
};

type SettingPropType = ListToolBarSetting | VNode;

export type ListToolBarProps = {
  // title: VNodeChild;
  // subTitle: VNodeChild;
  // description: VNodeChild;
  actions?: WithFalse<VNode[]>;
  settings?: WithFalse<SettingPropType[]>;
};

const getSettingItem = (setting: SettingPropType) => {
  if (isVNode(setting)) return setting;
  const { icon, tooltip, key, onClick } = setting;
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span key={key} onClick={() => onClick?.(key)}>
          {icon}
        </span>
      </Tooltip>
    );
  }
  return <icon />;
};

const getSettingItems = (settings: SettingPropType[], className: string) => {
  if (!settings.length) return null;
  return (
    <Space align="center" size={12} class={`${className}-setting-items`}>
      {settings.map((setting, index) => {
        const settingItem = getSettingItem(setting);
        return (
          <div key={index} class={`${className}-setting-item`}>
            {settingItem}
          </div>
        );
      })}
    </Space>
  );
};

const ListToolBar: FunctionalComponent<ListToolBarProps> = (props, { slots }) => {
  const { getPrefixCls } = useSharedContext();

  const className = getPrefixCls('list-toolbar');

  const actions = getSlotVNode<VNode[]>(slots, props, 'actions');

  const settings = getSlotVNode<SettingPropType[]>(slots, props, 'settings');

  const settingItems = settings && getSettingItems(settings, className);

  // TODO: ListToolBarTabBar
  return (
    <div class={className}>
      <div class={`${className}-container`}>
        <div class={`${className}-left`}></div>
        <Space class={`${className}-right`} align="center" direction="horizontal" size={16}>
          {actions}
          {settingItems}
        </Space>
      </div>
    </div>
  );
};

export default ListToolBar;
