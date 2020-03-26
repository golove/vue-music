const version = '__VERSION__'
import musicComponent from './Music.vue'

export function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('Music', musicComponent);
}

const plugin = {
  install,
  version
};

export const Music = musicComponent;

let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default plugin;
