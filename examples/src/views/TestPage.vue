<template>
  <document-title title="我是PAGE1">
    <div class="page-test-wrapper">
      <h1>Test Page keepAlive: {{ $route.meta.keepAlive }}</h1>
      <div class="box">
        <div style="margin: 1em 0">
          <a-input placeholder="home"/>
        </div>
        <a-button @click="handleClick">Click Me!</a-button><a-divider type="vertical" />
        <a-button @click="handleRefresh">Refresh Current</a-button><a-divider type="vertical" />
        <a-button @click="handleGetAllCache">Get All Cache</a-button><a-divider type="vertical" />
        <a-button @click="handleChangeLang('zh-CN')">Lang zh-CN</a-button><a-divider type="vertical" />
        <a-button @click="handleChangeLang('en-US')">Lang en-US</a-button>
        <a-divider />
      </div>
    </div>
  </document-title>
</template>

<script>
import { loadLanguageAsync } from '@/locales'

export default {
  methods: {
    handleClick (e) {
      this.$router.push({ path: '/page2' })
    },
    handleClearPage1 () {

    },
    handleGetAllCache () {
      this.$tab.caches((data) => {
      })
    },
    handleRefresh () {
      // this.$tab.refresh('/page2')
      this.$tab.refresh()
    },
    handleChangeLang (lang) {
      loadLanguageAsync(lang)
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
