<template>
  <div class="toast">{{ message }}</div>
</template>

<script>
import { reactive, toRefs } from "vue";
export default {
  name: "Toast",
  props: ["message"],
};
export const useToastEffect = () => {
  const toastData = reactive({
    showToast: false,
    toastMessage: "",
  });
  const showToastFun = (message) => {
    toastData.showToast = true;
    toastData.toastMessage = message;
    setTimeout(() => {
      toastData.showToast = false;
      toastData.toastMessage = "";
    }, 2000);
  };
  const { showToast, toastMessage } = toRefs(toastData);
  return {
    showToast,
    toastMessage,
    showToastFun,
  };
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../style/viriables.scss';
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.1rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0.05rem;
  color: $bgColor;
}
</style>
