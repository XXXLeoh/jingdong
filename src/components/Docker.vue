<template>
  <div class="docker">
    <div
      v-for="(item, index) in dockerList"
      :key="item.icon"
      :class="{ docker__item: true, 'docker__item--active': index === currentIndex }"
    >
      <router-link :to="item.to">
        <div class="iconfont" v-html="item.icon"></div>
        <div class="docker__title">{{ item.text }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "docker",
  props:{
    currentIndex:Number,
  },
  setup() {
    const dockerList = [
      { icon: "&#xe601;", text: "首页", to: { name: "Home" } },
      { icon: "&#xe600;", text: "购物车", to: { name: "CartList" } },
      { icon: "&#xe60a;", text: "订单", to: { name: "OrderList" } },
      { icon: "&#xe78b;", text: "我的", to: { name: "Home" } },
    ];
    return {
      dockerList,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/viriables.scss";
.docker {
  display: flex;
  position: absolute;
  box-sizing: border-box;
  padding: 0 0.18rem;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.49rem;
  border-top: .01rem solid $content-bgColor;
  &__item {
    flex: 1;
    text-align: center;
    a {
      color: $content-fontcolor;
      text-decoration: none;
    }
    .iconfont {
      margin: 0.07rem 0 0.02rem 0;
      font-size: 0.18rem;
    }
    &--active {
      a {
        color: #1fa4fc;
      }
    }
  }
  &__title {
    font-size: 0.2rem;
    transform: scale(0.5, 0.5);
    transform-origin: center top;
  }
  color: $content-fontcolor;
}
</style>
