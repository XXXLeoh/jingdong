<template>
<div class="title">我的订单</div>
  <div class="wrapper">
    
    <div class="orders">
      <div class="order" v-for="(item, index) in list" :key="index">
        <div class="order__title">
          {{ item.shopName }}
          <span class="order__status">
            {{ item.isCanceled ? "已取消" : "已下单" }}
          </span>
        </div>
        <div class="order__content">
          <div class="order__content__imgs">
            <template
              v-for="(innerItem, index) in item.products"
              :key="index"
            >
              <img
                :src="innerItem.product.img"
                class="order__content__img"
                v-if="index <= 3"
              />
            </template>
          </div>
          <div class="order__content__info">
            <div class="order__content__price">¥{{item.totalPrice}}</div>
            <div class="order__content__count">共{{item.totalNum}}件</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Docker :currentIndex="2" />
</template>

<script>
import { reactive, toRefs } from "vue";
import Docker from "../../components/Docker.vue";
import { get } from "../../utils/request";
// 处理订单列表逻辑
const useOrderListEffect = () => {
  const data = reactive({ list: {} });
  const getNearbyList = async () => {
    const result = await get("/api/order");
    if (result?.errno === 0 && result?.data?.length) {
      const orderList = result.data
      orderList.forEach(order=>{
        const products = order.products || []
        let totalPrice = 0
        let totalNum = 0
        products.forEach(productItem=>{
          totalNum += (productItem?.orderSales || 0)
          totalPrice += ((productItem?.product?.price * productItem?.orderSales) || 0)
        })
        order.totalPrice = totalPrice
        order.totalNum = totalNum
      })
      data.list = result.data;
    }
  };
  getNearbyList();
  const { list } = toRefs(data);
  return { list };
};
export default {
  name: "OrderList",
  components: {
    Docker,
  },
  setup() {
    const { list } = useOrderListEffect();
    console.log(list);
    return { list };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
.wrapper {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: .44rem;
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
}
.order {
  margin: 0.16rem 0.18rem;
  padding: 0.16rem;
  background: $bgColor;
  &__title {
    margin-bottom: 0.16rem;
    font-size: 0.16rem;
    color: $content-fontcolor;
    line-height: 0.22rem;
  }
  &__status {
    float: right;
    font-size: 0.14rem;
    color: $light-fontColor;
  }
  &__content {
    display: flex;
    &__imgs {
      flex: 1;
    }
    &__img {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.12rem;
    }
    &__info {
      width: 0.7rem;
    }
    &__price {
      margin-bottom: 0.04rem;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $highlight-fontColor;
      text-align: right;
    }
    &__count {
      line-height: 0.14rem;
      font-size: 0.12rem;
      color: $content-fontcolor;
      text-align: right;
    }
  }
}
</style>
