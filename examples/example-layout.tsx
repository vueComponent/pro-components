import { defineComponent, createApp } from 'vue';
import { Layout, Menu } from 'ant-design-vue';

const View = defineComponent({
  setup() {
    return () => (
      <Layout>
        <Layout.Header>header</Layout.Header>
        <Layout>
          <Layout.Sider>
            <Menu>
              <Menu.Item>
                <span>123</span>
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout.Content>
            <div>content</div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  },
});

const app = createApp(View);

app.mount('#__vue-content>div');
