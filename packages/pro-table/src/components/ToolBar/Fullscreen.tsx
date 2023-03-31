import { defineComponent, shallowReactive, watchPostEffect } from 'vue';
import { useSharedContext } from '../../store/Provider';
import { Tooltip } from 'ant-design-vue';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';

import 'ant-design-vue/es/tooltip/style';

const FullScreen = defineComponent({
  setup() {
    const { actionRef, getMessage: t } = useSharedContext();

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

    const onClick = () => actionRef?.fullScreen();

    return () =>
      state.fullscreen ? (
        <Tooltip title={t('tableToolBar.exitFullScreen', '退出全屏')}>
          <FullscreenExitOutlined onClick={onClick} />
        </Tooltip>
      ) : (
        <Tooltip title={t('tableToolBar.fullScreen', '全屏')}>
          <FullscreenOutlined onClick={onClick} />
        </Tooltip>
      );
  },
});

export default FullScreen;
