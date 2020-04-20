import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

import router from "./router";
import store from "./store";

import Cesium from "./components/cesium";
Vue.use(Cesium);

import AC from "./utils/AC";
Vue.use(AC);

import Window from "./components/window";
Vue.use(Window);

//引入图标库
import { library } from '@fortawesome/fontawesome-svg-core'
// 事实上官方不推荐使用下面的方式将整个库引入到项目中
import { fas } from '@fortawesome/free-solid-svg-icons'
// 如果确实需要下面的图标就把注释取消
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from '@fortawesome/vue-fontawesome'

// library.add与import对应
library.add(fas)
library.add(far)
library.add(fab)

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

require('./assets/style/index.less');

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
