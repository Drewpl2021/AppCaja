import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/layouts/angular/navbar/navbar.component';
import { RedesComponent } from './components/layouts/angular/redes/redes.component';
import { FoooterComponent } from './components/layouts/angular/foooter/foooter.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RedesComponent,
    FoooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
