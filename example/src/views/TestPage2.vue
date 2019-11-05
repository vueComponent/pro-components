<template>
  <document-title :title="$t($route.meta.title)">
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
  </document-title>
</template>

<script>
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
  }
}
</script>

<style lang="less" scoped>
.page-test-wrapper {
  width: 400px;
  margin: 0 auto;
}
</style>
