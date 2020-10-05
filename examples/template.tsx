import { createApp, reactive, watchEffect } from 'vue';
import { Card, Space, Button, Tag } from 'ant-design-vue';

import 'ant-design-vue/dist/antd.less';

const DemoComponent = {
  setup() {
    const state = reactive({
      name: 'value',
    });

    return () => (
      <div class="components">
        <h2># Template</h2>
        <Card style={{ marginBottom: '24px', background: 'rgb(244,244,244)' }}>
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => {
                state.name = new Date().getTime().toString()
              }}
            >
              Change Value
            </Button>

          </Space>
          <div style={{ margin: '12px 0' }}>
            <p>state.name: { JSON.stringify(state.name) }</p>
          </div>
        </Card>
        <div class="demo" style="background: rgb(244,244,244);">
          <div class="container" style="width: 256px;">
            demo in here.<br />
            <Tag color="pink">{state.name}</Tag>
          </div>
        </div>
      </div>
    );
  },
};

const app = createApp(DemoComponent);

app.mount('#__vue-content>div');
