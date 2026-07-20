import { createRouter, createWebHistory } from 'vue-router';

const INITIAL_TITLE = document.title;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Home' },
    }, {
      path: '/sponsors/new',
      name: 'newSponsor',
      component: () => import('@/views/NewSponsorView.vue'),
      meta: { title: 'Nouveau Sponsor' },
    }, {
      path: '/sponsors/application-sent',
      name: 'sponsorApplicationSent',
      component: () => import('@/views/SponsorApplicationSentView.vue'),
      meta: { title: 'Nouveau Sponsor' },
    }, {
      path: '/sponsors/infos',
      name: 'sponsorInformations',
      component: () => import('@/views/SponsorInformationsView.vue'),
      meta: { title: 'Informations' },
    }, {
      path: '/sponsors/agreement',
      name: 'sponsorAgreement',
      component: () => import('@/views/SponsorAgreementView.vue'),
      meta: { title: 'Convention' },
    }, {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: () => import('@/views/NotFoundView.vue'),
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
