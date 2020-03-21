import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FavoritesComponent} from './favorites.component';
import {FavoritesRoutingModule} from './favorites-routing.module';

@NgModule({
  declarations: [
    FavoritesComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    FavoritesRoutingModule
  ],
  exports: []

})
export class FavoritesModule {
}
