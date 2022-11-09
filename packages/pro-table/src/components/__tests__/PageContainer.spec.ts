import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import PageContainer from '../PageContainer/index.tsx';

describe('Basic render', () => {
  it('renders properly', () => {
    const wrapper = mount(PageContainer, { val: '1' });
    expect(wrapper.text()).toContain('PageContainer 1');
  });
});
