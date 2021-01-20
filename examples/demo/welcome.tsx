import { defineComponent } from 'vue';
import { Button, Space, Select, Switch } from 'ant-design-vue';
import { globalState as state } from '../state';

export default defineComponent({
  setup() {
    return () => (
      <div>
        <div>Welcome</div>
        <Space>
          <Button
            onClick={() => {
              state.navTheme = state.navTheme === 'dark' ? 'light' : 'dark';
            }}
          >
            Theme Switch
          </Button>
          <Select
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
        </Space>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
        <p>
          <p>block</p>
          ...
          <br />
          long text..
        </p>
      </div>
    );
  },
});
