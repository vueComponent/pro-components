import { defineComponent } from 'vue';
import { SettingOutlined } from '@ant-design/icons-vue';

const ColumnSetting = defineComponent({
  setup() {
    return () => <SettingOutlined />;
  },
});

export default ColumnSetting;
