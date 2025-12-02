import { Routes } from '@angular/router';
import { Layout } from './walls/layouts/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./walls/pages/wall-table-page/wall-table-page').then((c) => c.WallTablePage),
      },
      {
        path: 'reporte',
        loadComponent: () =>
          import('./walls/pages/report-page/report-page').then((c) => c.ReportPage),
      },
      {
        path: 'muro/:id',
        loadComponent: () =>
          import('./walls/pages/wall-detail-page/wall-detail-page').then((c) => c.WallDetailPage),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./walls/pages/not-found-page/not-found-page').then((c) => c.NotFoundPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
