import { mount } from '@vue/test-utils';
import { PageContainer } from '../src/PageContainer';
import { Tag, Button } from 'ant-design-vue';

describe('PageContainer', () => {

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
  const props = {
    title: 'Title',
    subTitle: "This is a subtitle",
    breadcrumb: { routes },
    onBack: () => {},
    tags: ['Tag 1', 'Tag 2'].map(tag => (<Tag color="blue">{tag}</Tag>)),
    extra: [<Button key="1" type="primary">主操作</Button>,],
    content: (<div>content</div>),
    extraContent: (<div>extraContent</div>),
    footer: [
      <Button key="3">重置</Button>,
      <Button key="2" type="primary">
        提交
      </Button>,
    ],
  }

  it('🥩 base use', () => {
    const wrapper = mount({
      render() {
        return (
          <PageContainer {...props}>
            <div>Page Content</div>
          </PageContainer>
        );
      },
    });
    console.log(wrapper.html());
  });

});
