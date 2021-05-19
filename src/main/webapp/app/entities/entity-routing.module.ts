import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'attribute',
        data: { pageTitle: 'dicoCarmignacApp.attribute.home.title' },
        loadChildren: () => import('./attribute/attribute.module').then(m => m.AttributeModule),
      },
      {
        path: 'business-object',
        data: { pageTitle: 'dicoCarmignacApp.businessObject.home.title' },
        loadChildren: () => import('./business-object/business-object.module').then(m => m.BusinessObjectModule),
      },
      {
        path: 'source',
        data: { pageTitle: 'dicoCarmignacApp.source.home.title' },
        loadChildren: () => import('./source/source.module').then(m => m.SourceModule),
      },
      {
        path: 'data-service',
        data: { pageTitle: 'dicoCarmignacApp.dataService.home.title' },
        loadChildren: () => import('./data-service/data-service.module').then(m => m.DataServiceModule),
      },
      {
        path: 'data-role',
        data: { pageTitle: 'dicoCarmignacApp.dataRole.home.title' },
        loadChildren: () => import('./data-role/data-role.module').then(m => m.DataRoleModule),
      },
      {
        path: 'role-management',
        data: { pageTitle: 'dicoCarmignacApp.roleManagement.home.title' },
        loadChildren: () => import('./role-management/role-management.module').then(m => m.RoleManagementModule),
      },
      {
        path: 'source-priority',
        data: { pageTitle: 'dicoCarmignacApp.sourcePriority.home.title' },
        loadChildren: () => import('./source-priority/source-priority.module').then(m => m.SourcePriorityModule),
      },
      {
        path: 'ordered-source',
        data: { pageTitle: 'dicoCarmignacApp.orderedSource.home.title' },
        loadChildren: () => import('./ordered-source/ordered-source.module').then(m => m.OrderedSourceModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
