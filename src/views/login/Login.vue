<template>
  <div class="wrapper">
    <img
      src="http://www.dell-lee.com/imgs/vue3/user.png"
      class="wrapper__img"
    />
    <div class="wrapper__input">
      <input
        class="wrapper__input__content"
        placeholder="用户名"
        v-model="username"
      />
    </div>
    <div class="wrapper__input">
      <input
        class="wrapper__input__content"
        placeholder="请输入密码"
        v-model="password"
      />
    </div>
    <div class="wrapper__login-button" @click="handleClick">登陆</div>
    <div class="wrapper__login-link" @click="handleRegister">立即注册</div>
    <Toast v-show="showToast" :message="toastMessage" />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { post } from "../../utils/request";
import Toast, { useToastEffect } from "../../components/Toast.vue";

const useLoginEffect = (showToastFun) => {
  const router = useRouter();
  const data = reactive({
    username: "",
    password: "",
  });
  const handleClick = async () => {
    try {
      const {username,password} = data;
      if(username === '' || password === '') {
        showToastFun('请输入用户名或密码')
        return
      }
      const result = await post("/api/user/login", {
        username: data.username,
        password: data.password,
      });
      if (result?.errno === 0) {
        localStorage.isLogin = true;
        router.push({ name: "Home" });
      } else {
        showToastFun("登陆失败");
      }
    } catch (e) {
      showToastFun("请求失败");
    }
  };
  const { username, password } = toRefs(data);
  return {
    username,
    password,
    handleClick,
  };
};
const useRegisterEffect = () => {
  const router = useRouter();
  const handleRegister = () => {
    router.push({ name: "Register" });
  };
  return { handleRegister };
};
export default {
  name: "Login",
  components: {
    Toast,
  },
  setup() {
    const { showToast, toastMessage, showToastFun } = useToastEffect();
    const { username, password, handleClick } = useLoginEffect(showToastFun);
    const { handleRegister } = useRegisterEffect();

    return {
      showToast,
      toastMessage,
      username,
      password,
      handleClick,
      handleRegister,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
.wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  &__img {
    display: block;
    margin: 0 auto 0.4rem auto;
    width: 0.66rem;
    height: 0.66rem;
  }
  &__input {
    box-sizing: border-box;
    padding: 0 0.16rem;
    height: 0.48rem;
    margin: 0 0.4rem 0.16rem 0.4rem;
    background: #f9f9f9;
    border:.01rem solid rgba(0, 0, 0, 0.1);
    border-radius: .06rem;
    &__content {
      margin-top: .12rem;
      line-height: 0.22rem;
      border: none;
      outline: none;
      width: 100%;
      background: none;
      font-size: 0.16rem;
      color: $content-notice-fontcolor;
      &::placeholder {
        color: $content-notice-fontcolor;
      }
    }
  }
  &__login-button {
    width: 2.95rem;
    line-height: 0.48rem;
    margin: 0.32rem 0.4rem 0.16rem 0.4rem;
    background: $btn-bgColor;
    box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 145, 255, 0.32);
    border-radius: 0.04rem;
    color: $bgColor;
    font-size: 0.16rem;
    text-align: center;
  }
  &__login-link {
    text-align: center;
    font-size: .14rem;
    color: $content-notice-fontcolor;
  }
}
</style>
