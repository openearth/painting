import Vue from 'vue';
import Router from 'vue-router';
import VMain from '@/components/VMain';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VMain',
      component: VMain
    }
  ]
});
