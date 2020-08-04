<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="(key) => {
      this.tabActiveKey = key
      console.log('PageHeader::tabChange', key)
    }"
    @back="() => {
      console.log('PageHeader::@back')
    }"
    :back="() => {
      // 自定义 back，不会覆盖 onBack 事件
      console.log('PageHeader::.back')
    }"
  >
    <template v-slot:title>
      自定义标题
    </template>
    <template v-slot:tags>
      <a-tag color="pink">tag1</a-tag>
      <a-tag>tag2</a-tag>
    </template>
    <template v-slot:content>
      <span>{{ $t('pages.form.basicform.content') }}</span>
    </template>
    <template v-slot:extraContent>
      <div><a-button>{{ $t('pages.form.basicform.headers.btn1') }}</a-button></div>
    </template>
    <div>
      <strong>Basic Form</strong>
    </div>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'BasicForm',
  data () {
    return {
      console: window.console,
      tabList: [
        { tab: 'pages.form.basicform.tabs.tab1', key: 'tab1' },
        { tab: 'pages.form.basicform.tabs.tab2', key: 'tab2' },
        { tab: 'pages.form.basicform.tabs.tab3', key: 'tab3' }
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
