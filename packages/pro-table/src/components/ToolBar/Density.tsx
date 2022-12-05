import { defineComponent, shallowReactive, watchEffect, type PropType } from 'vue';
import { Dropdown, Menu, Tooltip } from 'ant-design-vue';
import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import { useSharedContext } from '../../shared/Context';
import type { SizeType } from '../../typings';

const { Item } = Menu;

import 'ant-design-vue/es/dropdown/style';
import 'ant-design-vue/es/menu/style';
import 'ant-design-vue/es/tooltip/style';

export const densityProps = {
  tableSize: {
    type: String as PropType<SizeType>,
    default: 'middle',
  },
};

const Density = defineComponent({
  props: densityProps,
  setup(props) {
    const { actionRef } = useSharedContext();

    const state = shallowReactive<{
      selectedKeys: [SizeType];
    }>({
      selectedKeys: [props.tableSize],
    });

    watchEffect(() => {
      actionRef?.changeSize?.(state.selectedKeys[0]);
    });

    // TODO: t('tableToolBar.densityLarger', '默认')
    // TODO: t('tableToolBar.densityMiddle', '中等')
    // TODO: t('tableToolBar.densitySmall', '紧凑')
    // TODO: t('tableToolBar.density', '表格密度')
    return () => (
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu selectable style={{ width: '80px' }} v-model={[state.selectedKeys, 'selectedKeys']}>
            <Item key="large">默认</Item>
            <Item key="middle">中等</Item>
            <Item key="small">紧凑</Item>
          </Menu>
        }
      >
        <Tooltip title="表格密度">
          <ColumnHeightOutlined />
        </Tooltip>
      </Dropdown>
    );
  },
});

export default Density;
