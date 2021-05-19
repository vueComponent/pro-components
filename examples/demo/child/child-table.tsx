import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Table, Button } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const columns = [
      { dataIndex: 'key', title: '#' },
      { dataIndex: 'title', title: '标题' },
      { dataIndex: 'content', title: '内容' },
      {
        dataIndex: 'action',
        title: '操作',
        customRender: ({ record }) => {
          return (
            <>
              <a>编辑</a>
              <a>删除</a>
            </>
          );
        },
      },
    ];
    return () => (
      <div>
        <h1>Child Table: {route.meta.title}</h1>
        <Button
          style={{ marginBottom: '12px' }}
          onClick={() => {
            router.push({ path: '/form/child/page2' });
          }}
        >
          <PlusOutlined />
          新增
        </Button>
        <Table columns={columns} />
      </div>
    );
  },
});
