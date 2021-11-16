import { computed } from "vue";
import { useStore } from "vuex";

// 购物车相关逻辑
export const useCommonCartEffect = (shopId) => {
  const store = useStore();
  const cartList = store.state.cartList;
  const changeCartItemInfo = (shopId, productId, productInfo, num) => {
    store.commit("changeCartItemInfo", { shopId, productId, productInfo, num });
  };
  const productList = computed(() => {
    const productList = cartList[shopId]?.productList || {};
    const notEmptyProductList = {};
    for(let i in productList) {
      const product = productList[i];
      if(product.count>0){
        notEmptyProductList[i] = product
      }
    }
    return notEmptyProductList;
  });
  const shopName = computed(() => {
    const shopName = cartList[shopId]?.shopName || "";
    return shopName;
  });
  const caculations = computed(() => {
    const productList = cartList[shopId]?.productList;
    const result = {
      total: 0,
      price: 0,
      allChecked: true,
    };
    if (productList) {
      for (let i in productList) {
        result.total += productList[i].count;
        if (productList[i].check) {
          result.price += productList[i].count * productList[i].price;
        }
        if (productList[i].count > 0 && !productList[i].check) {
          result.allChecked = false;
        }
      }
    }
    result.price = result.price.toFixed(2);
    return result;
  });
  return { cartList, changeCartItemInfo, productList, shopName, caculations };
};
