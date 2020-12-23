import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false
// 上线后需要修改为 实际的 外网IP
Vue.prototype.servername = 'http://47.92.150.78'
// 'http://kforquestionnaire.xyz'
Vue.use(ElementUI)

axios.defaults.baseURL = '/'

Vue.use(VueAxios, axios)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
