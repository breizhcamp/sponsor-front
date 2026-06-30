import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import NewSponsorView from '@/views/NewSponsorView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import SponsorApplicationSentView from '@/views/SponsorApplicationSentView.vue';

const INITIAL_TITLE = document.title;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home' },
    }, {
      path: '/sponsors/new',
      name: 'newSponsor',
      component: NewSponsorView,
      meta: { title: 'Nouveau Sponsor' },
    }, {
      path: '/sponsors/application-sent',
      name: 'sponsorApplicationSent',
      component: SponsorApplicationSentView,
      meta: { title: 'Nouveau Sponsor' },
    }, {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: NotFoundView,
      meta: { title: '404 Not Found' },
    },
  ],
});

router.beforeEach((to) => {
  const { title } = to.meta;
  const resolvedTitle = typeof title === 'function' ? title(to) : title;
  document.title = `${resolvedTitle} \u2022 ${INITIAL_TITLE}`;
});

export default router;
