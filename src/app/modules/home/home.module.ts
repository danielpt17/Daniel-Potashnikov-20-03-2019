import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {HomeService} from './services/home.service';

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

  ],
  exports: []

})
export class HomeModule {
}
