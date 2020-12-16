import { createApp, defineComponent, ref, reactive, toRaw, onMounted } from 'vue';
import { Card, Space, Button } from 'ant-design-vue';
import { createRouteContext, useRouteContext, RouteContextProps } from '../src/RouteContext';

import 'ant-design-vue/dist/antd.less';

const DemoComponent = {
  setup() {
    const state = reactive({
      name: 'value',
    });
    const context = reactive<RouteContextProps>({
      menuData: [],
      selectedKeys: [],
      openKeys: [],
      collapsed: false,
    });

    const [ RouteContextProvider ] = createRouteContext();

    return () => (
      <div class="components">
        <h2># Template</h2>
        <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                state.name = new Date().getTime().toString()
                context.collapsed = !context.collapsed
                context.menuData = [
                  {
                    path: `/dashboard/${state.name}`,
                    name: `${state.name}`,
                    meta: { title: `custom title - ${state.name}` },
                  }
                ]
              }}
            >
              Change Value
            </Button>
          </Space>
          <div style={{ margin: '12px 0' }}>
            <p>state.name: { JSON.stringify(state.name) }</p>
            routeContext:
            <pre>{  JSON.stringify(context, null, 4) }</pre>
          </div>
        </Card>
        <div class="demo" style="background: rgb(244,244,244);">
          <RouteContextProvider value={context}>
            <TestChildComponent />
          </RouteContextProvider>
        </div>
      </div>
    );
  },
};

const TestChildComponent = defineComponent({
  setup () {
    const routeContext = useRouteContext();
    console.log('TestChildComponent.routeContext', routeContext);

    return () => {
      const { menuData, collapsed } = routeContext
      return (
        <div class="test-child-component">
          menuData:
          <pre>
            {JSON.stringify(menuData, null, 4)}
          </pre>
          <p>
            collapsed: {collapsed.toString()}
          </p>
        </div>
      )
    }
  }
});

const app = createApp(DemoComponent);

app.mount('#__vue-content>div');
