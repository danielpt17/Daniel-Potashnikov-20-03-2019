import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {HomeService} from './services/home.service';
import {NgxUiLoaderModule} from 'ngx-ui-loader';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  providers: [
    HomeService,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,

  ],
  exports: []

})
export class HomeModule {
}
