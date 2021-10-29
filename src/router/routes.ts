import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/echart', component: () => import('pages/echart.vue') },
      { path: '/echart2', component: () => import('pages/echart2.vue') },
      { path: '/date', component: () => import('pages/echart_date.vue') },
      { path: '/page', component: () => import('pages/page.vue') },
      { path: '/eeg', component: () => import('pages/eeg.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
