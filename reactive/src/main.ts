import { createApp } from 'vue';

import AppStore from './AppStore.vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// import App from './App.vue';
// createApp(App).mount('#app');

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(AppStore).use(pinia).mount('#app');
