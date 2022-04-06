import type { PropType, ExtractPropTypes } from 'vue';
import type { MenuTheme, ContentWidth } from './typings';

export interface RenderSetting {
  headerRender?: false;
  footerRender?: false;
  menuRender?: false;
  menuHeaderRender?: false;
}
export interface PureSettings {
  /**
   * theme for nav menu
   */
  navTheme: MenuTheme | 'realDark' | undefined;
  /**
   * @name 顶部菜单的颜色，mix 模式下生效
   */
  headerTheme?: MenuTheme;
  /**
   * nav menu position: `side` or `top`
   */
  headerHeight?: number;
  /**
   * customize header height
   */
  layout: 'side' | 'top' | 'mix';
  /**
   * layout of content: `Fluid` or `Fixed`, only works when layout is top
   */
  contentWidth: ContentWidth;
  /**
   * sticky header
   */
  fixedHeader: boolean;
  /**
   * sticky siderbar
   */
  fixSiderbar: boolean;
  menu: { locale?: boolean; defaultOpenAll?: boolean };
  title: string;
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: string;
  primaryColor: string;
  colorWeak?: boolean;
  splitMenus?: boolean;
}

export type ProSettings = PureSettings & RenderSetting;

export const defaultSettings = {
  navTheme: 'dark',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  menu: {
    locale: true,
  },
  headerHeight: 48,
  title: 'Ant Design Pro',
  iconfontUrl: '',
  primaryColor: '#1890ff',
};

export const defaultSettingProps = {
  navTheme: {
    type: String as PropType<PureSettings['navTheme']>,
    default: defaultSettings.navTheme,
  },
  layout: {
    type: String as PropType<PureSettings['layout']>,
    default: defaultSettings.layout,
  },
  contentWidth: {
    type: String as PropType<PureSettings['contentWidth']>,
    default: defaultSettings.contentWidth,
  },
  fixedHeader: {
    type: Boolean as PropType<PureSettings['fixedHeader']>,
    default: defaultSettings.fixedHeader,
  },
  fixSiderbar: {
    type: Boolean as PropType<PureSettings['fixSiderbar']>,
    default: defaultSettings.fixSiderbar,
  },
  menu: {
    type: Object as PropType<PureSettings['menu']>,
    default: () => {
      return {
        locale: true,
      };
    },
  },
  headerHeight: {
    type: Number as PropType<PureSettings['headerHeight']>,
    default: defaultSettings.headerHeight,
  },
  title: {
    type: String as PropType<PureSettings['title']>,
    default: () => defaultSettings.title,
  },
  iconfontUrl: {
    type: String as PropType<PureSettings['iconfontUrl']>,
    default: () => defaultSettings.iconfontUrl,
  },
  primaryColor: {
    type: String as PropType<PureSettings['primaryColor']>,
    default: () => defaultSettings.primaryColor,
  },
  /**
   * 只在 mix 模式下生效
   */
  splitMenus: {
    type: Boolean,
    default: false,
  },
};

export type ProSettingsProps = ExtractPropTypes<typeof defaultSettingProps>;
