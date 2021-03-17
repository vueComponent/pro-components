import 'ant-design-vue/dist/antd.less';
import { createApp, defineComponent, watch, ref, watchEffect, onMounted } from 'vue';
import { createRouter, createWebHashHistory, useRoute, useRouter, RouteRecord } from 'vue-router';
import { Avatar, Button, Space, Select, Switch } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { default as ProLayout, FooterToolbar } from '../src/';
import { globalState as state } from './state';
import './demo.less';

import registerIcons from './_util/icons';

// demo pages
import Page1 from './demo/page1';
import Welcome from './demo/welcome';
import FormPage from './demo/form';
import ChildPage from './demo/child/child-page';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = () => {};

const getMenuData = (routes: RouteRecord[]) => {
  const childrenRoute = routes.find(route => route.path === '/');
  return childrenRoute?.children || [];
};

const BasicLayout = defineComponent({
  name: 'BasicLayout',
  inheritAttrs: false,
  setup() {
    const { getRoutes } = useRouter();
    const route = useRoute();

    const menuData = getMenuData(getRoutes());

    const updateSelectedMenu = () => {
      const matched = route.matched.concat().map(item => item.path);
      matched.shift();
      state.selectedKeys = matched;
    };

    onMounted(() => {
      // if sider collapsed, set openKeys is null.
      const cacheOpenKeys = ref<string[]>([]);
      watch(
        () => state.collapsed,
        (collapsed: boolean) => {
          if (collapsed) {
            cacheOpenKeys.value = state.openKeys;
            state.openKeys = [];
          } else {
            state.openKeys = cacheOpenKeys.value;
          }
        },
      );

      // watch route
      watchEffect(() => {
        updateSelectedMenu();
      });
    });

    return () => (
      <ProLayout
        layout={state.layout}
        navTheme={state.navTheme}
        i18n={(key: string) => key}
        isMobile={state.isMobile}
        fixSiderbar={state.fixSiderbar}
        fixedHeader={state.fixedHeader}
        contentWidth={'Fixed'}
        primaryColor={'#1890ff'}
        contentStyle={{ minHeight: '300px' }}
        siderWidth={state.sideWidth}
        splitMenus={state.splitMenus}
        menuData={menuData}
        collapsed={state.collapsed}
        openKeys={state.openKeys}
        selectedKeys={state.selectedKeys}
        onCollapse={$event => {
          state.collapsed = $event;
        }}
        onOpenKeys={$event => {
          state.openKeys = $event;
        }}
        onSelect={updateSelectedMenu}
        rightContentRender={props => (
          <div
            class={['right-content', `${props.layout}-${props.navTheme}`]}
            style={{ marginRight: '16px' }}
          >
            <span>
              <Avatar icon={<UserOutlined />} /> Sendya
            </span>
          </div>
        )}
        menuHeaderRender={() => (
          <a>
            <img src="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg" />
            {state.collapsed && state.layout !== 'mix' ? null : <h1>Pro Preview</h1>}
          </a>
        )}
        // {...{
        //   'onUpdate:collapsed': noop,
        //   'onUpdate:openKeys': noop,
        //   'onUpdate:selectedKeys': noop,
        // }}
      >
        <router-view />
        <FooterToolbar>
          <Space>
            <Button
              onClick={() => {
                state.navTheme = state.navTheme === 'dark' ? 'light' : 'dark';
              }}
            >
              Theme Switch
            </Button>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}
              value={state.layout}
              onChange={val => {
                state.layout = val;
              }}
              style={{ width: '150px' }}
            >
              <Select.Option value="side">Side</Select.Option>
              <Select.Option value="top">Top</Select.Option>
              <Select.Option value="mix">Mix</Select.Option>
            </Select>
            <Switch
              checkedChildren="Fixed Header"
              unCheckedChildren="UnFixed Header"
              checked={state.fixedHeader}
              onChange={() => {
                state.fixedHeader = !state.fixedHeader;
              }}
            />
            <Switch
              checkedChildren="Fixed SideBar"
              unCheckedChildren="UnFixed SideBar"
              checked={state.fixSiderbar}
              onChange={() => {
                state.fixSiderbar = !state.fixSiderbar;
              }}
            />
            <Switch
              checkedChildren="Split Menus"
              unCheckedChildren="Un Split Menus"
              checked={state.splitMenus}
              onChange={() => {
                state.splitMenus = !state.splitMenus;
              }}
            />
          </Space>
        </FooterToolbar>
        <div
          class="ant-pro-layout-watermark"
          style='z-index: 9; position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; background-size: 332px; pointer-events: none; background-repeat: repeat; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkUAAAH0CAYAAAAzAFmMAAAgAElEQVR4Xu3dS3Nc13ku4G93o8E7SIICQQJUpEp55GkG55cczz3ywLFO7PJ9cjBybCmxU3Y84Chz/RdPM3KdYkQCIgjxBoK4NRr71GqooQ0QlwYEca0GHo0ioXv3t59vOfXW3utShX8IECBAgAABAgSiYkCAAAECBAgQIBBCkUFAgAABAgQIEEgCnhQZBwQIECBAgAABocgYIECAAAECBAjsCHhSZCQQIECAAAECBIQiY4AAAQIECBAg4EmRMUCAAAECBAgQ2BXw+sxgIECAAAECBAh4fWYMECBAgAABAgS8PjMGCBAgQIAAAQJenxkDBAgQIECAAIGmgDlFxgMBAgQIECBAwJwiY4AAAQIECBAgsCPgSZGRQIAAAQIECBAQiowBAgQIECBAgIAnRcYAAQIECBAgQGBXwOszg4EAAQIECBAg4PWZMUCAAAECBAgQ8PrMGCBAgAABAgQIeH1mDBAgQIAAAQIEmgLmFBkPBAgQIECAAAFziowBAgQIECBAgMCOgCdFRgIBAgQIECBAQCgyBggQIECAAAECnhQZAwQIECBAgACBXQGvzwwGAgQIECBAgIDXZ8YAAQIECBAgQMDrM2OAAAECBAgQIOD1mTFAgAABAgQIEGgKmFNkPBAgQIAAAQIEzCkyBggQIECAAAECOwKeFBkJBAgQIECAAAGhyBggQIAAAQIECHhSZAwQIECAAAECBHYFvD4zGAgQIECAAAECXp8ZAwQIECBAgAABr8+MAQIECBAgQICA12fGAAECBAgQIECgKWBOkfFAgAABAgQIEDCnyBggQIAAAQIECOwIeFJkJBAgQIAAAQIEhCJjgAABAgQIECDgSZExQIAAAQIECBDYFfD6zGAgQIAAAQIECHh9ZgwQIECAAAECBLw+MwYIECBAgAABAl6fGQMECBAgQIAAgaaAOUXGAwECBAgQIEDAnCJjgAABAgQIECCwI+BJkZFAgAABAgQIEBCKjAECBAgQIECAgCdFxgABAgQIECBAYFfA6zODgQABAgQIECDg9ZkxQIAAAQIECBDw+swYIECAAAECBAh4fWYMECBAgAABAgSaAuYUGQ8ECBAgQIAAAXOKjAECBAgQIECAwI6AJ0VGAgECBAgQIEBAKDIGCBAgQIAAAQKeFBkDBAgQIECAAIFdAa/PDAYCBAgQIECAgNdnxgABAgQIECBAwOszY4AAAQIECBAg4PWZMUCAAAECBAgQaAqYU2Q8ECBAgAABAgTMKTIGCBAgQIAAAQI7Ap4UGQkECBAgQIAAAaHIGCBAgAABAgQIeFJkDBAgQIAAAQIEdgW8PjMYCBAgQIAAAQJenxkDBAgQIECAAAGvz4wBAgQIECBAgIDXZ8YAAQIECBAgQKApYE6R8UCAAAECBAgQMKfIGCBAgAABAgQI7Ah4UmQkECBAgAABAgSEImOAAAECBAgQIOBJkTFAgAABAgQIENgV8PrMYCBAgAABAgQIeH1mDBAgQIAAAQIEvD4zBggQIECAAAECXp8ZAwQIECBAgACBpoA5RcYDAQIECBAgQMCcImOAAAECBAgQILAj4EmRkUCAAAECBAgQEIqMAQIECBAgQICAJ0XGAAECBAgQIEBgV8DrM4OBAAECBAgQIOD1mTFAgAABAgQIEPD6zBggQIAAAQIECHh9ZgwQIECAAAECBJoC5hQZDwQIECBAgAABc4qMAQIECBAgQIDAjoAnRUYCAQIECBAgQEAoMgYIECBAgAABAp4UGQMECBAgQIAAgV0Br88MBgIECBAgQICA12fGAAECBAgQIEDA6zNjgAABAgQIECDg9ZkxQIAAAQIECBBoCphTZDwQIECAAAECBMwpMgYIECBAgAABAjsCnhQZCQQIECBAgAABocgYIECAAAECBAh4UmQMECBAoGyBubo1fS2u9Laj1W7F9uJHsR4/qHplF606AqMr4PXZ6PZO5QQInFOBmbn6an09plpVXNp/i1UVb59ci2fxo6p7Tm/fbRHIJiAUZaP3wwQIENgnMFe3PrwS97bH4vpRNlut2LryOhYezVXrDAkQODsBoejsLF2JAAECpxeYq1szN2K2iriSLpKeCF0ei6/+/km1kf79nx7WncW3cbeu41r6914rNp++jicxV22d/kd9kwCBpoBQZDwQIECgAIHZ39V34lLc6ZeyEc/nf1s9f6esuq4+/iymu+2Y6AejjXj59LfVUgHlK4HAuRAQis5FG90EAQIjIfCw7nz8Ou6sVXHlwUQ8+dtgXtBcPXbvZjxob8d4aytWHv8qvoyo6gPv6WHdmV6OB2Ot6LRbsTV1NR7vXmckEBRJoFwBoajc3qiMAIFSBD6v2w+exM2tKiZScBmUtV3HRrUSSwtz1epxpX7vz/WlzV7M9rZjLH22vRlLX/ymepn+7+nP6mud8Zipt6La2Iovv/pV9eao6/3Dv9a3e+MxlT7TacWzRz+tXh33+/5OgMDxAkLR8UY+QYDABRV48Mf6St2NOzEWV48kOPB1V11N/TWuXdqIm9PX4tnjtZjs9OJmVcX2xlasdG7G8sKPdsLUx3+qb3W3427629jtePLoh0dPoE4Ba2M9Hmy3o91fjfazWDj0ydIF7Z3bJnAaAaHoNGq+Q4DA+RX4vG7P/j1utcbiVgodzRtNT4a2tmMjzXROr8DSK6z096oX9XodT5tPeJpPc+JSPK9X4lqvHe3FiXiyfzn9IBSla22+iYWluWrlSODGpOw6Ym3hTczHXLV9fpvizgi8HwGh6P04+xUCBEZEYPLP9cSVbtwblNvqRW97K17Nfy9e7d84cfY/6zuxsTM5um7H+sKr/mqwfjhJq8WWVuPD9LosXaMei2q9G4sHvRqbmquvj9+Imf5vHjbJep/fR3+q729tx43+KrTZeGxTxxEZYMosWkAoKro9iiNA4L0LNCY9b21Hd/FtPD502XtdV7N/idnoxtVqLOruZiws/qJ6O6j57n/U0+mVWfr3FIwuXY4ngyX2zftqBqj94eqw+x+EIk+K3vsI8YPnWEAoOsfNdWsECJxOYObf6g+qKibTt9c68fTFJ9XyYVe6/fv65tVOTPf/fimez//zN0vp087UrasxW7ejSivFvngdXxwcsOrqwz/E/bRpYwpX6+t7X8W989uN4NZtx+tn/1Itnu5OfYsAgaaAUGQ8ECBAYJ9AcyJzdGJ1/icxH9XBS+Q/nqsvb03Eg7qO1lgr3vzPT6svdy+X5v7cigdVLy4fN4m6vwKtjpkUoPpPqA6YezS47mBPo/41l+OJna0NYQJnIyAUnY2jqxAgcK4EGk9uqkhzhOaf/KxaO+gWP/6v+vLWy51Q1OvEy6ef7N1MsTnhurkM/91r1dXUpzE9PtiYsRWb19vx5Z7XbZ/X7bsL8cHglZzNG8/VoHMzBQgIRQU0QQkECJQn0Nw76KhXVLtPbQ6YU5Tu6kTzhfYd9ZG+n1679dqx2e7F+GCPo/TfN3uxvPTLWLQUv7yxo6LRFRCKRrd3KidA4LsU+Lxu35uPD9NmjYftHJ32Maq2YiYt3T9qgvRgwvVBk7HfuYW5unX3VkwNngbt/3t6tRYRz5oTur9LBtcmcJEEhKKL1G33SoDAiQSaE6737Bw9V7dmx+N2dTlup9dmaZ+ibrV35Vnzh1J4iojZ9Nljj/EYfPFh3XnwNm5sbO3soN1pxdbV8Xhz0Oq1E92UDxMgcKiAUGRwECBA4BCB/ROuOzfiq/pV3O5143qaEJ2+liY7ry7Hsxdzh69Qi8bSfeeVGW4EyhUQisrtjcoIEMgu8M2E64NKSa/MrrZicZinN81NIY+ecJ39phVA4MIKCEUXtvVunACBYQSaE64HT4a6vVhenIiX+4/rOOp6J5pwPUxhPkOAwJkLCEVnTuqCBAjkF6ir6c/6h7imY8qi0443hy2pP7bWxl5DaVfqG6vx+L/nqs1jv3fAB0404fo0P+A7BAh8KwGh6Fvx+TIBAqUJpNdU19Zjav9hrq3xWHn8PJ6e5uDU4fcaOlojTbju9uLeWDeWDzpLrTRL9RC4aAJC0UXruPslcI4FmqfNH3Sbp93bpznhetizyc4xs1sjcG4FhKJz21o3RuACCDysO9PLcbvTjq2J5VhZuRkPttNxG1V89eh1LMdc1Ld/HxPXxmOqv3R+mHPFDmTbezbZ/oNfL4C0WyRwIQSEogvRZjdJ4BwKNA5F7bVis9WLlVYrbh10JMcHf6hvXK7iXn8Z/TFnmR0mNewO1+dQ2i0RuDACQtGFabUbJXD+BJqbK6anQJt1LB98YnxdffxpTHfbMZH2FTrqLLNDlRoTru01dP7GkjsikASEIuOAAIGzF5irW1NTcXVqKTZPu1JrUFSanFx3487alVh+8cneDRL3bK4YEavdWHz56+r1QTfU3FX6qLPMjsI4qwnXZw/uigQInIWAUHQWiq5BgMA3Ao0nKumpzNhyPHk0V62fiGiubqVVYs29fQ5+7VVXD/4YM3W9s/T+qFB0FrtKN+vpB6v/E8+iquoT3ZsPEyBQrIBQVGxrFEZgRAXm6rHpa/HhWCs66Q4238TC0ly1ctzdpKc+a2sxVVVxpXGExts0cbqKuHLYa6/mTtHHPQFqrk477a7SM3P11YXvx0b8oOodd0/+ToDAaAkIRaPVL9USGAmB9JqpbsfkesTbpdV4dvTeQHU1829xp6pi8ribOzD07Jtw/fR1PIm5auuga9lV+jhhfydwsQWEoovdf3dPILvA7O/qO3Ep7qRCtuvYaLfi2WD36e/P1ePLE/3l9P3XY4dNcG5OuF7rxNP9c4+aN2lX6ewtVwCBYgWEomJbozAC519gz6aIEWsLb2L+3adKdTX1aUyPt2OiH4w2Y+mL31Qvmzr7T7Of/0nMHzbX5ywmXJ//zrhDAhdTQCi6mH131wTer8DXE6f3/+hgjk/Vi3r7Zswv/KhaPd1rr8bmisctua/ravYvMRvduGpp/fsdBn6NQOkCQlHpHVIfgREWmHlYX63fxFR7Z9L1/P5DWT/6U31/aztubG1Hd/FtPD5sLlAi2H3tdUjoaW6u2OvEy6efVEuH0aXJ2VfrmK7XY+3erVj824+q7ggzK50AgTMSEIrOCNJlCBB4V6AZVOo6Xiz8vPpq91Np6f6NmE0ry+purC+s9ydIp40VD/zn2Ndeja0A0g7XR024jqirmIvqNIfD6jMBAudXQCg6v711ZwTen0B6PRbRirnoRTT27TkmqJzkSVH877p9/3/Fg1YVl85iwvX7w/FLBAiMioBQNCqdUieB0gTm6tbseNxuX4mbve0YS+UdNAn6qJVh9/5cT7W7cbs/p2g15hfmDp5TNLj1QYg67LdOMuG6NE71ECCQX0Aoyt8DFRAYOYGpv9bXL7+N6e12tJvF1+1YX3i19zXYUUHlJPOA+jtSfxqzMRZX028e9FvptdhHf4p7W5vRrjrxfP8cppGDVjABAu9VQCh6r9x+jMDoCzRPnE8TpK+MxctHr2Pl8EnSR6wMa2y8mF6JXX8dTw47K22w8WLa4bpOu1yPRd3djIXFX1RvR1/VHRAgUIKAUFRCF9RAYFQEHtad6eV4kI7waG3FyuO1eDrMZOXmE6H9u1I3X6+NteLN//xLPD1oj6HZ/6zvVKsxWV+NF9Vm3E7B6LhjPUaFVZ0ECJQhIBSV0QdVEBgJgdu/r29e7cR0/6DX2/Hk0Q+HPOi1MeH6nUnSjadFCaGq4u2Ta/EsBsvk5+rW3Vsx1enFzXpng8cvZyfjXtpnqL/KbDYeO4dsJIaPIgkULyAUFd8iBRJ4TwIpuNyPy5uvot1uxfbi21jb/xRocCTHcZstHlRxOg+tNx5T6W/7j+JIy+2rrZhpzlFK4Sl9djCJu9WLXj0WC2meUHpqFBv989K2x5bjyaO5IcPZe6L0MwQIjKaAUDSafVM1gbMTeFh3PnwVU9tjcX3/Rbe249Xiz2Np8Dprz8ToVmy2rsazhS9jc8/3hjiMNTqxuv8ojrTRY2817o19vZKtec3+3KUP4svBk6k00Xt8PWbSZzYvx8LSj6uVswNxJQIELqqAUHRRO+++z4FAfwPC9vS1uJRuZvFtbMT/jd5hZ34ddMMf/1d9ubcUs4MnNOnJS6uK7cHTmfSd1nisPH7+9dyhtAx/MmbSq6ujAFOI2X4bS0tze8PKYEl9+p2DdrhOK8wm/xI3Lnd3lvlfHov19a1YXvxFrDb3PxKKzsHwdQsEChQQigpsipIIHCowV7f+8XLcWL0Ut9vbMX7Q59JS9W4nXhz79KQxaTrNzbn8Op7uvoZ6WHcevI27g9PpYyOez/+2et7/vbl6bOZG3E87UR/VqfSKbb2Op1/9qnoz+NxRE65P0vXB/katTvTaL2Le67OT6PksAQKHCQhFxgaBERBIe/10ezHZ68b1uh1D/e92u46N2yvx5WFL3Aervg5dCv953b7/xc4O0mk+z6XL8eTvn1Qbu1xzdev7EWPPruw8qUr/9OpoXRuP64Mw9c5eQkdNuB62D40wd9BruGEv43MECBDYLzDU/3PFRoBABoGvnwq9bcdkWgLfrCA92Wl34s2V7Vj5+4t0tEbEg4nobLZiYnw7bqTl6um/pTDTnor5d1aJfV63783Hh+lp01GHpw5OsU/XeufsskNJ6urjT2O6246Jg57kNCdcr3Zj8eWvq9dD6z6sO/ffxEwKaulJVLeyT9HQdj5IgMCxAkLRsUQ+QCCPQPMA1FRBmofT7cXy4kS83F2uflBpc/XYg4mYHjyt6Z9APxFPmt/5eK6+vDURD1J4eneicl1N/TWuja3FnRQ+Bj/Rf+ozE/PDLH//x9/XNzc6MX3IE6axj2/G9Uez8WaYa/V//2HdubsWk+ObMZGelKVA1OrFV1/8pnqZpzt+lQCB8yggFJ3Hrrqn8yGQjrX4S8ymSc0nXnreOIE+YXR6sfzol7E4mKzcnNuzG4p2Xkvd7rRjYvCkKX03vYbbuhLPj52jNFBv/vYBq8yGac70Z/XdGIvrKZFtd6PdfGWYQl5EPLOT9TCSPkOAwEkEhKKTaPksgfcsMPnneuJKN+6lnx3+9dVOkd+fq8dXbsaDtIpr/2qvPU+KerE81opLzadCQz+V2uNRVx/8Ia63W/FBf8frxr5CJ2VrhrbBd1MY6l6K5y8+iTfNlWgnvbbPEyBA4DABocjYIFCyQGO35/7uza/7h632NzUc5p/BZovps80jMQbniDWX3qfPfPNUKN4eGzwe1p2Ztbjfq2MsPdFpXmurFVtXbsXC0Dte77+ZNOfpaUy2V2J7qxPrix/F+tCv2oaB8RkCBAgcICAUGRYEChdong22fyfo40pvnlC/50iMfSfO91+v3Yznx8xV6q82+2Y12zcHvQ7qSE+Ytrfj1cJKvBjmTLTj6vd3AgQIvE8Boeh9avstAqcQaAabEy9Bb4Sf/SvBmq/m9s85OqjM/lOndlyZ/2XMDzaITJs/rr6Om1fr2Bhrx9qeJfunuFdfIUCAQE4BoSinvt8mMIxAI9gcuhP0EdcZnBOWPrJnpVljH6K0mmv1ciy++KRafudSdV3N/Hv/nLHJA1eTDXMPPkOAAIEREBCKRqBJShxtgXQkxdJSrJ9kLtD+O24+1WnODRpGZnCy/TuhKCL6E5rrmBms7upf+1U879c6V7cmJ+N6ZyPuDPZJqqr46snPqhfD/K7PECBAYNQEhKJR65h6R0igrqY/i6mxVtxqb8bSt9pT51tMuG5uwHjQ4alpM8Xtdnxw1E7Z6QnR+rVYHHpZ/gh1SakECBAYCAhFxgKB70igucLrneMuTvGbp51wPcw5YemJUUTc3b9ztonTp2iUrxAgMLICQtHItk7hoyBw9z/q6U4vblZjUXc305EUsZp2i+68icleO56fZAPCU024bpw1NkwwS3sbDc4yu7sWG4edmzYK9mokQIDASQWEopOK+TyBEwg0j+pImw922tHePZdsK1Ye/yq+PHY/oN3f+2YJ/LATrpvzib71K7wT3LePEiBAYBQFhKJR7JqaR0RgZ4fnK1Xc3W5He1B0Wuk1FvHmzs14/rcfVenIiqH/ae70fNyE6/Rk6c1GzKRXYqfZ+HHoonyQAAEC50RAKDonjXQbZQmkQLLZi9n9O0Zv9mJ5aTWenXpjw8aE63YrtqauxuODglXaP2jtVcyMpSM+elGv1/H0q19Vb8pSUg0BAgTKEhCKyuqHas6LwNeHuVbrcSXGYrXaisvpadEw83qOI2hOuO604tmjn1avdr8zV7emr8UHnTpuDk6TH9+OZ//v19Xr467r7wQIELjoAkLRRR8B7v+UAnWVJkxf2oib3SoujW/Get2Jl09+Vq01AspYOk4sPRV6d8J19faUPxzvTLh+EQvfm4xOtxeTvW5cHyytt4z+tMK+R4DARRUQii5q5933qQXSCfNr1+L+/uXr6YKHbW7YnHDdOvEE6/2l7j1zLB3fsd39Zs5S+nT/N27F0pFnmZ1awBcJECBwPgWEovPZV3e1X+Dr3ZknIza+zflcacn6ys14kOYKpbk6/UBSR2uwouzQ+Ttfv06Lblw9i6MymhOuB7eaVqR1e7G8OBEvhSH/EyBAgMDJBYSik5v5xogJpLO/qtWYTK+VUiBpT8X8ox9W60PdxsO6M70ctyPi2pW38WVcjVvddkzUdbzYPQm+cTZYuuZhK72aR3V86+Xxjf2HtuvY2LoSz5d+HG+HX94/1N37EAECBC6UgFB0odp9MW/2oz/V97e248bg7tN+QYsT8WSYpynNIDPWijfrW3G56sbK099WS3s162rq05geb8dE+u9rnXj6zuGqjZVjZzHhOq0we7QZvWHu42J23l0TIEDgZAJC0cm8fHoEBQahqL/h4VZU6YnR0MGoEWTSrR+1DL75ai06sTr/k5iPqqqbZIOVY9/scH36Cdcj2AolEyBAoGgBoajo9ijuLAQGoaiOWBvvRTe9/krXTf++8GEsxA+q3lG/01wCX3djfWE9nhy2z9DuKrMUwCLm96xGi4g0SXtrIh6kOUjffsL1Wei4BgECBAgMBIQiY+HcC3z8aX2vPw/o6xA09SimBq+5+v/tTcwftZliM8j05wvNxuPDglRzldmBO043JlynSdmrl2Ox/5rtYd358FVMvbOs/9x3xw0SIECgHAGhqJxeqOQ7Epj9XX0nLsWd3ac8ETFzI2ariCvpJ1vjsfL4eTw9NBg1g0wV22PL8eTR3CETtRsToA971dZfOVbHzGA/oeZt9ydw/7z66juicFkCBAgQOEJAKDI8zr3AIBT15xG9jccxV23FXD12/3rMtqq4lAD6x2/8MhYPW73VnHB9XHD5h3+tb/fGYypd97BVZoOa9gSi9Grudnxp4vS5H5JukACBQgWEokIbo6yzEzgwFKXL7yy3fzDYhPHIYNSYcH3c4ar/9LDuLK3Gh2kvo6NWmX29CeREu4rtWyux/N9z1ebZ3bUrESBAgMBJBYSik4r5/MgJHBqKIiLNAaq2Ymb3FPuNeD7/2+r5QTfZnHB94JL7xpeOm3A9cogKJkCAwAUQEIouQJMv+i0eFYqSzbDB6J0zxw5Ycj+wPnbC9UVvivsnQIBAgQJCUYFNUdLZCgxCUTqSo/0i5g+aJJ12vY6NuJN+Oa0KO/hk+W/OHDv2qI40OfvTmO1frxPP9y/NP9s7dDUCBAgQOAsBoegsFF2jaIFBKEqbN+5ZOfZ53Z79e9xqjcWt3ddnX9/JYWeYNc8cO27CddEoiiNAgACBdwSEIoPi3As8+GM9WdfxQT8U3Y4nY2+i7vZisnn0R0JIT3967dgcLNVPn9+4FE+Xflyt7CKdYML1uYd1gwQIEDhnAkLROWuo23lXYOqv9fXx9Zjpv8qqYntwov3uJ7di9ZtXXHvPMEtBqR6Lhebrr5NMuNYPAgQIEBgdAaFodHql0lMKNEPR4BIp7Gxvxav578Wrd3enfjcYtadi/tEPdzZsTBOu05OmXh2vzBU6ZVN8jQABAgUKCEUFNkVJZyvQDEXpWI9WFV8dG2bSztSNXa/Txo933sa8vYTOtjeuRoAAgZIEhKKSuqGW70SgGYo2L8fCnjlCR/3iXN2anYyZWLOC7DtpjIsSIECgMAGhqLCGKOfsBU4dis6+FFckQIAAgYIFhKKCm6O0sxHYM6foiB2rz+bXXIUAAQIERlVAKBrVzql7aAGhaGgqHyRAgMCFFhCKLnT7L8bNT83V18dv7CzJD0+KLkbT3SUBAgROISAUnQLNV0ZLIJ1GvzURD/r7E12K5/P/fPCBr6N1V6olQIAAgbMWEIrOWtT1ihNIoag7GR9stuPV0o/jbURVF1ekgggQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oBqbn18AAA+3SURBVAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAkJR9hYogAABAgQIEChBQCgqoQtqIECAAAECBLILCEXZW6AAAgQIECBAoAQBoaiELqiBAAECBAgQyC4gFGVvgQIIECBAgACBEgSEohK6oAYCBAgQIEAgu4BQlL0FCiBAgAABAgRKEBCKSuiCGggQIECAAIHsAv8fTNaOmuBkwNEAAAAASUVORK5CYII=");'
        ></div>
      </ProLayout>
    );
  },
});

