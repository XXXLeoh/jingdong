<template>
  <div class="products">
    <div class="products__title">{{ shopName }}</div>
    <div class="products__wrapper">
      <div class="products__list">
        <div class="products__list__items">
          <div
            class="products__item"
            v-for="item in productsSimpleList"
            :key="item.id"
            v-show="item.showProduct"
          >
            <img :src="item.imgUrl" class="products__item__img" />
            <div class="products__item__details">
              <h4 class="products__item__title">{{ item.name }}</h4>
              <p class="products__item__price">
                <span>
                  <span class="products__item__yen">&yen;</span
                  >{{ item.price }} x
                  {{ item.count }}
                </span>
                <span class="products__item__total">
                  <span class="products__item__yen">&yen;</span
                  >{{ (item.price * item.count).toFixed(2) }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="products__total" v-if="productsSimpleList.length > 2">
          <div class="products__total__wrapper">
            <div
              class="products__total__wrapper__desc"
              @click="handleShowProductList"
            >
              共计{{ productsSimpleList.length }}种
              <span
                class="products__total__wrapper__icon iconfont"
                :class="[
                  showProductList
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
</template>

<script>
import { ref } from "vue";
import { useCommonCartEffect } from "../../effects/cartEffect";
import { useRoute } from "vue-router";
export default {
  name: "ProductList",
  setup() {
    const route = useRoute();
    const shopId = route.params.id;
    const { productList, shopName } = useCommonCartEffect(shopId);
    const productsSimpleList = [];
    const showProductList = ref(false);
    // 数据结构改为数组类型，添加length属性
    Object.values(productList.value).forEach((value) => {
      value.showProduct = showProductList.value;
      productsSimpleList.push(value);
    });
    for (let i = 0; i < 2; i++) {
      productsSimpleList[i].showProduct = true;
    }
    const handleShowProductList = () => {
      showProductList.value = !showProductList.value;
      for (let i = 2; i < productsSimpleList.length; i++) {
        productsSimpleList[i].showProduct = showProductList.value;
      }
    };
    return {
      shopName,
      productsSimpleList,
      handleShowProductList,
      showProductList,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";
.products {
  margin: 0.16rem 0.18rem 0.2rem 0.18rem;
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
  &__list {
    background: $bgColor;
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
