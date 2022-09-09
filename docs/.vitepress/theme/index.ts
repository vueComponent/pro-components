import DefaultTheme from 'vitepress/theme'
import ProLayout, { PageContainer } from "../../../packages/pro-layout/";
import {QueryFilter} from "../../../packages/pro-form";

export default {
  ...DefaultTheme,
 enhanceApp({ app }) {
  app.component('ProLayout', ProLayout)
  app.component('PageContainer', PageContainer)
  app.component('QueryFilter', QueryFilter)
 }
}