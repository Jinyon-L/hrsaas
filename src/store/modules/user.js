import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, result) {
    state.userInfo = result
    // state.userInfo = { ...result } // 这样也是响应式属于浅拷贝
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result)
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
