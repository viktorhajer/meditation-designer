import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SessionComponent} from './components/session.component';
import {PartComponent} from './components/part.component';
import {EditComponent} from './components/edit.component';
import {DatePipe} from './utils/date.pipe';

@NgModule({
  declarations: [
    AppComponent, SessionComponent, PartComponent, DatePipe, EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
