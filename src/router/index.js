import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component:()=>import(/* webpackChunkName:"home" */ "../views/home/Home.vue")
  },
  {
    path: "/cart",
    name: "CartList",
    component:()=>import(/* webpackChunkName:"CartList" */ "../views/cart/CartList.vue")
  },
  {
    path: "/orderComfirmation/:id",
    name: "OrderComfirmation",
    component:()=>import(/* webpackChunkName:"OrderComfirmation" */ "../views/orderComfirmation/OrderComfirmation.vue")
  },
  {
    path: "/orderList",
    name: "OrderList",
    component:()=>import(/* webpackChunkName:"OrderList" */ "../views/orderList/OrderList.vue")
  },
  {
    path: "/register",
    name: "Register",
    component:()=>import(/* webpackChunkName:"register" */ "../views/register/Register.vue"),
    beforeEnter(to, from, next) {
      const { isLogin } = localStorage;
      isLogin ? next({ name: "Home" }) : next();
    },
  },
  {
    path: "/login",
    name: "Login",
    component:()=>import(/* webpackChunkName:"login" */ "../views/login/Login.vue"),
    beforeEnter(to, from, next) {
      const { isLogin } = localStorage;
      isLogin ? next({ name: "Home" }) : next();
    },
  },
  {
    path: "/shop/:id",
    name: "Shop",
    component:()=>import(/* webpackChunkName:"shop" */ "../views/shop/Shop.vue")
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isLogin } = localStorage;
  const { name } = to;
  const isLoginOrRegister = name === "Login" || name === "Register";
  isLogin || isLoginOrRegister ? next() : next({ name: "Login" });
});

export default router;
