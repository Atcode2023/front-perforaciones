import type { RouteRecordRaw } from 'vue-router';

import { useAuth } from 'src/composables/useAuth';

const requireAuth = (to: any, from: any, next: any) => {
  const { token } = useAuth();
  if (token.value) {
    next();
  } else {
    next('/login');
  }
};

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: requireAuth,
    children: [{ path: '', component: () => import('pages/UsersPage.vue') }],
  },
  {
    path: '/projects',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      { path: '', component: () => import('pages/ProjectsPage.vue') },
      { path: ':id', component: () => import('pages/ProjectViewPage.vue'), props: true },
    ],
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
