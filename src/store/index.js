import { createStore } from "vuex";

const setLocalCartList = (state) => {
  const { cartList } = state;
  const localCartList = JSON.stringify(cartList);
  localStorage.cartList = localCartList;
};

const getLocalCartList = () => {
  // return localStorage.cartList ? JSON.parse(localStorage.cartList) : {};
  try{
    return JSON.parse(localStorage.cartList)
  }catch(e){
    return {}
  }
};

export default createStore({
  state: {
    // // 第一层是商铺id
    // shopId:{
    //   shopName:'',
    //   productList:{
    //     //第二层是商品id，内容是商品内容和购物数量
    //     productId:{
    //     }
    //   }
    // }
    cartList: getLocalCartList(),
  },
  mutations: {
    changeCartItemInfo(state, payload) {
      const { shopId, productId, productInfo } = payload;
      let shopInfo = state.cartList[shopId];
      if (!shopInfo) {
        shopInfo = { shopName: "", productList: {} };
      }
      let product = shopInfo.productList[productId];
      if (!product) {
        product = productInfo;
        product.count = 0;
      }
      product.count += payload.num;
      if (payload.num > 0) {
        product.check = true;
      }
      if (product.count < 0) {
        product.count = 0;
      }
      shopInfo.productList[productId] = product;
      state.cartList[shopId] = shopInfo;
      setLocalCartList(state);
    },
    changeShopName(state, payload) {
      const { shopId, shopName } = payload;
      const shopInfo = state.cartList[shopId] || {
        shopName: "",
        productList: {},
      };
      shopInfo.shopName = shopName;
      state.cartList[shopId] = shopInfo;
      setLocalCartList(state);
    },
    changeCartItemChecked(state, payload) {
      const { shopId, productId } = payload;
      const productItem = state.cartList[shopId].productList[productId];
      productItem.check = !productItem.check;
      setLocalCartList(state);
    },
    clearCartProduct(state, payload) {
      const { shopId } = payload;
      state.cartList[shopId].productList = {};
      setLocalCartList(state);
    },
    setCartItemIfChecked(state, payload) {
      const { shopId, allChecked } = payload;
      const products = state.cartList[shopId].productList;
      if (products) {
        if (!allChecked) {
          for (let key in products) {
            products[key].check = true;
          }
        } else {
          for (let key in products) {
            products[key].check = false;
          }
        }
      }
      setLocalCartList(state);
    },
    clearCart(state,shopId){
      state.cartList[shopId].productList = {}
    }
  },
  actions: {},
  modules: {},
});
