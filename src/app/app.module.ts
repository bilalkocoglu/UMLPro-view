import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import {Routes, RouterModule} from '@angular/router';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { FooterComponent } from './components/footer/footer.component';
import { MovableAreaComponent } from './components/movable-area/movable-area.component';
import { ActionsComponent } from './components/actions/actions.component';
import {DraggableModule} from './draggable/draggable.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'workspace', component: WorkspaceComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WorkspaceComponent,
    FooterComponent,
    MovableAreaComponent,
    ActionsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    DraggableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    })
  ],
  providers: [
    MovableAreaComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
