import './_utils/mock-func';
import { mount } from '@vue/test-utils';
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
});
