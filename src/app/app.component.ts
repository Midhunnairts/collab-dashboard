import { Component } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'dashboard-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'real-time-editor-frontend';
  constructor(){
    
  }
}
