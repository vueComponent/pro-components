<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less" scoped>
.nav-container {
  width: 400px;
  padding-top: 100px;
  margin: 0 auto;

  ul {
    li {
      display: inline-block;
      margin: 0 10px;
    }
  }

  a {
    user-select: none;
    text-decoration: none;

    &.router-link-active {
      color: #FF0000;
    }
  }
}
</style>
