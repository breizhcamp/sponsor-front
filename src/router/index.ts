import { ref } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { useKeycloakStore } from '@/stores/keycloak.store';

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
      meta: {
        title: 'Informations',
        requiresAuth: true,
      },
    }, {
      path: '/sponsors/agreement',
      name: 'sponsorAgreement',
      component: () => import('@/views/SponsorAgreementView.vue'),
      meta: {
        title: 'Convention',
        requiresAuth: true,
      },
    }, {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '404 Not Found' },
    },
  ],
});

export const isRouterNavigating = ref(false);

router.beforeEach(async (to) => {
  isRouterNavigating.value = true;
  const { title, requiresAuth } = to.meta;

  if (requiresAuth) {
    const { requireAuthentication } = useKeycloakStore();
    await requireAuthentication(location.origin + to.fullPath);
  }

  const resolvedTitle = typeof title === 'function' ? title(to) : title;
  document.title = `${resolvedTitle} \u2022 ${INITIAL_TITLE}`;
});

router.afterEach(() => {
  isRouterNavigating.value = false;
});

export default router;
