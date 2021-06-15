import { mount } from '@vue/test-utils';
import { PageContainer } from '../src';
import { Tag, Button } from 'ant-design-vue';
import { sleep } from './utils';

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
    subTitle: 'This is a subtitle',
    breadcrumb: { routes },
    onBack: () => {},
    tags: ['Tag 1', 'Tag 2'].map(tag => <Tag color="blue">{tag}</Tag>),
    extra: [
      <Button key="1" type="primary">
        主操作
      </Button>,
    ],
    content: <div>content</div>,
    extraContent: <div>extraContent</div>,
    footer: [
      <Button key="3">重置</Button>,
      <Button key="2" type="primary">
        提交
      </Button>,
    ],
  };

  it('🥩 base use', () => {
    const wrapper = mount(
      {
        render() {
          return (
            <PageContainer {...props}>
              <div>PageContent</div>
            </PageContainer>
          );
        },
      },
      {
        global: {
          mocks: {
            window: {
              ResizeObserver: class {
                observe() {}
                unobserve() {}
                disconnect() {}
              },
            },
          },
        },
      },
    );
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('😄 custom title,subTitle', () => {
    const wrapper = mount({
      render() {
        return <PageContainer title="Title" subTitle="SubTitle" />;
      },
    });

    expect(wrapper.find('.ant-page-header-heading-title').text()).toBe('Title');
    expect(wrapper.find('.ant-page-header-heading-sub-title').text()).toBe('SubTitle');
  });

  it('😄 render content,extraContent', async () => {
    mount(PageContainer, {
      props: {
        content: <div class="my-test-content">MyTestContent</div>,
        extraContent: <span>extra right content</span>,
      },
    });
    const wrapper = mount({
      render() {
        return (
          <PageContainer
            content={<div class="my-test-content">MyTestContent</div>}
            extraContent={<span>extra right content</span>}
          />
        );
      },
    });

    // test render content, extraContent
    expect(wrapper.findAll('.ant-pro-page-container-content .my-test-content')).toHaveLength(1);
    expect(wrapper.findAll('.ant-pro-page-container-extraContent span')[0].text()).toBe(
      'extra right content',
    );
  });

  it('😄 render footer', () => {
    const wrapper = mount({
      render() {
        return (
          <PageContainer
            footer={[
              <Button key="3">重置</Button>,
              <Button key="2" type="primary">
                提交
              </Button>,
            ]}
          />
        );
      },
    });

    expect(wrapper.findAll('.ant-pro-footer-bar-right button.ant-btn')).toHaveLength(2);
  });

  it('😄 render tags', async () => {
    const wrapper = mount({
      render() {
        return (
          <PageContainer
            tags={['Tag 1', 'Tag 2'].map(tag => (
              <Tag color="blue">{tag}</Tag>
            ))}
          />
        );
      },
    });
    // test render tags
    expect(wrapper.findAll('.ant-page-header-heading-tags span')).toHaveLength(2);
    expect(wrapper.findAll('.ant-page-header-heading-tags span')[1].text()).toBe('Tag 2');

    // test update prop tags
    wrapper.setProps({
      tags: undefined,
    });

    await sleep(50);

    expect(wrapper.find('.ant-page-header-heading-tags').exists()).toBe(false);
  });
});
