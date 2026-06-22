import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';

const INITIAL_TITLE = document.title;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' },
    },
  ],
});

router.beforeEach((to, _, next) => {
  const { title } = to.meta;
  const resolvedTitle = typeof title === 'function' ? title(to) : title;
  document.title = `${resolvedTitle} \u2022 ${INITIAL_TITLE}`;
  next();
});

export default router;
