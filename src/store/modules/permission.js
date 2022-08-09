import { asyncRoutes, constantRoutes, resourceRouteMap } from '@/router'
import { getUserResource } from '@/api/role'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function initUserResourceRoutes(userResources) {
  debugger
  function initRoutes(resources, routes) {
    resources.forEach((resource) => {
      let route = {
        isMenu: true,
        name: resource.name,
        meta: {
          title: resource.name
        }
      }
      if (resource.CHILD_MENU?.length) {
        const children = []
        route.children = children
        initRoutes(resource.CHILD_MENU, children)
      }
      route.path = resource.url || ('/' + resource.code)
      route = { ...route, ...resourceRouteMap[resource.code] || {}}
      route.component = route.component || Layout
      routes.push(route)
    })
  }
  const routes = []
  initRoutes(userResources, routes)

  routes.push({
    path: '/bk',
    component: Layout,
    name: '原始菜单',
    meta: {
      title: '原始菜单',
      icon: 'lock'
    },
    children: asyncRoutes
  })
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }

      getUserResource('menu', 'PLAT').then(response => {
        const { data } = response
        debugger
        accessedRoutes = initUserResourceRoutes(data)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
