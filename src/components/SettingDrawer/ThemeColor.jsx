import './ThemeColor.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { Tooltip, Icon } from 'ant-design-vue'
import { defaultI18nRender } from './index'
import { genThemeToString } from '../../utils/util'

const baseClassName = 'theme-color'

export const TagProps = {
  color: PropTypes.string,
  check: PropTypes.bool,
  handleClick: PropTypes.func,
}

const Tag = {
  props: TagProps,
  render (h) {
    const { color, check, handleClick } = this
    return (
      <div onClick={handleClick} style={{ backgroundColor: color }} ref="colorRef">
        { check ? <Icon type="check" /> : null }
      </div>
    )
  }
}

export const ThemeColorProps = {
  colors: PropTypes.array,
  title: PropTypes.string,
  value: PropTypes.string,
  i18nRender: PropTypes.func
}

const ThemeColor = {
  props: ThemeColorProps,
  render (h) {
    const { title, value, colors } = this
    const i18n = this.$props.i18nRender || this.locale || defaultI18nRender

    const colorList = colors || []

    if (colorList.length < 1) {
      return null
    }
    const handleChange = (key) => {
      this.$emit('change', key)
    }

    return (
      <div class={baseClassName} ref={'ref'}>
        <h3 class={`${baseClassName}-title`}>{title}</h3>
        <div class={`${baseClassName}-content`}>
          {colorList.map(item => {
            const themeKey = genThemeToString(item.key)
            return (
              <Tooltip
                key={item.color}
                title={
                  themeKey ? i18n(`app.setting.themecolor.${themeKey}`) : item.key
                }
              >
                <Tag
                  class={`${baseClassName}-block`}
                  color={item.color}
                  check={value === item.key || genThemeToString(value) === item.key}
                  handleClick={() => handleChange(item.key)}
                />
              </Tooltip>
            )
          })}
        </div>
      </div>
    )
  }
}

export default ThemeColor

