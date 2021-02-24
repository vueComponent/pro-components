import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return () => (
      <div>
        <h1>Child</h1>
        <router-view />
      </div>
    );
  },
});
