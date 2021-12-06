<template>
  <div class="wrapper">
    <div class="title">我的全部购物车（2）</div>
    <div class="products" v-for="(item, index) in cartList" :key="index">
      <div class="products__title">{{ item.shopName }}</div>
      <div class="products__wrapper">
        <div
          class="products__list__items"
          v-for="i in item.newProductList"
          :key="i._id"
          v-show="i.showProduct"
        >
          <div class="products__item">
            <img :src="i.imgUrl" class="products__item__img" />
            <div class="products__item__details">
              <h4 class="products__item__title">{{ i.name }}</h4>
              <p class="products__item__price">
                <span>
                  <span class="products__item__yen">&yen;</span>{{ i.price }} x
                  {{ i.count }}
                </span>
                <span class="products__item__total">
                  <span class="products__item__yen">&yen;</span
                  >{{ (i.price * i.count).toFixed(2) }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div
          class="products__total"
          v-if="cartList[index].newProductList.length > 2"
        >
          <div class="products__total__wrapper">
            <div
              class="products__total__wrapper__desc"
              @click="handleShowProductList(index)"
            >
              共计{{ cartList[index].newProductList.length }}种
              <span
                class="products__total__wrapper__icon iconfont"
                :class="[
                  cartList[index].upOrDown
                    ? 'products__total__wrapper__icon__up'
                    : 'products__total__wrapper__icon__down',
                ]"
                >&#xe6db;</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Docker :currentIndex="1" />
</template>

<script>
import {ref} from 'vue'
import { useStore } from "vuex";
import Docker from "../../components/Docker.vue";
export default {
  name: "CartList",
  components: {
    Docker,
  },
  setup() {
    const store = useStore();
    const cartList = store.state.cartList;
    const showProduct = ref(false);
    // 遍历为每个商铺商品列表添加upOrDown属性判断箭头方向
    Object.values(cartList).forEach((value) => {
      value.upOrDown = false;
      value.newProductList = [];
      Object.values(value.productList).forEach((product) => {
        product.showProduct = showProduct.value
        value.newProductList.push(product);
      });
      for (let i = 0; i < 2; i++) {
        value.newProductList[i].showProduct = true;
      }
    });
    const handleShowProductList = (index) => {
      cartList[index].upOrDown = !cartList[index].upOrDown;
      showProduct.value = !showProduct.value;
      for(let i=2;i<cartList[index].newProductList.length;i++){
        cartList[index].newProductList[i].showProduct = showProduct.value
      }
    };
    return {
      cartList,
      handleShowProductList,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";
.wrapper {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0.5rem;
  background: #f8f8f8;
}
.title {
  font-size: 0.16rem;
  line-height: 0.44rem;
  text-align: center;
  color: $content-fontcolor;
  background: $bgColor;
}
.products {
  margin: 0.16rem 0.18rem;
  background: $bgColor;
  border-radius: 0.04rem;
  &__title {
    padding: 0.16rem;
    font-size: 0.16rem;
    color: $content-fontcolor;
  }
  &__wrapper {
    overflow-y: scroll;
    margin: 0 0.16rem;
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0 0 0.16rem 0;
    &__img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &__details {
      flex: 1;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__price {
      display: flex;
      margin: 0.06rem 0 0 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $highlight-fontColor;
    }
    &__total {
      text-align: right;
      flex: 1;
      color: $dark-foncolor;
    }
    &__yen {
      font-size: 0.12rem;
    }
  }
  &__total {
    background: $bgColor;
    height: 0.44rem;
    position: relative;
    &__wrapper {
      margin-top: 0.16rem;
      height: 0.28rem;
      background: $search-bgColor;
      position: absolute;
      bottom: 0.16rem;
      left: 0rem;
      right: 0rem;
      &__desc {
        text-align: center;
        line-height: 0.24rem;
        font-size: 0.14rem;
        color: $light-fontColor;
      }
      &__icon {
        display: inline-block;
        text-align: center;
        font-size: 0.2rem;
        color: $light-fontColor;
        &__up {
          transform: rotate(90deg);
          padding-left: 0.04rem;
        }
        &__down {
          transform: rotate(270deg);
        }
      }
    }
  }
}
</style>
