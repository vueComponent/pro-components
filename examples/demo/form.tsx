import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    return () => (
      <div>
        <h1>Form: {route.meta.title}</h1>
        <pre>{JSON.stringify(route.meta, null, 4)}</pre>
      </div>
    );
  },
});
