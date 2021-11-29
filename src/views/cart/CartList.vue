<template>
  <div class="wrapper">
    <div class="title">我的全部购物车（2）</div>
    
  </div>
  <Docker :currentIndex="1" />
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
  name: "CartList",
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
</style>
