import { defineComponent, shallowReactive, watch, watchEffect } from 'vue';
import { useSharedContext } from '../../store/Provider';
import { Dropdown, Menu, Tooltip } from 'ant-design-vue';
import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import type { SizeType } from '../../typings';

const { Item } = Menu;

import 'ant-design-vue/es/dropdown/style';
import 'ant-design-vue/es/menu/style';
import 'ant-design-vue/es/tooltip/style';

const Density = defineComponent({
  setup() {
    const { size, setSize, getMessage: t } = useSharedContext();

    const state = shallowReactive<{
      selectedKeys: [SizeType];
    }>({
      selectedKeys: [size],
    });

    watchEffect(() => {
      state.selectedKeys = [size];
    });

    watch(
      () => state.selectedKeys,
      selectedKeys => {
        setSize?.(selectedKeys[0]);
      },
    );

    return () => (
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu selectable style={{ width: '80px' }} v-model:selectedKeys={state.selectedKeys}>
            <Item key="large">{t('tableToolBar.densityLarger', '默认')}</Item>
            <Item key="middle">{t('tableToolBar.densityMiddle', '中等')}</Item>
            <Item key="small">{t('tableToolBar.densitySmall', '紧凑')}</Item>
          </Menu>
        }
      >
        <Tooltip title={t('tableToolBar.density', '表格密度')}>
          <ColumnHeightOutlined />
        </Tooltip>
      </Dropdown>
    );
  },
});

export default Density;
