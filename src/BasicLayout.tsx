import { computed, FunctionalComponent, CSSProperties } from 'vue';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { withInstall } from 'ant-design-vue/es/_util/type';
import { default as ProProvider, ProProviderData } from './ProProvider';
import { default as GlobalFooter } from './GlobalFooter';
import { default as SiderMenuWrapper, SiderMenuWrapperProps } from './SiderMenu';
import { WrapContent } from './WrapContent';
import { RenderVNodeType, WithFalse } from './typings';
import './BasicLayout.less';

const defaultI18nRender = (key: string) => key;

export interface BasicLayoutProps {
  pure?: boolean;
  /**
   *@name logo url
   */
  logo?: string | RenderVNodeType | WithFalse<string | RenderVNodeType>;

  loading?: boolean;

  i18n?: ProProviderData['i18n'];

  onCollapse?: (collapsed: boolean) => void;

  footerRender?: WithFalse<
    (props: any /* FooterProps */, defaultDom: RenderVNodeType) => RenderVNodeType
  >;

  headerRender?: WithFalse<(props: any /* HeaderProps */) => RenderVNodeType>;

  colSize?: string;
  /**
   * 是否禁用移动端模式，有的管理系统不需要移动端模式，此属性设置为true即可
   */
  disableMobile?: boolean;

  isChildrenLayout?: boolean;

  contentStyle?: CSSProperties;
  /**
   * 兼用 content的 margin
   */
  disableContentMargin?: boolean;
}

export type ProLayoutProps = BasicLayoutProps &
  SiderMenuWrapperProps /* & HeaderProps & FooterProps */;

const ProLayout: FunctionalComponent<ProLayoutProps> = (props, { emit, slots }) => {
  const handleCollapse = (collapsed: boolean) => {
    emit('update:collapsed', collapsed);
  };
  const handleOpenChange = (openKeys: string[] | false): void => {
    openKeys && emit('update:openKeys', openKeys);
  };
  const handleSelect = (selectedKeys: string[] | false): void => {
    selectedKeys && emit('update:selectedKeys', selectedKeys);
  };
  const baseClassName = computed(() => `${props.prefixCls}-basicLayout`);
  // gen className
  const className = computed(() => {
    return {
      [baseClassName.value]: true,
      [`screen-${props.colSize}`]: props.colSize,
      [`${baseClassName.value}-top-menu`]: props.layout === 'top',
      [`${baseClassName.value}-is-children`]: props.isChildrenLayout,
      [`${baseClassName.value}-fix-siderbar`]: props.fixSiderbar,
      [`${baseClassName.value}-${props.layout}`]: props.layout,
    };
  });
  return (
    <ProProvider i18n={defaultI18nRender}>
      <div class={className.value}>
        <Layout class={baseClassName.value}>
          <SiderMenuWrapper
            {...props}
            onSelect={handleSelect}
            onOpenChange={handleOpenChange}
            onCollapse={handleCollapse}
          />
          <Layout>
            <Layout.Header style="background: #fff; padding: 0; height: 48px; line-height: 48px;"></Layout.Header>
            <WrapContent
              style={{
                margin: '24px 16px',
                padding: '24px',
                background: '#fff',
                minHeight: '280px',
              }}
            >
              {slots.default?.()}
            </WrapContent>
            <GlobalFooter
              links={[
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
              ]}
              copyright={
                <a href="https://github.com/vueComponent" target="_blank">
                  vueComponent
                </a>
              }
            />
          </Layout>
        </Layout>
      </div>
    </ProProvider>
  );
};

ProLayout.inheritAttrs = false;
ProLayout.displayName = 'ProLayout';
ProLayout.emits = ['update:collapsed', 'update:openKeys', 'update:selectedKeys'];
ProLayout.props = {
  prefixCls: {
    type: String,
    default: 'ant-pro',
  },
  title: String,
  colSize: String,
  isChildrenLayout: Boolean,
  fixSiderbar: Boolean,
  layout: String,
  openKeys: Array,
  selectedKeys: Array,
  collapsed: Boolean,
  menuData: Array,
} as any;

export default withInstall(ProLayout);
