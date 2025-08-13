// 路由组件，本项目中不涉及

import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import YlMoments from '../views/YlMoments.vue'
import PersonInfo from "@/components/PersonInfo.vue";
import MainLayout from "@/components/MainLayout.vue";
import UserList from "@/components/UserList.vue";

const routes = [
  {
    path: '/',
    redirect:"/Login"
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/Main',
    name: 'Main',
    component: MainLayout,
    redirect: '/Main',
    children: [
      {
        path: '/YlMoment',
        name: 'YlMoment',
        component: YlMoments
      },
      {
        path: '/List',
        name: 'List',
        component: UserList
      },
      {
        path: '/Info',
        name: 'Info',
        component: PersonInfo
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router