import { post, get } from '../utils/request'

export const login = (params) => {
  return post('/user/openid', params)
}