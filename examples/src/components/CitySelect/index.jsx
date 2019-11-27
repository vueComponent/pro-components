import { Button, Radio, Select, Popover } from 'ant-design-vue'
import './index.less'

const filterProvinceList = [{ n: 'A', v: 'A' }, { n: 'F', v: 'F' }, { n: 'G', v: 'G' }, { n: 'H', v: 'H' }, { n: 'J', v: 'J' }, { n: 'L', v: 'L' }, { n: 'N', v: 'N' }, { n: 'Q', v: 'Q' }, { n: 'S', v: 'S' }, { n: 'T', v: 'T' }, { n: 'X', v: 'X' }, { n: 'Y', v: 'Y' }, { n: 'Z', v: 'Z' }, { n: '直辖市', v: '1' }, { n: '港澳', v: '2' }]
const filterCityList = [{ n: 'A', v: 'A' }, { n: 'B', v: 'B' }, { n: 'C', v: 'C' }, { n: 'D', v: 'D' }, { n: 'E', v: 'E' }, { n: 'F', v: 'F' }, { n: 'G', v: 'G' }, { n: 'H', v: 'H' }, { n: 'I', v: 'I' }, { n: 'J', v: 'J' }, { n: 'K', v: 'K' }, { n: 'L', v: 'L' }, { n: 'N', v: 'N' }, { n: 'M', v: 'M' }, { n: 'O', v: 'O' }, { n: 'Q', v: 'Q' }, { n: 'P', v: 'P' }, { n: 'R', v: 'R' }, { n: 'S', v: 'S' }, { n: 'T', v: 'T' }, { n: 'U', v: 'U' }, { n: 'V', v: 'V' }, { n: 'W', v: 'W' }, { n: 'X', v: 'X' }, { n: 'Y', v: 'Y' }, { n: 'Z', v: 'Z' }]

export default {
  name: 'CitySelect',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-city-select'
    },
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      byType: 'city'
    }
  },
  methods: {
    renderHeader () {
      const handleChange = (e) => {
        this.byType = e.target.value
      }
      const selectFilters = this.byType === 'city' ? filterCityList.map(item => <Button size={'small'}>{item.n}</Button>) : filterProvinceList.map(item => <Button size={'small'}>{item.n}</Button>)
      return (
        <div class={'city-select-header'}>
          <Radio.Group size={'small'} value={this.byType} onChange={handleChange} style={{ marginRight: '16px' }}>
            <Radio.Button value={'province'}>按省份</Radio.Button>
            <Radio.Button value={'city'}>按城市</Radio.Button>
          </Radio.Group>

          <Select size={'small'} showSearch={true} placeholder={'输入城市名称搜索'} style={ { width: '200px' } }>
            <Select.Option value={'xiamen'}>厦门</Select.Option>
            <Select.Option value={'fuzhou'}>福州</Select.Option>
          </Select>

          <div class={'select-filters'}>
            {selectFilters}
          </div>
        </div>
      )
    },
    renderBody () {
      return (
        <div class={'city-select-body'}>

        </div>
      )
    }
  },
  render () {
    const classes = {
      [`${this.prefixCls}`]: true
    }
    return (
      <div class={classes}>
        <Popover overlayStyle={{ width: '400px' }} placement={'topLeft'}>
          <div slot="content">
            {this.renderHeader()}
            {this.renderBody()}
          </div>
          <Button type={'link'}>北京市</Button>
        </Popover>
      </div>
    )
  }
}