const SimpleDemo = {
  setup() {
    return () => (
      <div style={{ height: '100%' }}>
        <router-view />
      </div>
    );
  },
};

const RouteView = defineComponent({
  setup() {
    return () => <router-view />;
  },
});

const routes = [
  {
    path: '/welcome',
    name: 'welcome',
    meta: { title: 'Welcome', icon: 'SmileOutlined' },
    component: Welcome,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'dashboard', icon: 'SmileOutlined' },
    redirect: '/dashboard/analysis',
    component: RouteView,
    children: [
      {
        path: '/dashboard/analysis',
        name: 'analysis',
        meta: { icon: 'SmileOutlined', title: 'Analysis' },
        component: Page1,
      },
      {
        path: '/dashboard/monitor',
        name: 'monitor',
        meta: { icon: 'SmileOutlined', title: 'Monitor' },
        component: Page1,
      },
      {
        path: '/dashboard/workplace',
        name: 'workplace',
        meta: { icon: 'SmileOutlined', title: 'Workplace' },
        component: Page1,
      },
    ],
  },
  {
    path: '/form',
    name: 'form',
    meta: { title: 'Form', icon: 'SmileOutlined' },
    redirect: '/form/basic-form',
    component: RouteView,
    children: [
      {
        path: '/form/basic-form',
        name: 'basic-form',
        meta: { icon: 'SmileOutlined', title: 'Basic Form' },
        component: FormPage,
      },
      {
        path: '/form/step-form',
        name: 'step-form',
        meta: { icon: 'SmileOutlined', title: 'Step Form' },
        component: FormPage,
      },
      {
        path: '/form/advanced-form',
        name: 'advance-form',
        meta: { icon: 'SmileOutlined', title: 'Advanced Form' },
        component: FormPage,
      },
      {
        path: '/form/child',
        name: 'child-form',
        meta: { icon: 'SmileOutlined', hideInMenu: true, title: 'Child Form' },
        redirect: '/form/child/page1',
        component: ChildPage,
        children: [
          {
            path: '/form/child/page1',
            name: 'child-page1-form',
            meta: { title: 'Page1 Child' },
            component: FormPage,
          },
          {
            path: '/form/child/page2',
            name: 'child-page2-form',
            meta: { title: 'Page2 Child' },
            component: FormPage,
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { title: '' },
      redirect: '/welcome',
      component: BasicLayout,
      children: routes,
    },
  ],
  history: createWebHashHistory(),
});

const app = createApp(SimpleDemo);

registerIcons(app);

app.use(router).use(ProLayout).mount('#app');
