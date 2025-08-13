<template>
  <div>
    <!-- 主内容区 -->
    <router-view />

    <!-- 底部导航栏（仅对需要显示的页面生效） -->
    <van-tabbar  route active-color="#7087e9" fixed>
      <van-tabbar-item name="home" icon="home-o" to="/YlMoment">首页</van-tabbar-item>
      <van-tabbar-item name="menu" icon="notes-o" to="/List">项目信息</van-tabbar-item>
      <van-tabbar-item name="info" icon="user-o" to="/Info">个人信息</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup/>
