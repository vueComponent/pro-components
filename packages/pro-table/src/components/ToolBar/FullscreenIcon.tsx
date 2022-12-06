import { defineComponent, shallowReactive, watchPostEffect } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';

import 'ant-design-vue/es/tooltip/style';

const FullScreen = defineComponent({
  setup() {
    const state = shallowReactive<{
      fullscreen: boolean;
    }>({
      fullscreen: false,
    });

    watchPostEffect(() => {
      document.onfullscreenchange = () => {
        state.fullscreen = !!document.fullscreenElement;
      };
    });

    // TODO: t('tableToolBar.exitFullScreen', '退出全屏')
    // TODO: t('tableToolBar.fullScreen', '全屏')
    return () =>
      state.fullscreen ? (
        <Tooltip title={`退出全屏`}>
          <FullscreenExitOutlined />
        </Tooltip>
      ) : (
        <Tooltip title={`全屏`}>
          <FullscreenOutlined />
        </Tooltip>
      );
  },
});

export default FullScreen;
