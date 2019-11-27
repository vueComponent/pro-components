/* eslint-disable */
/**
 * 该文件用于直接全量引入 antd
 * 如果想减少依赖体积，可以使用同目录下的 lazyload.js 按需加载
 * 注意：需要同时修改 babel.config.js 文件下的配置项
 */
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

Vue.use(Antd)
