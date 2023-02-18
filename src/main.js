import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Lazyload, Notify, Toast   } from 'vant';


createApp(App)
    .use(Lazyload, {
        loading: require('assets/images/default.png'),
        lazyComponent: true,
        
    })
    .use(Notify)
    .use(Toast)
    .use(store)
    .use(router)
    .mount('#app')
