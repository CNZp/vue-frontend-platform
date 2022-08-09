import request from '@/utils/request'

export function login_mk(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo_mk(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/getLoginUser',
    method: 'get'
  })
}

export function logout_mk() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
