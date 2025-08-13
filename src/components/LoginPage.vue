<template>
  <div class="login-container">
    <div class="login-background-overlay"></div>

    <van-form @submit="onSubmit" class="login-form" required="auto">
      <!-- 登录标题 -->
      <div class="login-header">
        <i class="fa-solid fa-hospital" style="scale: 200%;color:#7087e9"></i>
        <h2 class="login-title">养老管理系统</h2>
        <p class="login-subtitle">请填写信息登录系统</p>
      </div>

      <!-- 姓名输入 -->
      <van-field
          v-model="name"
          name="name"
          label="姓名"
          left-icon="contact"
          input-align="center"
          :rules="[{ required: true, message: '请填写姓名' }]"
          class="custom-field"
      />

      <!-- 身份证号输入 -->
      <van-field
          v-model="pwd"
          name="pwd"
          label="密码"
          type="text"
          left-icon="idcard"
          input-align="center"
          :rules="[{ required: true, message: '请填写密码' }]"
          class="custom-field"
      />

<!--      <van-field-->
<!--          v-model="captcha"-->
<!--          name="captcha"-->
<!--          label="验证码"-->
<!--          type="number"-->
<!--          left-icon="shield-o"-->
<!--          maxlength="4"-->
<!--          input-align="center"-->
<!--          :rules="[{ required: true, message: '请填写验证码' }, { validator: validateCaptcha, message: '验证码错误' }]"-->
<!--          class="custom-field captcha-field"-->
<!--      >-->
<!--        <template #button>-->
<!--          <div class="captcha-image" @click="refreshCaptcha">-->
<!--            <img :src="captchaImage" alt="验证码" v-if="captchaImage" />-->
<!--            <span v-else class="loading-text">加载中...</span>-->
<!--          </div>-->
<!--        </template>-->
<!--      </van-field>-->

      <div class="login-button">
        <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            class="custom-login-btn"
        >
          <span v-if="!loading">登 录</span>
          <van-loading v-else type="spinner" color="white" size="20px" />
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
import {showFailToast, showSuccessToast} from 'vant';
import '@fortawesome/fontawesome-free/css/all.css';
// eslint-disable-next-line no-unused-vars
import router from "@/router/router";
import {useStore} from "vuex";
import {ysnget} from "@/utils/request";

const store = useStore();

const name = ref('ysntj');
const pwd = ref('1');
// eslint-disable-next-line no-unused-vars
const captcha = ref('');
const loading = ref(false);

// 验证码相关
const captchaCode = ref('');
const captchaImage = ref('');

// 安全的Canvas操作
const generateCaptcha = async () => {
  await nextTick();

  try {
    captchaCode.value = Math.floor(1000 + Math.random() * 9000).toString();

    // 创建离屏Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      Error('无法获取Canvas上下文');
    }

    canvas.width = 90;
    canvas.height = 40;

    // 背景色
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制验证码
    ctx.font = '24px Arial';
    ctx.fillStyle = '#7087e9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(captchaCode.value, canvas.width / 2, canvas.height / 2);

    // 添加干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    captchaImage.value = canvas.toDataURL();
  } catch (error) {
    console.error('生成验证码失败:', error);
    // 备用验证码
    captchaCode.value = '1234';
    captchaImage.value = '';
    showFailToast('验证码生成失败，请使用1234');
  }
};

// 刷新验证码
// eslint-disable-next-line no-unused-vars
const refreshCaptcha = () => {
  captchaImage.value = '';
  generateCaptcha();
};


// 验证码验证
// eslint-disable-next-line no-unused-vars
const validateCaptcha = (value) => {
  return value === captchaCode.value;
};

// 提交表单
const onSubmit = async () => {
  try {
    loading.value = true;

    // 使用Vuex action进行登录
    const data = await ysnget("/Account/loginYd", {
      name:name.value,
      pws: pwd.value,
    })
    if (data.istrue) {
      showSuccessToast('登录成功');
      store.commit('setUserInfo', data.data);
      await router.push('/YlMoment');
    } else {
      showFailToast("登录失败: " + (data.msg || '未知错误'));
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    showFailToast(error.message || '网络错误，请重试');
  } finally {
    loading.value = false;
  }
};

// 初始化时生成验证码
onMounted(() => {
  generateCaptcha();
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, white, #7087e9);
  position: relative;
  overflow: hidden;
}

.login-background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  z-index: 0;
}

.login-form {
  width: 100%;
  max-width: 420px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1;
  position: relative;
  transform: translateY(-5%);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}


.login-title {
  color: #333;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
}

.login-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.custom-field {
  background-color: #f8f9ff;
  border-radius: 10px;
  margin-bottom: 18px;
  border: 1px solid #e0e6ff;
  transition: all 0.3s ease;
}

.custom-field:hover {
  border-color: #7087e9;
  box-shadow: 0 0 0 3px rgba(112, 135, 233, 0.1);
}

:deep(.van-field__left-icon) {
  color: #7087e9;
  margin-right: 8px;
}

.captcha-field {
  display: flex;
  align-items: center;
}

.captcha-image {
  height: 32px;  /* 减小高度 */
  width: 80px;   /* 减小宽度 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e0e6ff;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  margin-left: 8px; /* 增加左边距 */
}

.captcha-image:hover {
  border-color: #7087e9;
  transform: translateY(-1px);
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 改为contain保持比例 */
}

.loading-text {
  font-size: 12px;
  color: #7087e9;
}

.login-button {
  margin-top: 30px;
}

.custom-login-btn {
  background: linear-gradient(135deg, #7087e9, #8a6de9);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(112, 135, 233, 0.3);
  transition: all 0.3s ease;
}

.custom-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(112, 135, 233, 0.4);
}

@media (max-width: 480px) {
  .login-form {
    padding: 25px 20px;
    margin: 0 15px;
    transform: none;
  }

  .login-title {
    font-size: 22px;
  }

  .logo-wrapper {
    width: 70px;
    height: 70px;
  }
}
</style>