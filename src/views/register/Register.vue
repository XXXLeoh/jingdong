<template>
  <div class="wrapper">
    <img
      src="http://www.dell-lee.com/imgs/vue3/user.png"
      class="wrapper__img"
    />
    <div class="wrapper__input">
      <input
        class="wrapper__input__content"
        placeholder="请输入用户名"
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
    <div class="wrapper__input">
      <input
        class="wrapper__input__content"
        placeholder="确认密码"
        v-model="ensurement"
      />
    </div>
    <div class="wrapper__register-button" @click="handleClick">注册</div>
    <div class="wrapper__register-link" @click="handleLoginClick">
      已有账号去登陆
    </div>
    <Toast v-show="showToast" :message="toastMessage" />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { post } from "../../utils/request";
import Toast, { useToastEffect } from "../../components/Toast.vue";

// 处理注册逻辑
const useRegisterEffect = (showToastFun) => {
  const router = useRouter();
  const data = reactive({
    username: "",
    password: "",
    ensurement: "",
  });
  const handleClick = async () => {
    try {
      const { username, password, ensurement } = data;
      if (username === "" || password === "") {
        showToastFun("请输入用户名或密码");
        return;
      }
      if (ensurement === "") {
        showToastFun("请再次输入密码");
        return;
      } else if (ensurement !== password) {
        showToastFun("两次密码不匹配");
        return;
      }
      const result = await post("/api/user/register", {
        username: data.username,
        password: data.password,
      });
      if (result?.errno === 0) {
        showToastFun("注册成功，将跳转到登陆页");
        setTimeout(() => {
          router.push({ name: "Login" });
        }, 2000);
      } else {
        showToastFun("注册失败");
      }
    } catch (e) {
      showToastFun("请求失败");
    }
  };
  const { username, password, ensurement } = toRefs(data);
  return {
    username,
    password,
    ensurement,
    handleClick,
  };
};

// 跳转登录页面逻辑
const useLoginEffect = () => {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push({ name: "Login" });
  };
  return { handleLoginClick };
};
export default {
  name: "Register",
  components: { Toast },
  setup() {
    const { showToast, toastMessage, showToastFun } = useToastEffect();
    const { username, password, ensurement, handleClick } =
      useRegisterEffect(showToastFun);
    const { handleLoginClick } = useLoginEffect();

    return {
      showToast,
      toastMessage,
      username,
      password,
      ensurement,
      handleClick,
      handleLoginClick,
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
    border: .01rem solid rgba(0, 0, 0, 0.1);
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
  &__register-button {
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
  &__register-link {
    text-align: center;
    font-size: .14rem;
    color: $content-notice-fontcolor;
  }
}
</style>
