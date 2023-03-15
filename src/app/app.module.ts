import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SessionComponent} from './components/session.component';
import {PartComponent} from './components/part.component';
import {TimerComponent} from "./components/timer.component";
import {EditComponent} from "./components/edit.component";
import {DatePipe} from "./utils/date.pipe";

@NgModule({
  declarations: [
    AppComponent, SessionComponent, PartComponent, TimerComponent, DatePipe, EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
