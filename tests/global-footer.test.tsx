import { mount } from '@vue/test-utils';
import GlobalFooter from '../src/GlobalFooter';

const testLinks = [
  {
    key: '1',
    title: 'Pro Layout',
    href: 'https://www.github.com/vueComponent/pro-layout',
    blankTarget: true,
  },
  {
    key: '2',
    title: 'Github',
    href: 'https://www.github.com/vueComponent/ant-design-vue-pro',
    blankTarget: true,
  },
  {
    key: '3',
    title: '@Sendya',
    href: 'https://www.github.com/sendya/',
    blankTarget: true,
  },
];

describe('GlobalFooter', () => {
  it('🥩 base use', () => {
    const wrapper = mount({
      render() {
        return (
          <GlobalFooter
            links={testLinks}
            copyright={
              <a href="https://github.com/vueComponent" target="_blank">
                vueComponent
              </a>
            }
          />
        );
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('😄 custom links', () => {
    const wrapper = mount({
      render() {
        return (
          <GlobalFooter
            links={[
              {
                key: '1',
                title: 'Pro Layout',
                href: 'https://www.github.com/vueComponent/pro-layout',
                blankTarget: true,
              },
            ]}
          />
        );
      },
    });
    const links = wrapper.findAll('.ant-pro-global-footer-links a');
    expect(links).toHaveLength(1);
  });

  it('😄 custom copyright', () => {
    const wrapper = mount({
      render() {
        return <GlobalFooter copyright={<a href="#copyright">vueComponent</a>} />;
      },
    });
    expect(wrapper.find('.ant-pro-global-footer-copyright a').attributes()).toHaveProperty(
      'href',
      '#copyright',
    );
  });
});
