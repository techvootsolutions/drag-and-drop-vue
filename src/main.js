import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import SimpleDragVue from './components/SimpleDrag.vue'
import App from './App.vue'
import './assets/css/style.css'

createApp(App).use(bootstrap).mount('#app')

export default {
    install(app) {
        app.component('SimpleDragVue', SimpleDragVue);
    }
}
