import { mount } from '@vue/test-utils';
import GridContent from '../src/GridContent';

describe('GridContent', () => {
  it('shoul render with empty children', () => {
    const wrapper = mount(GridContent, {});
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shoul render with prop Fixed', () => {
    const wrapper = mount({
      setup() {
        return () => <GridContent contentWidth="Fixed"></GridContent>;
      },
    });
    expect(wrapper.classes().indexOf('wide') > -1).toBe(true);
  });

  it('shoul render with children', () => {
    const wrapper = mount({
      setup() {
        return () => (
          <GridContent contentWidth="Fixed">
            <div>children</div>
          </GridContent>
        );
      },
    });
    expect(
      wrapper.find('.ant-pro-grid-content-children').element.innerHTML === '<div>children</div>',
    ).toBe(true);
  });
});
