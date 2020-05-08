import './index.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { Divider, Drawer, List, Switch, Icon } from 'ant-design-vue'
import BlockCheckbox from './BlockCheckbox'
import ThemeColor from './ThemeColor'
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange'
import { updateTheme } from '../../utils/dynamicTheme'

const baseClassName = 'ant-pro-setting-drawer'

const BodyProps = {
  title: {
    type: String,
    default: ''
  }
}

const Body = {
  props: BodyProps,
  render (h) {
    const { title } = this

    return (
      <div style={{ marginBottom: 24 }}>
        <h3 class={`${baseClassName}-title`}>{title}</h3>
        {this.$slots.default}
      </div>
    )
  }
}

export const defaultI18nRender = (t) => t

const getThemeList = (i18nRender) => {

  const list = window.umi_plugin_ant_themeVar || []

  const themeList = [
    {
      key: 'light',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/NQ%24zoisaD2/jpRkZQMyYRryryPNtyIC.svg',
      title: i18nRender('app.setting.pagestyle.light')
    },
    {
      key: 'dark',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg',
      title: i18nRender('app.setting.pagestyle.dark')
    }
  ]

  const darkColorList = [
    {
      key: '#1890ff',
      color: '#1890ff',
      theme: 'dark',
    }
  ]

  const lightColorList = [
    {
      key: '#1890ff',
      color: '#1890ff',
      theme: 'dark',
    }
  ]

  if (list.find((item) => item.theme === 'dark')) {
    themeList.push({
      // disable click
      disable: true,
      key: 'realDark',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/hmKaLQvmY2/LCkqqYNmvBEbokSDscrm.svg',
      title: i18nRender('app.setting.pagestyle.realdark'),
    })
  }
  // insert  theme color List
  list.forEach(item => {
    const color = (item.modifyVars || {})['@primary-color']
    if (item.theme === 'dark' && color) {
      darkColorList.push({
        color,
        ...item,
      })
    }
    if (!item.theme || item.theme === 'light') {
      lightColorList.push({
        color,
        ...item,
      })
    }
  })

  return {
    colorList: {
      dark: darkColorList,
      light: lightColorList,
    },
    themeList,
  }
}

const changeSetting = (key, value, hideMessageLoading) => {
  if (key === 'navTheme') {
    // 更新主题
  }
  if (key === 'primaryColor') {
    // 更新主色调
    updateTheme(value)
  }

  if (key === 'layout') {
    // 更新布局模式
    // value === 'topmenu' ? 'Fixed' : 'Fluid'
  }
}


export const SettingDrawerProps = {
  navTheme: PropTypes.oneOf(['dark', 'light', 'realDark']),
  primaryColor: PropTypes.string,
  layout: PropTypes.oneOf(['sidemenu', 'topmenu']),
  colorWeak: PropTypes.bool,
  contentWidth: PropTypes.bool,
  fixedHeader: PropTypes.bool,
  fixSiderbar: PropTypes.bool,
}

const SettingDrawer = {
  name: 'SettingDrawer',
  props: SettingDrawerProps,
  inject: ['locale'],
  data () {
    return {
      show: true,
    }
  },
  render (h) {
    const {
      setShow,
      getContainer,
      navTheme = 'dark',
      primaryColor = 'daybreak',
      layout = 'sidemenu',
      fixedHeader = false,
      fixSiderbar = false,
      contentWidth = false,
      colorWeak
    } = this
    const i18n = this.$props.i18nRender || this.locale || defaultI18nRender
    const themeList = getThemeList(i18n)

    const iconStyle = {
      color: '#fff',
      fontSize: 20
    }

    const handleThemeChange = (key) => {
      this.$emit('themeChange', key)
    }

    const handleLayoutSettingChange = (val) => {
      this.$emit('layoutSettingChange', val)
    }

    return (
      <Drawer
        visible={this.show}
        width={300}
        onClose={() => setShow(false)}
        placement="right"
        getContainer={getContainer}
        /*handle={
          <div class="ant-pro-setting-drawer-handle" onClick={() => setShow(!this.show)}>
            {this.show
              ? (<Icon type="close" style={iconStyle} />)
              : (<Icon type="setting" style={iconStyle} />)
            }
          </div>
        }*/
        style={{
          zIndex: 999
        }}
      >
        <template slot="handle">
          <div class={`${baseClassName}-handle`} onClick={() => setShow(!this.show)}>
            {this.show
              ? (<Icon type="close" style={iconStyle}/>)
              : (<Icon type="setting" style={iconStyle}/>)
            }
          </div>
        </template>
        <div class={`${baseClassName}-content`}>
          <Body title={i18n('app.setting.pagestyle')}>
            <BlockCheckbox list={themeList.themeList} value={navTheme} onChange={handleThemeChange} />
          </Body>

          <ThemeColor
            title={i18n('app.setting.themecolor')}
            value={primaryColor}
            colors={themeList.colorList[navTheme === 'realDark' ? 'dark' : 'light']}
            onChange={(color) => {
              this.$emit('colorChange', color)
              changeSetting('primaryColor', color, null)
            }}
          />

          <Divider />

          <Body title={i18n('app.setting.navigationmode')}>
            <BlockCheckbox value={layout} onChange={(value) => {
              this.$emit('layoutChange', value)
              changeSetting('layout', value, null)
            }} />
          </Body>

          <LayoutSetting
            contentWidth={contentWidth}
            fixedHeader={fixedHeader}
            fixSiderbar={fixSiderbar}
            layout={layout}
            onChange={handleLayoutSettingChange}
          />
          <Divider />

          <Body title={i18n('app.setting.othersettings')}>
            <List
              split={false}
              renderItem={(item) => renderLayoutSettingItem(h, item)}
              dataSource={[
                {
                  title: i18n('app.setting.weakmode'),
                  action: (
                    <Switch
                      size="small"
                      checked={!!colorWeak}
                      onChange={(checked) => changeSetting('colorWeak', checked)}
                    />
                  ),
                },
              ]}
            />
          </Body>

        </div>
      </Drawer>
    )
  },
  methods: {
    setShow (flag) {
      this.show = flag
    }
  }
}

export default SettingDrawer
