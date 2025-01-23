import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorComponent } from './editor/editor.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  { path: '', component: DashboardComponent ,canActivate:[AuthGuard]},
  { path: 'editor/:fileId', component: EditorComponent,canActivate:[AuthGuard] },
  { path: '**', redirectTo: "dashboard" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      urlUpdateStrategy: 'eager',
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/dashboard' }],
})
export class AppRoutingModule {}
