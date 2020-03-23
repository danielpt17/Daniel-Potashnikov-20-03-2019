import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FavoritesComponent} from './favorites.component';
import {FavoritesRoutingModule} from './favorites-routing.module';
import {NgxUiLoaderModule} from 'ngx-ui-loader';

@NgModule({
  declarations: [
    FavoritesComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    FavoritesRoutingModule,
  ],
  exports: []

})
export class FavoritesModule {
}
