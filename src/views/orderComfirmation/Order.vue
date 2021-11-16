<template>
  <div class="order">
    <div class="order__price">
      实付金额 <b>¥{{ caculations.price }}</b>
    </div>
    <div class="order__btn" @click="handleSubmit(true)">提交订单</div>
  </div>
  <div class="mask" v-show="showMask" @click="handleSubmit(false)">
    <div class="mask__content" @click.stop>
      <h3 class="mask__content__title">确认离开收银台吗？</h3>
      <p class="mask__content__desc">请尽快完成支付，否则将被取消</p>
      <div class="mask__content__btns">
        <div
          class="mask__content__btn mask__content__btn--first"
          @click="handleConfirmClick(true)"
        >
          取消订单
        </div>
        <div
          class="mask__content__btn mask__content__btn--last"
          @click="handleConfirmClick(false)"
        >
          确认支付
        </div>
      </div>
    </div>
    <Toast v-show="showToast" :message="toastMessage" />
  </div>
</template>

<script>
import { ref } from "vue";
import { useCommonCartEffect } from "../../effects/cartEffect";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { post } from "../../utils/request";
import Toast, { useToastEffect } from "../../components/Toast.vue";

// 订单相关逻辑
const useMakeOrderEffect = (shopId,shopName, productList) => {
  const router = useRouter();
  const store = useStore();
  const { showToast, toastMessage, showToastFun } = useToastEffect();
  const handleConfirmClick = async (isCanceled) => {
    const products = [];
    for (let key in productList.value) {
      const product = productList.value[key];
      products.push({ id: parseInt(product._id), num: product.count });
    }
    try {
      const result = await post("/api/order", {
        addressId: 1,
        shopId,
        shopName: shopName.value,
        isCanceled,
        products,
      });
      if (result?.errno === 0) {
        store.commit("clearCart", shopId);
        router.push({ name: "OrderList" });
      } else {
        showToastFun("支付失败");
      }
    } catch (e) {
      showToastFun("网络请求失败");
    }
  };
  return { showToast, toastMessage, handleConfirmClick };
};
// 蒙层相关逻辑
const useShowMaskEffect = () => {
  const showMask = ref(false);
  const handleSubmit = (status) => {
    showMask.value = status;
  };
  return { showMask, handleSubmit };
};

export default {
  name: "Order",
  components: {
    Toast,
  },
  setup() {
    const route = useRoute();
    const shopId = parseInt(route.params.id);
    const { caculations, shopName, productList } = useCommonCartEffect(shopId);
    const { showToast, toastMessage, handleConfirmClick } = useMakeOrderEffect(
      shopId,
      shopName,
      productList
    );
    const { showMask, handleSubmit } = useShowMaskEffect();
    return {
      caculations,
      showToast,
      toastMessage,
      handleConfirmClick,
      showMask,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
.order {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0.49rem;
  line-height: 0.49rem;
  background: $bgColor;
  &__price {
    flex: 1;
    text-indent: 0.24rem;
    font-size: 0.16rem;
    color: $content-fontcolor;
  }
  &__btn {
    width: 0.98rem;
    background-color: #4fb0f9;
    font-size: 0.14rem;
    text-align: center;
    text-decoration: none;
    color: $bgColor;
  }
}
.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 1.57rem;
    background: #fff;
    border-radius: 0.04rem;
    text-align: center;
    &__title {
      margin: 0.24rem 0 0 0;
      line-height: 0.26rem;
      font-size: 0.18rem;
      color: #333;
    }
    &__desc {
      margin: 0.08rem 0 0 0;
      font-size: 0.14rem;
      color: #666;
    }
    &__btns {
      display: flex;
      margin: 0.24rem 0.58rem;
    }
    &__btn {
      flex: 1;
      width: 0.8rem;
      line-height: 0.32rem;
      font-size: 0.14rem;
      border-radius: 0.16rem;
      &--first {
        margin-right: 0.12rem;
        border: 0.01rem solid #4fb0f9;
        color: #4fb0f9;
      }
      &--last {
        margin-left: 0.12rem;
        background: #4fb0f9;
        color: #fff;
      }
    }
  }
}
</style>
