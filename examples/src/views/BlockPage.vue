<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="(key) => {
      this.tabActiveKey = key
      console.log('PageHeader::tabChange', key)
    }"
    :breadcrumb="false"
  >
    <template slot="content">
      <span>{{ $t('pages.form.basicform.content') }}</span>
    </template>
    <template slot="extraContent">
      <div><a-button>{{ $t('pages.form.basicform.headers.btn1') }}</a-button></div>
    </template>
    <div>
      <strong>Block Page</strong>
    </div>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'BlockPage',
  data () {
    return {
      console: window.console,
      tabList: [
        { tab: 'Tab1', key: 'tab1' },
        { tab: 'Tab2', key: 'tab2' },
        { tab: 'Tab3', key: 'tab3' }
      ],
      tabActiveKey: 'tab1'
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
      console.log('PageHeader::tabChange', key)
    }
  }
}
</script>

<style scoped>

</style>
