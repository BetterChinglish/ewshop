import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// 样式
import 'vant/es/toast/style';
import 'vant/es/notify/style';

import { Lazyload, Notify, Toast, SwipeCell, AddressList     } from 'vant';


createApp(App)
    .use(Lazyload, {
        loading: require('assets/images/default.png'),
        lazyComponent: true,
        
    })
    .use(Notify)
    .use(AddressList)
    .use(SwipeCell)
    .use(Toast)
    .use(store)
    .use(router)
    .mount('#app')
