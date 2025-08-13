import { createStore } from 'vuex'

const store= createStore({
    state: {
        userInfo: {}, // 存储用户信息
        token: ''     // 存储token
    },
    mutations: {
        // 设置用户信息
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },
        // 清除用户信息
        CLEAR_USER_INFO(state) {
            state.userInfo = null
            state.token = null
        }
    }
})
export default store