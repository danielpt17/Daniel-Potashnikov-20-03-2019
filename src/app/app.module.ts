import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgxUiLoaderModule} from 'ngx-ui-loader';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from './core/core.module';
import {ToastrModule} from 'ngx-toastr';
import {OverlayModule} from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    NgxUiLoaderModule,
    ToastrModule.forRoot({preventDuplicates: true}),
    MatTooltipModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
