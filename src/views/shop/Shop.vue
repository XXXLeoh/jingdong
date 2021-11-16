<template>
  <div class="wrapper">
    <div class="search">
      <div class="search__back iconfont" @click="handleBack">&#xe6db;</div>
      <div class="search__content">
        <span class="search__content__icon iconfont">&#xe603;</span>
        <input class="search__content__input" placeholder="请输入商品名称" />
      </div>
    </div>
    <ShopInfo :item="item" :borderHider="true" v-show="item.imgUrl" />
    <Content :shopName="item.name" />
    <Cart />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { get } from "../../utils/request.js";
import ShopInfo from "../../components/ShopInfo.vue";
import Content from "./Content.vue";
import Cart from "./Cart.vue";

// 获取当前商铺信息
const useShopInfoEffect = () => {
  const data = reactive({ item: {} });
  const route = useRoute();
  const getItemData = async () => {
    const result = await get(`/api/shop/${route.params.id}`);
    data.item = result.data;
  };
  const { item } = toRefs(data);
  return {
    item,
    getItemData,
  };
};

const useBackRouterEffect = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return { handleBack };
};
export default {
  name: "Shop",
  components: {
    ShopInfo,
    Content,
    Cart
  },
  setup() {
    const { item, getItemData } = useShopInfoEffect();
    const { handleBack } = useBackRouterEffect();
    getItemData();
    return {
      item,
      handleBack,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
.wrapper {
  padding: 0 0.18rem;
}
.search {
  margin: 0.14rem 0 0.04rem 0;
  display: flex;
  line-height: 0.32rem;
  &__back {
    width: 0.3rem;
    font-size: 0.24rem;
    color: #b6b6b6;
  }
  &__content {
    flex: 1;
    background: $search-bgColor;
    border-radius: 0.16rem;
    display: flex;
    &__icon {
      width: 0.44rem;
      text-align: center;
      color: $search-fontcolor;
    }
    &__input {
      width: 100%;
      display: block;
      border: none;
      outline: none;
      background: none;
      padding-right: 0.2rem;
      height: 0.32rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      &::placeholder {
        color: $content-fontcolor;
      }
    }
  }
}
</style>
