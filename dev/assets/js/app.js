import 'assets/less/style.less'
import Vue from 'vue'
import AppComponent from './interactive/app.vue'

// mount our app component into our app container
new Vue({
  el: '#app',
  template: '<app-component></app-component>',
  components: {
    AppComponent,
  },
})
