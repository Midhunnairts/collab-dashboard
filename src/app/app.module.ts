

//Directive

import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EditorComponent } from "./editor/editor.component";
import { EmptyRouteComponent } from "./empty-route/empty-route.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";

 
@NgModule({
  imports: [
    AppRoutingModule,
    EditorComponent,
    DashboardComponent,
    RouterModule,
    BrowserModule
  ],
  declarations: [
    AppComponent,
    EmptyRouteComponent
  ],
  bootstrap: [AppComponent],
  providers:[
    {
     provide: HTTP_INTERCEPTORS,
     useClass: JwtInterceptor,
     multi: true
   }
 ]
})
export class AppModule { }
