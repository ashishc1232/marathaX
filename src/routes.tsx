import { RouteObject } from 'react-router';
import { lazy } from 'react';
import MarathaxHomePage from './pages/marathax/index';
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

const MarathaxAboutPage = lazy(() => import('./pages/marathax/about'));
const MarathaxFormatPage = lazy(() => import('./pages/marathax/event-format'));
const MarathaxCategoriesPage = lazy(() => import('./pages/marathax/categories-prizes'));
const MarathaxRegisterPage = lazy(() => import('./pages/marathax/register'));
const MarathaxGalleryPage = lazy(() => import('./pages/marathax/gallery'));
const MarathaxContactPage = lazy(() => import('./pages/marathax/contact'));
const MarathaxDeclarationPage = lazy(() => import('./pages/marathax/declaration'));
const MarathaxAdminPage = lazy(() => import('./pages/marathax/admin'));
const MarathaxCheckinPage = lazy(() => import('./pages/marathax/checkin'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MarathaxHomePage />,
  },
  {
    path: '/about',
    element: <MarathaxAboutPage />,
  },
  {
    path: '/event-format',
    element: <MarathaxFormatPage />,
  },
  {
    path: '/categories-prizes',
    element: <MarathaxCategoriesPage />,
  },
  {
    path: '/register',
    element: <MarathaxRegisterPage />,
  },
  {
    path: '/gallery',
    element: <MarathaxGalleryPage />,
  },
  {
    path: '/contact',
    element: <MarathaxContactPage />,
  },
  {
    path: '/declaration',
    element: <MarathaxDeclarationPage />,
  },
  {
    path: '/marathax/admin',
    element: <MarathaxAdminPage />,
  },
  {
    path: '/marathax/checkin',
    element: <MarathaxCheckinPage />,
  },
  {
    id: 'airo-not-found',
    path: '*',
    element: <NotFoundPage />,
  },
];

export type Path = '/' | '/about' | '/event-format' | '/categories-prizes' | '/register' | '/gallery' | '/contact' | '/declaration';
export type Params = Record<string, string | undefined>;
