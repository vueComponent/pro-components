import { Tooltip, Icon } from 'ant-design-vue'

const BlockCheckboxProps = {
  value: {
    type: String,
    default: null
  },
  list: {
    type: Array,
    default: () => []
  }
}

const baseClassName = 'ant-pro-setting-drawer-block-checbox'


const BlockCheckbox = {
  props: BlockCheckboxProps,
  render (h) {
    const { value, list } = this

    const handleChange = (key) => {
      this.$emit('change', key)
    }

    return (
      <div class={baseClassName} key={value}>
        {list.map(item => (
          <Tooltip title={item.title} key={item.key}>
            <div class={`${baseClassName}-item`} onClick={() => handleChange(item.key)}>
              <img src={item.url} alt={item.key} />
              <div
                class={`${baseClassName}-selectIcon`}
                style={{
                  display: value === item.key ? 'block' : 'none'
                }}
              >
                <Icon type="check" />
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    )
  }
}

export default BlockCheckbox
