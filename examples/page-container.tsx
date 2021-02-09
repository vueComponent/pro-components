import { createApp, defineComponent, reactive } from 'vue';
import 'ant-design-vue/dist/antd.less';
import { Button, Descriptions, Space, Statistic, Tag, message } from 'ant-design-vue';
import { PageContainer } from '../src/PageContainer';
import { default as ProProvider } from '../src/ProProvider';
import { createRouteContext } from '../src/RouteContext';
import { LikeOutlined } from '@ant-design/icons-vue';
import './index.less';

const App = defineComponent({
  name: 'App',
  setup: function() {
    const [ RouteContextProvider ] = createRouteContext({
      hasSideMenu: true,
      collapsed: true,
      isMobile: false,
      menuData: [],
    });
    const routes = [
      {
        path: 'index',
        breadcrumbName: 'First-level Menu',
      },
      {
        path: 'first',
        breadcrumbName: 'Second-level Menu',
      },
      {
        path: 'second',
        breadcrumbName: 'Third-level Menu',
      },
    ];

    const state = reactive({
      tabActiveKey: '2',
    });

    return () => (
      <div class="demo-page-box" style="padding: 20px; background: #ccc;">
        <ProProvider prefixCls={'ant-pro'} contentWidth={'Fixed'}>
          <RouteContextProvider value={{}}>
            <div style="background: #fff; height: 500px;">
              <PageContainer
                title="Title"
                subTitle="This is a subtitle"
                breadcrumb={{ routes }}
                onBack={() => message.info('@back click')}
                tags={['Tag 1', 'Tag 2'].map(tag => (<Tag color="blue">{tag}</Tag>))}
                extra={[
                  <Button key="3">操作</Button>,
                  <Button key="2">操作</Button>,
                  <Button key="1" type="primary">
                    主操作
                  </Button>,
                ]}
                content={
                  <Descriptions size="small" column={{ md: 2 }}>
                    <Descriptions.Item label="创建人">张三</Descriptions.Item>
                    <Descriptions.Item label="联系方式">
                      <a>421421</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
                    <Descriptions.Item label="更新时间">2017-10-10</Descriptions.Item>
                    <Descriptions.Item label="备注">中国浙江省杭州市西湖区古翠路</Descriptions.Item>
                  </Descriptions>
                }
                extraContent={
                  <Space size={24}>
                    <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
                    <Statistic title="Unmerged" value={93} suffix="/ 100" />
                  </Space>
                }
                tabList={[
                  { key: '1', tab: 'Details' },
                  { key: '2', tab: 'Rule' },
                ]}
                tabProps={{
                  type: 'card',
                }}
                tabActiveKey={state.tabActiveKey}
                onTabChange={(key: string) => {
                  state.tabActiveKey = key;
                }}
                footer={[
                  <Button key="3">重置</Button>,
                  <Button key="2" type="primary">
                    提交
                  </Button>,
                ]}
              >
                <div>Page Content</div>
              </PageContainer>
            </div>
          </RouteContextProvider>
        </ProProvider>
      </div>
    );
  },
});

const app = createApp(App);

app.mount('#__vue-content>div');
