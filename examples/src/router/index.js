import Vue from 'vue'
import VueRouter from 'vue-router'
import { asyncRouterMap } from '@/config/router.config'

// hack router push/replace callback
['push', 'replace'].map(key => {
  return {
    k: key,
    prop: VueRouter.prototype[key]
  }
}).forEach(item => {
  VueRouter.prototype[item.k] = function newCall (location, onResolve, onReject) {
    if (onResolve || onReject) return item.prop.call(this, location, onResolve, onReject)
    return item.prop.call(this, location).catch(err => err)
  }
})

Vue.use(VueRouter)

const routes = asyncRouterMap

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
