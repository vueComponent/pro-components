import { createApp, onMounted, reactive, watch, watchEffect } from 'vue';
import { menus } from './menus';
import { MenuTheme } from '../src/typings';
import { Card, Space, Button, Switch } from 'ant-design-vue';
import BaseMenu, { useMenuState, MenuMode } from '../src/SiderMenu/BaseMenu';
import * as Icon from '@ant-design/icons-vue';

import 'ant-design-vue/dist/antd.less';

const BaseMenuDemo = {
  setup() {
    const state = reactive({
      theme: 'dark' as MenuTheme,
      mode: 'inline' as MenuMode,
      themeChecked: true,
      modeChecked: true,
    })
    const { state: menuState } = useMenuState({
      collapsed: false,
      openKeys: ['/dashboard'] as string[],
      selectedKeys: ['/dashboard/monitor'] as string[],
    })

    onMounted(() => {
      watch(() => state.themeChecked, (val) => {
        state.theme = val ? 'dark' : 'light'
      })
      watch(() => state.modeChecked, (val) => {
        state.mode = val ? 'inline' : 'horizontal'
      })
    })

    return () => (
      <div class="components">
        <h2># BaseMenu</h2>
        <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
          <Space size="middle">
            <Button
              disabled={state.mode !== 'inline'}
              type="primary"
              onClick={() => {
                menuState.collapsed = !menuState.collapsed
              }}
            >
              {menuState.collapsed ? '展开' : '收起'}
            </Button>
            <Switch checkedChildren="dark" unCheckedChildren="light" v-model={[state.themeChecked, 'checked']} />
            <Switch checkedChildren="inline" unCheckedChildren="horizontal" v-model={[state.modeChecked, 'checked']} />
          </Space>
          <div style={{ margin: '12px 0' }}>
            <p>SelectedKeys: { JSON.stringify(menuState.selectedKeys) }</p>
            <p>OpenKeys: { JSON.stringify(menuState.openKeys) }</p>
            <p>Collapsed: { JSON.stringify(menuState.collapsed) }</p>
            <p>MenuMode: { JSON.stringify(state.mode) }</p>
            <p>MenuTheme: { JSON.stringify(state.theme) }</p>
          </div>
        </Card>
        <div class="demo" style="background: rgb(244,244,244);">
          <div class="container" style="width: 256px;">
            <BaseMenu
              menus={menus}
              theme={state.theme}
              mode={state.mode}
              collapsed={menuState.collapsed}
              openKeys={menuState.openKeys}
              selectedKeys={menuState.selectedKeys}
              {...{
                'onUpdate:openKeys': $event => {
                  menuState.openKeys = $event
                },
                'onUpdate:selectedKeys': $event => {
                  menuState.selectedKeys = $event
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  },
};

const app = createApp(BaseMenuDemo);

const filterIcons = ['default', 'createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor']
Object.keys(Icon)
.filter(k => !filterIcons.includes(k))
.forEach(k => {
  app.component(Icon[k].displayName, Icon[k])
})

app.mount('#__vue-content>div');
