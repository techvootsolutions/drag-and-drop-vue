import { createApp } from 'vue'
import SimpleDragVue from './components/SimpleDrag.vue'
import App from './App.vue'
import './assets/css/style.css'

createApp(App).mount('#app')

export default {
    install(app) {
        app.component('SimpleDragVue', SimpleDragVue);
    }
}
