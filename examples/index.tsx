import { createApp, reactive } from 'vue';
import { Button, message } from 'ant-design-vue';
import BasicLayout from '../src/BasicLayout';
import 'ant-design-vue/dist/antd.less';

const SimpleDemo = {
  setup() {
    const state = reactive({
      collapsed: false,
    });

    return () => (
      <div className="components">
        <h2># BasicLayout</h2>
        <BasicLayout
          collapsed={state.collapsed}
          onCollapsed={collapsed => {
            state.collapsed = collapsed;
          }}
        >
          <Button
            onClick={() => {
              message.info('clicked.');
            }}
          >
            Click Me!!
          </Button>
        </BasicLayout>
      </div>
    );
  },
};

const app = createApp(SimpleDemo);

app.use(BasicLayout).mount('#__vue-content>div');
