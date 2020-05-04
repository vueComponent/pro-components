<template>
  <page-header-wrapper>
    <div class="page-test-wrapper">
      <h1>Test Page2 keepAlive: {{ $route.meta.keepAlive }}</h1>
      <div class="box">
        <div style="margin: 1em 0">
          <a-input v-model="newVal" placeholder="..."/>
        </div>
        <a-button @click="handleClick">Click Me!</a-button>
        <a-divider />
        <p>{{ newVal }}</p>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

export default {
  data () {
    return {
      newVal: ''
    }
  },
  methods: {
    handleClick (e) {
      this.$router.push({ path: '/dashboard/analysis' })
    }
  },
  components: {
    ProLayout,
    PageHeaderWrapper
  }
}
</script>

<style lang="less" scoped>
.page-test-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>
