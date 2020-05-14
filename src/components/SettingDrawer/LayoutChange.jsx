import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { List, Tooltip, Select, Switch } from 'ant-design-vue'
import { defaultI18nRender } from './index'

export const renderLayoutSettingItem = (h, item) => {
  const action = {...item.action}
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <List.Item actions={[action]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </List.Item>
    </Tooltip>
  )
}

export const LayoutSettingProps = {
  contentWidth: PropTypes.bool,
  fixedHeader: PropTypes.bool,
  fixSiderbar: PropTypes.bool,
  layout: PropTypes.oneOf(['sidemenu', 'topmenu'])
}

export default {
  props: LayoutSettingProps,
  inject: ['locale'],
  render (h) {
    const i18n = this.$props.i18nRender || this.locale || defaultI18nRender
    const { contentWidth, fixedHeader, layout, fixSiderbar } = this

    const handleChange = (type, value) => {
      this.$emit('change', { type, value })
    }

    return (
      <List
        split={false}
        dataSource={[
          {
            title: i18n('app.setting.content-width'),
            action: (
              <Select
                value={contentWidth && 'Fixed' || 'Fluid'}
                size="small"
                onSelect={(value) => handleChange('contentWidth', value)}
                style={{ width: '80px' }}
                >
                {layout === 'sidemenu' ? null : (
                  <Select.Option value="Fixed">
                    {i18n('app.setting.content-width.fixed')}
                  </Select.Option>
                )}
                <Select.Option value="Fluid">
                  {i18n('app.setting.content-width.fluid')}
                </Select.Option>
          </Select>
          ),
        },
        {
          title: i18n('app.setting.fixedheader'),
          action: (
          <Switch
          size="small"
          checked={!!fixedHeader}
          onChange={(checked) => handleChange('fixedHeader', checked)}
          />
          ),
        },
        {
          title: i18n('app.setting.fixedsidebar'),
          disabled: layout === 'topmenu',
          disabledReason: i18n('app.setting.fixedsidebar.hint'),
          action: (
          <Switch
            size="small"
            disabled={layout === 'topmenu'}
            checked={!!fixSiderbar}
            onChange={(checked) => handleChange('fixSiderbar', checked)}
          />
          ),
        },
          ]}
        renderItem={(item, index) => renderLayoutSettingItem(h, item)}
      />
    )
  }
}
