<template>
  <div class="content">
    <div class="category">
      <div
        :class="{
          category__item: true,
          'category__item--active': currentTab === item.tab,
        }"
        v-for="item in categories"
        :key="item.name"
        @click="handleTabClick(item.tab)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="product">
      <div class="product__item" v-for="item in list" :key="item._id">
        <img :src="item.imgUrl" class="product__item__img" />
        <div class="product__item__details">
          <h4 class="product__item__title">{{ item.name }}</h4>
          <p class="product__item__sales">月售 {{ item.sales }} 件</p>
          <p class="product__item__price">
            <span class="product__item__yen">&yen;</span>{{ item.price }}
            <span class="product__item__origin">&yen;{{ item.oldPrice }}</span>
          </p>
        </div>
        <div class="product__number">
          <span
            class="product__number__minus iconfont"
            @click="changeCartItem(shopId, item._id, item, -1, shopName)"
            >&#xe66d;</span
          >
          {{ getProductCartCount(shopId, item._id) }}
          <span
            class="product__number__add iconfont"
            @click="changeCartItem(shopId, item._id, item, 1, shopName)"
            >&#xe7e0;</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { get } from "../../utils/request.js";
import { useCommonCartEffect } from "../../effects/cartEffect";
const categories = [
  {
    name: "全部商品",
    tab: "all",
  },
  {
    name: "秒杀",
    tab: "seckill",
  },
  {
    name: "新鲜水果",
    tab: "fruit",
  },
];
//Tab 切换相关逻辑
const useTabEffect = () => {
  const currentTab = ref(categories[0].tab);
  const handleTabClick = (tab) => {
    currentTab.value = tab;
  };
  return {
    currentTab,
    handleTabClick,
  };
};
// 列表内容相关的逻辑
const useCurrentListEffect = (currentTab, shopId) => {
  const content = reactive({ list: [] });
  const getContentData = async () => {
    const result = await get(`/api/shop/${shopId}/products`, {
      tab: currentTab.value,
    });
    if (result?.errno === 0 && result?.data?.length) {
      content.list = result.data;
    }
  };
  // 使用watchEffect，会自动检测回调函数的依赖项，而且是首次家在就会执行，不存在惰性，就是不能获取数据之前的值，适合用来发送请求，不需要关注数据之前的值
  watchEffect(() => {
    getContentData();
  });
  const { list } = toRefs(content);
  return { list };
};

// 购物车相关逻辑
const useCartEffect = () => {
  const store = useStore();
  const { cartList, changeCartItemInfo } = useCommonCartEffect();
  const changeShopName = (shopId, shopName) => {
    store.commit("changeShopName", { shopId, shopName });
  };
  const changeCartItem = (shopId, productId, item, num, shopName) => {
    changeCartItemInfo(shopId, productId, item, num);
    changeShopName(shopId, shopName);
  };
  const getProductCartCount = (shopId, productId) => {
    return cartList?.[shopId]?.productList?.[productId]?.count ?? 0;
  };
  return {
    cartList,
    changeCartItem,
    getProductCartCount,
  };
};

export default {
  name: "Content",
  props: ["shopName"],
  setup() {
    const route = useRoute();
    const shopId = route.params.id;
    const { currentTab, handleTabClick } = useTabEffect();
    const { list } = useCurrentListEffect(currentTab, shopId);
    const { cartList, changeCartItem, getProductCartCount } = useCartEffect();
    return {
      categories,
      shopId,
      currentTab,
      handleTabClick,
      list,
      cartList,
      changeCartItem,
      getProductCartCount,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";

.content {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 1.5rem;
  bottom: 0.5rem;
}
.category {
  width: 0.76rem;
  height: 100%;
  overflow-y: scroll;
  background: $search-bgColor;
  &__item {
    line-height: 0.4rem;
    text-align: center;
    font-size: 0.14rem;
    color: $content-fontcolor;
    &--active {
      background: $bgColor;
    }
  }
}
.product {
  flex: 1;
  overflow-y: scroll;
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    border-bottom: 0.01rem solid $content-bgColor;
    &__img {
      width: 0.68rem;
      height: 0.68rem;
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
    &__sales {
      margin: 0.06rem 0;
      color: $content-fontcolor;
      font-size: 0.12rem;
    }
    &__price {
      margin: 0;
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
        top: 0.02rem;
        color: $medium-fontColor;
        margin-right: 0.05rem;
        font-size: 0.2rem;
      }
      &__add {
        position: relative;
        top: 0.02rem;
        color: $btn-bgColor;
        margin-left: 0.05rem;
        font-size: 0.2rem;
      }
    }
  }
}
</style>
