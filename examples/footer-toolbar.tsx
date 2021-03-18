import { Button, Card, Space, Switch } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import { createApp, reactive } from 'vue';
import FooterToolbar, { FooterToolbarProps } from '../src/FooterToolbar';
import { useRouteContext } from '../src/RouteContext';

const DemoComponent = {
  setup() {
    const routeContext = useRouteContext();

    const state = reactive({
      name: '',
      toolbarProps: {
        extra: undefined,
        renderContent: undefined,
      } as FooterToolbarProps,
    });

    console.log('routeContext', routeContext);

    return () => (
      <div class="components">
        <h2># Template</h2>
        <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                state.name = new Date().getTime().toString();
                routeContext.setHasFooterToolbar(!routeContext.hasFooterToolbar);
              }}
            >
              {!routeContext.hasFooterToolbar ? 'Open' : 'Close'}
            </Button>
            <Switch
              checkedChildren="w/ extra"
              unCheckedChildren="w/o extra"
              checked={!!state.toolbarProps.extra}
              onClick={() => {
                state.name = new Date().getTime().toString();
                state.toolbarProps.extra = !state.toolbarProps.extra ? (
                  <img
                    src="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg"
                    alt="logo"
                    width="32"
                    height="32"
                  />
                ) : undefined;
              }}
            />
            <Switch
              checkedChildren="w/ renderContent"
              unCheckedChildren="w/o renderContent"
              checked={!!state.toolbarProps.renderContent}
              onClick={() => {
                state.name = new Date().getTime().toString();
                state.toolbarProps.renderContent = !state.toolbarProps.renderContent
                  ? () => 'home_toolbar'
                  : undefined;
              }}
            />
          </Space>
          <div style={{ margin: '12px 0' }}>
            state
            <pre>{JSON.stringify(state, null, 2)}</pre>
            routeContext:
            <pre>{JSON.stringify(routeContext, null, 2)}</pre>
          </div>
        </Card>
        <div>
          {routeContext.hasFooterToolbar && (
            <FooterToolbar {...state.toolbarProps}>
              <Button type="primary">right</Button>
            </FooterToolbar>
          )}
        </div>
      </div>
    );
  },
};

const app = createApp(DemoComponent);

app.mount('#__vue-content>div');
