import Vue from 'vue'
import { mount } from '@vue/test-utils'
import BlockLayout from '../src/BlockLayout'

describe('BlockLayout', () => {

  it('should render BlockLayout', () => {
    const wrapper = mount({
      render () {
        return (
          <div>
           <BlockLayout>
             <span>demo</span>
           </BlockLayout>
          </div>
        )
      }
    })
    expect(wrapper).toMatchSnapshot()
  })

})
