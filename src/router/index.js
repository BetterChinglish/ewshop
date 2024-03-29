import { createRouter, createWebHistory } from 'vue-router'
import HomeView from 'views/HomeView.vue'
import store from '@/store';
import { showToast } from 'vant';
const Category = () => import(/* webpackChunkName: "category" */ 'views/category/Category.vue');
const Detail = () => import(/* webpackChunkName: "detail" */ '../views/detail/Detail.vue');
const Profile = () => import(/* webpackChunkName: "profile" */ '../views/profile/Profile.vue');
const Shopcart = () => import(/* webpackChunkName: "shopcart" */ '../views/shopcart/Shopcart.vue');
const Register = () => import(/* webpackChunkName: "Register" */ '../views/profile/Register.vue');
const Login = () => import(/* webpackChunkName: "Login" */ '../views/profile/Login.vue');
const Address = () => import(/* webpackChunkName: "Address" */ '../views/profile/Address.vue');
const AddressEdit = () => import(/* webpackChunkName: "AddressEdit" */ '../views/profile/AddressEdit.vue');
const AddressModify = () => import(/* webpackChunkName: "AddressModify" */ '../views/profile/AddressModify.vue');

const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component: HomeView,
    meta: {
      title: 'ewshop'
    }
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'ewshop'
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta: {
      title: '分类'
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: '商品详情',
    }
  },
  {
    path: '/shopcart',
    name: 'Shopcart',
    component: Shopcart,
    meta: {
      title: '购物车',

      // 是否需要登录才能访问
      isAuthRequired: true,
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '个人中心',
      
      // 是否需要登录才能访问
      isAuthRequired: true,
    }
  },

  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '用户注册'
    }
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '用户登录'
    }
  },

  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: {
      title: '地址管理',
      isAuthRequired: true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title: '地址编辑',
      isAuthRequired: true
    }
  },

  {
    path: '/addressmodify',
    name: 'AddressModify',
    component: AddressModify,
    meta: {
      title: '地址修改',
      isAuthRequired: true
    }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {

  document.title = to.meta.title;
  // 没有注册可以在此拦截进行注册
  if (to.meta.isAuthRequired && store.state.user.isLogin == false) {
    showToast({
      message: '请先登录',
      type: 'fail',
      duration: 2000,
    })
    return next('/login');
  }
  else {
    next();
  }


})
export default router
