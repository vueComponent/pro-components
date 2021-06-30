import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Dropdown, Menu, Tag, Descriptions } from 'ant-design-vue';
import { PageContainer, Route } from '../../src';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { i18n } from '../index';

export default defineComponent({
  setup() {
    const route = useRoute();
    return () => (
      <PageContainer
        title={route.meta.title}
        subTitle={'page sub-title'}
        breadcrumb={{
          routes: route.matched.concat().map(r => {
            return {
              path: r.path,
              breadcrumbName: i18n(r.meta?.title || ''),
            } as Route;
          }),
        }}
        tags={[<Tag color={'blue'}>Tag 1</Tag>, <Tag color={'pink'}>Tag 2</Tag>]}
        tabList={[
          {
            tab: '已选择',
            key: '1',
          },
          {
            tab: '可点击',
            key: '2',
          },
          {
            tab: '禁用',
            key: '3',
            disabled: true,
          },
        ]}
        extra={[
          <Button key="1">次要按钮</Button>,
          <Button key="2">次要按钮</Button>,
          <Button key="3" type="primary">
            主要按钮
          </Button>,
          <Dropdown
            key="dropdown"
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item key="1">下拉菜单</Menu.Item>
                <Menu.Item key="2">下拉菜单2</Menu.Item>
                <Menu.Item key="3">下拉菜单3</Menu.Item>
              </Menu>
            }
          >
            <Button key="4" style={{ padding: '0 8px' }}>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
        content={
          <Descriptions column={2} style={{ marginBottom: -16 }}>
            <Descriptions.Item label="创建人">曲丽丽</Descriptions.Item>
            <Descriptions.Item label="关联表单">
              <a>421421</a>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
            <Descriptions.Item label="单据备注">浙江省杭州市西湖区工专路</Descriptions.Item>
          </Descriptions>
        }
        extraContent={<span>额外内容区，位于 content 的右侧</span>}
        /*         v-slots={{
          tags: () => {
            return <Tag>Tag1Slot</Tag>;
          },
        }} */
        /*         v-slots={{
          extra: () => {
            return [
              <Button key="1">次要按钮</Button>,
              <Button key="2">次要按钮</Button>,
              <Button key="3" type="primary">
                主要按钮
              </Button>,
              <Dropdown
                key="dropdown"
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item key="1">下拉菜单</Menu.Item>
                    <Menu.Item key="2">下拉菜单2</Menu.Item>
                    <Menu.Item key="3">下拉菜单3</Menu.Item>
                  </Menu>
                }
              >
                <Button key="4" style={{ padding: '0 8px' }}>
                  <EllipsisOutlined />
                </Button>
              </Dropdown>,
            ];
          },
          content: () => {
            return (
              <Descriptions column={2} style={{ marginBottom: -16 }}>
                <Descriptions.Item label="创建人">曲丽丽</Descriptions.Item>
                <Descriptions.Item label="关联表单">
                  <a>421421</a>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">2017-01-10</Descriptions.Item>
                <Descriptions.Item label="单据备注">浙江省杭州市西湖区工专路</Descriptions.Item>
              </Descriptions>
            );
          },
          extraContent: () => {
            return <span>额外内容区，位于 content 的右侧</span>;
          },
        }} */
      >
        <pre>{JSON.stringify(route.meta, null, 4)}</pre>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
      </PageContainer>
    );
  },
});
