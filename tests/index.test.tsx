import './_utils/mock-func';
import { mount, shallowMount } from '@vue/test-utils';
import { reactive } from 'vue';
import BasicLayout from '../src/BasicLayout';

const title = 'Pro Tests';
const logoSrc = 'https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg';

describe('BasicLayout', () => {
  it('🥩 base use', () => {
    const wrapper = mount({
      render() {
        return (
          <BasicLayout
            title={title}
            logo={logoSrc}
            layout="side"
            navTheme="light"
            contentWidth="Fluid"
            contentStyle={{ minHeight: '300px' }}
            rightContentRender={() => (
              <div class="custom-header-right-content">
                <span>custom-right-content</span>
              </div>
            )}
            footerRender={() => <div>custom-footer</div>}
          >
            <div>content</div>
          </BasicLayout>
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('😄 custom title, logo', () => {
    const wrapper = mount({
      render() {
        return (
          <BasicLayout title={title} logo={logoSrc}>
            <div>content</div>
          </BasicLayout>
        );
      },
    });

    const renderTitle = wrapper.find('.ant-pro-sider-logo h1');
    const renderLogo = wrapper.find('.ant-pro-sider-logo img');
    expect(renderTitle.element.innerHTML).toEqual(title);
    expect(renderLogo.attributes()).toHaveProperty('src', logoSrc);
  });

  it('😄 custom layout mode, navTheme', async () => {
    const wrapper = mount({
      props: {
        theme: {
          type: String,
          default: 'light',
        },
        layout: {
          type: String,
          default: 'mix',
        },
      },
      render() {
        return (
          <BasicLayout navTheme={this.theme} layout={this.layout}>
            <div>content</div>
          </BasicLayout>
        );
      },
    });
    expect(wrapper.find('.ant-pro-basicLayout-mix').exists()).toBe(true);
    expect(wrapper.find('.ant-pro-sider-light').exists()).toBe(true);

    // update props
    await wrapper.setProps({
      theme: 'dark',
      layout: 'top',
    });

    expect(wrapper.find('div.ant-pro-basicLayout-top').exists()).toBe(true);
    expect(wrapper.find('.ant-pro-top-nav-header.light').exists()).toBe(false);
  });
});
