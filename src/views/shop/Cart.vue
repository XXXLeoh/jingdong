<template>
  <div
    class="mask"
    v-show="showCart && caculations.total > 0"
    @click="handleCartShow"
  ></div>
  <div class="cart">
    <div class="product" v-show="showCart && caculations.total > 0">
      <div class="product__header">
        <div
          class="product__header__all"
          @click="setCartItemIfChecked(shopId, caculations.allChecked)"
        >
          <span
            class="product__header__icon iconfont"
            v-html="caculations.allChecked ? '&#xe656;' : '&#xe61a;'"
          ></span>
          全选
        </div>
        <div class="product__header__clear" @click="clearCartProduct(shopId)">
          清空购物车
        </div>
      </div>
      <div class="product__item" v-for="item in productList" :key="item._id">
        <div
          class="product__item__checked iconfont"
          v-html="item.check ? '&#xe656;' : '&#xe61a;'"
          @click="changeCartItemChecked(shopId, item._id)"
        ></div>
        <img :src="item.imgUrl" class="product__item__img" />
        <div class="product__item__details">
          <h4 class="product__item__title">{{ item.name }}</h4>
          <p class="product__item__price">
            <span class="product__item__yen">&yen;</span>{{ item.price }}
            <span class="product__item__origin">&yen;{{ item.oldPrice }}</span>
          </p>
        </div>
        <div class="product__number">
          <span
            class="product__number__minus iconfont"
            @click="changeCartItemInfo(shopId, item._id, item, -1)"
            >&#xe66d;</span
          >
          {{ item.count ?? 0 }}
          <span
            class="product__number__add iconfont"
            @click="changeCartItemInfo(shopId, item._id, item, 1)"
            >&#xe7e0;</span
          >
        </div>
      </div>
    </div>
    <div class="check">
      <div class="check__icon" @click="handleCartShow">
        <img
          src="http://www.dell-lee.com/imgs/vue3/basket.png"
          class="check__icon__img"
        />
        <div class="check__icon__tag">{{ caculations.total }}</div>
      </div>
      <div class="check__info">
        总计：<span class="check__info__price"
          >&yen; {{ caculations.price }}</span
        >
      </div>
      <div class="check__btn" v-show="caculations.total > 0">
        <router-link :to="{ path: `/orderComfirmation/${shopId}` }">
          去结算
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useCommonCartEffect } from "../../effects/cartEffect";

// 获取购物车信息逻辑
const useCartEffect = (shopId) => {
  const store = useStore();
  const { changeCartItemInfo, productList, caculations } =
    useCommonCartEffect(shopId);
  const changeCartItemChecked = (shopId, productId) => {
    store.commit("changeCartItemChecked", { shopId, productId });
  };
  const clearCartProduct = (shopId) => {
    store.commit("clearCartProduct", { shopId });
  };
  const setCartItemIfChecked = (shopId, allChecked) => {
    store.commit("setCartItemIfChecked", { shopId, allChecked });
  };

  return {
    changeCartItemInfo,
    productList,
    caculations,
    changeCartItemChecked,
    clearCartProduct,
    setCartItemIfChecked,
  };
};
// 展示/隐藏购物车
const toggleCartEffect = () => {
  const showCart = ref(false);
  const handleCartShow = () => {
    showCart.value = !showCart.value;
  };
  return {
    showCart,
    handleCartShow,
  };
};

export default {
  name: "Cart",
  setup() {
    const route = useRoute();
    const shopId = route.params.id;
    const {
      caculations,
      productList,
      changeCartItemInfo,
      changeCartItemChecked,
      clearCartProduct,
      setCartItemIfChecked,
    } = useCartEffect(shopId);
    const { showCart, handleCartShow } = toggleCartEffect();
    return {
      shopId,
      caculations,
      productList,
      changeCartItemInfo,
      changeCartItemChecked,
      clearCartProduct,
      setCartItemIfChecked,
      showCart,
      handleCartShow,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";
.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.cart {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 2;
}
.product {
  flex: 1;
  overflow-y: scroll;
  background: $bgColor;
  &__header {
    display: flex;
    justify-content: space-between;
    height: 0.52rem;
    border-bottom: 0.01rem solid $content-bgColor;
    font-size: 0.14rem;
    color: $content-fontcolor;
    line-height: 0.52rem;
    &__all {
      width: 0.64rem;
      margin-left: 0.16rem;
    }
    &__icon {
      display: inline-block;
      color: $btn-bgColor;
      font-size: 0.2rem;
      vertical-align: top;
      margin-right: 0.03rem;
    }
    &__clear {
      width: 0.7rem;
      text-align: right;
      margin-right: 0.16rem;
    }
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    border-bottom: 0.01rem solid $content-bgColor;
    &__checked {
      line-height: 0.5rem;
      font-size: 0.2rem;
      margin-right: 0.2rem;
      color: $btn-bgColor;
    }
    &__img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &__details {
      overflow: hidden;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__price {
      margin: 0.06rem 0 0 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $highlight-fontColor;
    }
    &__yen {
      font-size: 0.12rem;
    }
    &__origin {
      margin-left: 0.06rem;
      line-height: 0.2rem;
      font-size: 0.12rem;
      color: #999;
      text-decoration: line-through;
    }
    .product__number {
      position: absolute;
      right: 0;
      bottom: 0.12rem;
      line-height: 0.18rem;
      &__minus {
        position: relative;
        top: .02rem;
        font-size: 0.2rem;
        color: $medium-fontColor;
        margin-right: 0.05rem;
      }
      &__add {
        position: relative;
        top: .02rem;
        font-size: 0.2rem;
        color: $btn-bgColor;
        margin-left: 0.05rem;
      }
    }
  }
}
.check {
  display: flex;
  height: 0.49rem;
  border-top: 0.01rem solid $content-bgColor;
  line-height: 0.49rem;
  &__icon {
    position: relative;
    width: 0.84rem;
    &__img {
      display: block;
      margin: 0.12rem auto;
      width: 0.28rem;
      height: 0.26rem;
    }
    &__tag {
      position: absolute;
      right: 0.15rem;
      top: 0.02rem;
      min-width: 0.2rem;
      height: 0.2rem;
      line-height: 0.2rem;
      background-color: $highlight-fontColor;
      border-radius: 0.1rem;
      font-size: 0.12rem;
      text-align: center;
      color: $bgColor;
      transform: scale(0.7);
      transform-origin: right center;
    }
  }
  &__info {
    flex: 1;
    color: $content-fontcolor;
    font-size: 0.12rem;
    &__price {
      line-height: 0.49rem;
      color: $highlight-fontColor;
      font-size: 0.18rem;
    }
  }
  &__btn {
    width: 0.98rem;
    background-color: #4fb0f9;
    font-size: 0.14rem;
    text-align: center;
    a {
      text-decoration: none;
      color: $bgColor;
    }
  }
}
</style>
